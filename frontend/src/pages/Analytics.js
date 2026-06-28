import { useEffect, useState } from "react";
import { api, formatApiError } from "../lib/api";
import { Loader2, BarChart3, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const TOPIC_COLORS = {
  Biology:           { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", bar: "#10b981" },
  Physics:           { text: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    bar: "#3b82f6" },
  Chemistry:         { text: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200",  bar: "#f97316" },
  Math:              { text: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200",  bar: "#8b5cf6" },
  "Computer Science":{ text: "text-cyan-700",    bg: "bg-cyan-50",    border: "border-cyan-200",    bar: "#06b6d4" },
  History:           { text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   bar: "#f59e0b" },
  Geography:         { text: "text-teal-700",    bg: "bg-teal-50",    border: "border-teal-200",    bar: "#14b8a6" },
  Literature:        { text: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200",    bar: "#f43f5e" },
  Economics:         { text: "text-yellow-700",  bg: "bg-yellow-50",  border: "border-yellow-200",  bar: "#eab308" },
  Psychology:        { text: "text-pink-700",    bg: "bg-pink-50",    border: "border-pink-200",    bar: "#ec4899" },
};

function TopicBadge({ topic }) {
  const c = TOPIC_COLORS[topic] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {topic}
    </span>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { topic, count } = payload[0].payload;
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg px-3 py-2 text-sm">
      <div className="font-semibold text-slate-900">{topic}</div>
      <div className="text-slate-500">{count} question{count === 1 ? "" : "s"}</div>
    </div>
  );
}

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/analytics");
        setStats(data);
      } catch (e) {
        toast.error(formatApiError(e));
        setStats(false);
      }
    })();
  }, []);

  if (stats === null) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (stats === false) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-12 text-center">
        <p className="text-slate-500">Couldn't load analytics. Try refreshing.</p>
      </div>
    );
  }

  const chartData = Object.entries(stats.by_topic)
    .map(([topic, count]) => ({ topic, count, fill: TOPIC_COLORS[topic]?.bar || "#6366f1" }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Analytics</h1>
        <p className="mt-2 text-slate-500">What you've been studying, at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Total questions</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{stats.total_questions}</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Topics covered</div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{stats.topics_used} / 10</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Top topic</div>
          <div className="mt-2">
            {chartData[0] && chartData[0].count > 0 ? (
              <TopicBadge topic={chartData[0].topic} />
            ) : (
              <span className="text-slate-400 text-sm">—</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Questions by topic</h2>
        </div>

        {stats.total_questions === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 font-medium">No data yet</p>
            <p className="text-slate-400 text-sm mt-1">Ask a few questions to see your breakdown here.</p>
          </div>
        ) : (
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="topic"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 card-shadow p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
        </div>

        {!stats.recent_activity?.length ? (
          <p className="text-slate-400 text-sm">Nothing here yet.</p>
        ) : (
          <ul className="space-y-3">
            {stats.recent_activity.map((q) => (
              <li key={q.id} className="p-4 rounded-xl border border-slate-100">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <p className="text-slate-800 flex-1 min-w-[180px] text-sm leading-relaxed">{q.text}</p>
                  <TopicBadge topic={q.topic} />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
