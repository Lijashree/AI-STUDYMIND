StudyMind AI – Similar Question Finder with Auto-Tagging
Overview

StudyMind AI is an intelligent study assistant that allows students to ask academic questions and receive similar previously asked questions using semantic similarity instead of simple keyword matching. The application also automatically classifies each question into an appropriate subject topic such as Biology, Physics, Mathematics, or Computer Science.

The project demonstrates the integration of Artificial Intelligence with a full-stack web application using React, FastAPI, MongoDB Atlas, and Sentence Transformers.
Features

    User Registration and Login with JWT Authentication

    Ask study-related questions

    Semantic Similarity Search using Sentence Transformers

    Automatic Topic Classification

    Stores question history in MongoDB Atlas

    Displays previously asked similar questions

    View personal question history

    Filter questions based on topic

    RESTful API built with FastAPI

    Responsive React Frontend

Tech Stack
Frontend

    React.js

    HTML5

    CSS3

    JavaScript

    Axios

Backend

    FastAPI

    Python

    JWT Authentication

    Motor (MongoDB Async Driver)

Database

    MongoDB Atlas

AI / Machine Learning

    Sentence Transformers

    NumPy

    Cosine Similarity


Workflow

    User signs up or logs in.

    User submits a study question.

    The backend generates a semantic embedding for the question.

    The embedding is compared with previously stored questions using cosine similarity.

    The system identifies the most similar questions.

    The backend assigns a topic tag using embedding-based similarity.

    The question, topic, embedding, and similar question IDs are stored in MongoDB Atlas.

    Users can view their question history and filter it by topic.

API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/signup	Register a new user
POST	/api/auth/login	User login
GET	/api/auth/me	Get current user
Questions
Method	Endpoint	Description
POST	/api/questions	Ask a new question
GET	/api/questions/history	View question history
GET	/api/questions/{id}	View a specific question
DELETE	/api/questions/{id}	Delete a question
Analytics
Method	Endpoint	Description
GET	/api/analytics	View analytics
GET	/api/topics	Get available topics
Environment Variables

Create a .env file inside the backend folder.

MONGO_URL=your_mongodb_connection_string
DB_NAME=studymind_db
JWT_SECRET_KEY=your_secret_key
CORS_ORIGINS=http://localhost:3000

Installation
Clone Repository

git clone https://github.com/Lijashree/AI-STUDYMIND.git
cd AI-STUDYMIND

Backend

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Frontend

cd frontend
npm install
npm start

AI Logic
Semantic Embeddings

Each question is converted into a dense vector using the Sentence Transformers model. Unlike keyword search, semantic embeddings capture the meaning of a sentence, enabling the system to find conceptually similar questions.
Cosine Similarity

Cosine similarity measures how close two question embeddings are. Questions with higher similarity scores are presented as related questions.
Topic Classification

The system compares the generated embedding with predefined topic embeddings and assigns the most relevant academic subject automatically.
Future Enhancements

    Multi-language support

    AI-generated answers using Large Language Models

    Question bookmarking

    Admin dashboard

    Personalized study recommendations

    Performance analytics

    PDF notes generation

    Voice-based question input
