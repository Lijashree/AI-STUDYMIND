import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api, formatApiError } from "../lib/api";
import { Loader2, Mail, Calendar, User as UserIcon, Hash, Shield } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const TOPIC_COLORS = {
  Biology:           { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", bar: "#10b981" },
  Physics:           { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-500",    bar: "#3b82f6" },
  Chemistry:         { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-500",  bar: "#f97316" },
  Math:              { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "bg-violet-500",  bar: "#8b5cf6" },
  "Computer Science":{ bg: "bg-cyan-50",    text: "text-cyan-700",    border: "border-cyan-200",    dot: "bg-cyan-500",    bar: "#06b6d4" },
  History:           { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   bar: "#f59e0b" },
  Geography:         { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200",    dot: "bg-teal-500",    bar: "#14b8a6" },
  Literature:        { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200",    dot: "bg-rose-500",    bar: "#f43f5e" },
  Economics:         { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-200",  dot: "bg-yellow-500",  bar: "#eab308" },
  Psychology:        { bg: "bg-pink-50",    text: "text-pink-700",    border: "border-pink-200",    dot: "bg-pink-500",    bar: "#ec4899" },
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

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/analytics");
        setStats(data);
      } catch (e) {
        toast.error(formatApiError(e));
      }
    })();
  }, []);

  if (!user) return null;

  const initials = user.name.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
  const memberSince = user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : "—";

  const infoRows = [
    { icon: UserIcon, label: "Full name",      value: user.name },
    { icon: Mail,     label: "Email address",  value: user.email },
    { icon: Calendar, label: "Member since",   value: memberSince },
    { icon: Hash,     label: "Total questions", value: stats ? stats.total_questions : null },
  ];

  const topicEntries = stats
    ? Object.entries(stats.by_topic).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Profile</h1>

      <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 md:p-8">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
            {initials}
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{user.name}</div>
            <div className="text-slate-500 text-sm mt-0.5">{user.email}</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoRows.map(row => (
            <div key={row.label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <row.icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{row.label}</div>
                <div className="mt-0.5 text-sm font-semibold text-slate-900">
                  {row.value === null ? <Loader2 className="w-4 h-4 animate-spin text-slate-400 inline" /> : row.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {topicEntries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Topic breakdown</h2>
          <div className="space-y-3">
            {topicEntries.map(([topic, count]) => {
              const total = topicEntries.reduce((a, [, v]) => a + v, 0);
              const pct = Math.round((count / total) * 100);
              const c = TOPIC_COLORS[topic] || { bar: "#6366f1" };
              return (
                <div key={topic} className="flex items-center gap-3">
                  <div className="w-28 shrink-0"><TopicBadge topic={topic} /></div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.bar }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Shield className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">How the AI works</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          Every question is embedded into a 384-dimensional vector using{" "}
          <code className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-indigo-700 font-mono text-xs">
            sentence-transformers/all-MiniLM-L6-v2
          </code>
          . The topic tag is chosen by cosine-similarity to pre-computed topic prototype embeddings.
          Similar past questions are found by comparing cosine similarity across all stored vectors —
          returning the top 5 above a 0.30 threshold. All processing happens server-side via FastAPI,
          with results persisted in MongoDB Atlas.
        </p>
      </div>
    </div>
  );
}