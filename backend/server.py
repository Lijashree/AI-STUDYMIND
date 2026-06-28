"""FastAPI server for StudyMind AI."""
import os
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

load_dotenv()

from auth import hash_password, verify_password, create_access_token, get_current_user_id
from embeddings import embed_text, classify_topic, find_similar, TOPICS

app = FastAPI(title="StudyMind API", version="1.0.0")

# CORS
origins_raw = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
origins = [o.strip() for o in origins_raw.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
_client: Optional[AsyncIOMotorClient] = None

def get_db():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(os.environ["MONGO_URL"])
    return _client[os.environ.get("DB_NAME", "studymind_db")]


def safe_object_id(id_str: str) -> ObjectId:
    """Convert a string to an ObjectId, raising a clean HTTP error instead of
    an unhandled 500 if the id is malformed."""
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail="Invalid id.")


def fmt_id(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


# ── Pydantic models ──────────────────────────────────────────────────────────

class SignupBody(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=200)
    password: str = Field(min_length=6, max_length=200)


class LoginBody(BaseModel):
    email: str
    password: str


class QuestionBody(BaseModel):
    text: str = Field(min_length=3, max_length=2000)


# ── Root ─────────────────────────────────────────────────────────────────────

@app.get("/api/")
async def root():
    return {"message": "StudyMind API", "version": "1.0.0"}


# ── Auth ─────────────────────────────────────────────────────────────────────

@app.post("/api/auth/signup")
async def signup(body: SignupBody):
    db = get_db()
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered.")
    doc = {
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "password_hash": hash_password(body.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    user_id = str(result.inserted_id)
    token = create_access_token(user_id, doc["email"])
    return {
        "token": token,
        "user": {"id": user_id, "name": doc["name"], "email": doc["email"], "created_at": doc["created_at"]},
    }


@app.post("/api/auth/login")
async def login(body: LoginBody):
    db = get_db()
    user = await db.users.find_one({"email": body.email.lower().strip()})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    user_id = str(user["_id"])
    token = create_access_token(user_id, user["email"])
    return {
        "token": token,
        "user": {"id": user_id, "name": user["name"], "email": user["email"], "created_at": user.get("created_at", "")},
    }


@app.get("/api/auth/me")
async def me(user_id: str = Depends(get_current_user_id)):
    db = get_db()
    oid = safe_object_id(user_id)
    user = await db.users.find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"id": user_id, "name": user["name"], "email": user["email"], "created_at": user.get("created_at", "")}


# ── Questions ─────────────────────────────────────────────────────────────────

@app.post("/api/questions")
async def ask_question(body: QuestionBody, user_id: str = Depends(get_current_user_id)):
    db = get_db()
    embedding = embed_text(body.text)
    topic, confidence = classify_topic(embedding)

    past = await db.questions.find(
        {"user_id": user_id},
        {"_id": 1, "text": 1, "topic": 1, "embedding": 1, "created_at": 1}
    ).to_list(length=500)

    similar_raw = find_similar(embedding, [{"id": str(d["_id"]), **d} for d in past])
    similar_ids = [s["id"] for s in similar_raw]

    doc = {
        "user_id": user_id,
        "text": body.text,
        "topic": topic,
        "topic_confidence": round(confidence, 4),
        "embedding": embedding.tolist(),
        "similar_question_ids": similar_ids,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.questions.insert_one(doc)
    question_id = str(result.inserted_id)

    similar_out = []
    for s in similar_raw:
        similar_out.append({
            "id": s["id"],
            "text": s["text"],
            "topic": s["topic"],
            "similarity": s["similarity"],
            "created_at": s.get("created_at", ""),
        })

    return {
        "id": question_id,
        "text": body.text,
        "topic": topic,
        "topic_confidence": round(confidence, 4),
        "similar_questions": similar_out,
    }


@app.get("/api/questions/history")
async def get_history(topic: Optional[str] = None, user_id: str = Depends(get_current_user_id)):
    db = get_db()
    query = {"user_id": user_id}
    if topic:
        query["topic"] = topic
    docs = await db.questions.find(query, {"embedding": 0}).sort("created_at", -1).to_list(length=200)
    result = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        d["similar_count"] = len(d.pop("similar_question_ids", []))
        result.append(d)
    return result


@app.get("/api/questions/{question_id}")
async def get_question(question_id: str, user_id: str = Depends(get_current_user_id)):
    db = get_db()
    oid = safe_object_id(question_id)
    doc = await db.questions.find_one({"_id": oid, "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Question not found.")
    doc["id"] = str(doc.pop("_id"))
    doc.pop("embedding", None)
    similar_ids = doc.pop("similar_question_ids", [])
    similar_docs = []
    for sid in similar_ids:
        try:
            s_oid = ObjectId(sid)
        except (InvalidId, TypeError):
            continue
        s = await db.questions.find_one({"_id": s_oid}, {"embedding": 0})
        if s:
            s["id"] = str(s.pop("_id"))
            similar_docs.append(s)
    doc["similar_questions"] = similar_docs
    return doc


@app.delete("/api/questions/{question_id}")
async def delete_question(question_id: str, user_id: str = Depends(get_current_user_id)):
    db = get_db()
    oid = safe_object_id(question_id)
    result = await db.questions.delete_one({"_id": oid, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found.")
    return {"deleted": True}


# ── Analytics ─────────────────────────────────────────────────────────────────

@app.get("/api/analytics")
async def analytics(user_id: str = Depends(get_current_user_id)):
    db = get_db()
    docs = await db.questions.find({"user_id": user_id}, {"embedding": 0}).sort("created_at", -1).to_list(length=1000)
    by_topic = {t: 0 for t in TOPICS}
    for d in docs:
        t = d.get("topic", "")
        if t in by_topic:
            by_topic[t] += 1
    recent = []
    for d in docs[:10]:
        recent.append({
            "id": str(d["_id"]),
            "text": d["text"],
            "topic": d["topic"],
            "created_at": d.get("created_at", ""),
        })
    return {
        "total_questions": len(docs),
        "topics_used": sum(1 for v in by_topic.values() if v > 0),
        "by_topic": by_topic,
        "recent_activity": recent,
    }


@app.get("/api/topics")
async def get_topics():
    return TOPICS
