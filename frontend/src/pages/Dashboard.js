import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api, formatApiError } from "../lib/api";
import { Loader2, Send, Tag, Sparkles, Clock, Brain, MessageSquare, Zap } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const TOPIC_COLORS = {
  Biology:           { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Physics:           { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500"    },
  Chemistry:         { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-500"  },
  Math:              { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-500"  },
  "Computer Science":{ bg: "bg-cyan-50",    text: "text-cyan-700",    border: "border-cyan-200",    dot: "bg-cyan-500"    },
  History:           { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500"   },
  Geography:         { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200",    dot: "bg-teal-500"    },
  Literature:        { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-500"    },
  Economics:         { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200",  dot: "bg-yellow-500"  },
  Psychology:        { bg: "bg-pink-50",    text: "text-pink-700",    border: "border-pink-200",    dot: "bg-pink-500"    },
};

function TopicBadge({ topic }) {
  const c = TOPIC_COLORS[topic] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      {topic}
    </span>
  );
}

const EXAMPLES = [
  "Why does photosynthesis need light?",
  "Explain Newton's third law with an example.",
  "How does inflation affect interest rates?",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e?.preventDefault();
    const q = text.trim();
    if (q.length < 3) { toast.error("Please write a longer question."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/questions", { text: q });
      setResult(data);
      setText("");
      toast.success(`Tagged as ${data.topic}`);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Hi, {firstName} 👋
        </h1>
        <p className="mt-2 text-slate-500">Ask a study question — StudyMind will tag the topic and surface similar past ones.</p>
      </div>

      {/* Ask card */}
      <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 md:p-8">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">Your question</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={2000}
          placeholder="e.g. Why does photosynthesis need light energy?"
          className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-base resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button key={i} type="button" onClick={() => setText(ex)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 font-medium transition-colors">
                {ex}
              </button>
            ))}
          </div>
          <button type="submit" disabled={loading || text.trim().length < 3}
            className="inline-flex items-center gap-2 px-6 h-11 gradient-brand text-white font-semibold rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? "Analyzing…" : "Ask StudyMind"}
          </button>
        </div>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-8 text-center fade-in">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
          <p className="text-slate-700 font-semibold">Embedding your question…</p>
          <p className="text-slate-400 text-sm mt-1">Running cosine similarity across your knowledge base</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-5 fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 md:p-8">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Your question</div>
                <p className="text-lg text-slate-900 leading-relaxed">{result.text}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Detected topic</div>
                <TopicBadge topic={result.topic} />
                <div className="mt-2 text-xs text-slate-500">
                  {(result.topic_confidence * 100).toFixed(1)}% confidence
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 md:p-8">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Similar past questions{" "}
                <span className="text-slate-400 font-normal text-sm">({result.similar_questions?.length ?? 0} found)</span>
              </h2>
            </div>
            {!result.similar_questions?.length ? (
              <div className="text-center py-8">
                <p className="text-slate-500 font-medium">First of its kind!</p>
                <p className="text-slate-400 text-sm mt-1">No similar questions yet — this one is unique in the knowledge base.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {result.similar_questions.map(s => (
                  <li key={s.id} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <p className="text-slate-800 flex-1 min-w-[180px] text-sm leading-relaxed">{s.text}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <TopicBadge topic={s.topic} />
                        <span className="text-indigo-600 text-xs font-bold">{(s.similarity * 100).toFixed(1)}% match</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}