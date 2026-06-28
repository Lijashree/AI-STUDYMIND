import { useEffect, useState } from "react";
import { api, formatApiError } from "../lib/api";
import { Loader2, Clock, Trash2, Inbox, Filter } from "lucide-react";
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

const TOPICS = Object.keys(TOPIC_COLORS);

function TopicBadge({ topic }) {
  const c = TOPIC_COLORS[topic] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      {topic}
    </span>
  );
}

export default function HistoryPage() {
  const [items, setItems] = useState(null);
  const [topic, setTopic] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = async (t) => {
    setItems(null);
    try {
      const { data } = await api.get("/questions/history", {
        params: t ? { topic: t } : {},
      });
      setItems(data);
    } catch (e) {
      toast.error(formatApiError(e));
      setItems([]);
    }
  };

  useEffect(() => {
    load(topic);
  }, [topic]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/questions/${id}`);
      setItems((prev) => prev.filter((q) => q.id !== id));
      toast.success("Question deleted.");
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">History</h1>
          <p className="mt-2 text-slate-500">Every question you've asked, newest first.</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          >
            <option value="">All topics</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {items === null && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
        </div>
      )}

      {items && items.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold">No questions yet</p>
          <p className="text-slate-400 text-sm mt-1">
            {topic ? `No ${topic} questions found.` : "Ask something on the Dashboard to get started."}
          </p>
        </div>
      )}

      {items && items.length > 0 && (
        <ul className="space-y-3 fade-in">
          {items.map((q) => (
            <li
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 card-shadow p-5 flex items-start justify-between gap-4 flex-wrap"
            >
              <div className="flex-1 min-w-[220px]">
                <p className="text-slate-800 leading-relaxed">{q.text}</p>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <TopicBadge topic={q.topic} />
                  <span className="text-xs text-slate-400">
                    {(q.topic_confidence * 100).toFixed(0)}% confidence
                  </span>
                  <span className="text-xs text-slate-400">
                    {q.similar_count} similar question{q.similar_count === 1 ? "" : "s"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(q.id)}
                disabled={deletingId === q.id}
                className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                title="Delete question"
              >
                {deletingId === q.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
