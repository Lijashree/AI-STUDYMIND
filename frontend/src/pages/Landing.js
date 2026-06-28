import { Link } from "react-router-dom";
import { Brain, Sparkles, Search, Tag, BarChart3, ArrowRight, BookOpen, CheckCircle } from "lucide-react";

const features = [
  { icon: Search, title: "Semantic Search", desc: "Find similar past questions using sentence-transformer embeddings & cosine similarity — not keyword matching.", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Tag,    title: "Auto-Tagging",    desc: "Every question is automatically classified into a topic (Biology, Physics, Math…) using AI similarity.", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: BarChart3, title: "Personal Analytics", desc: "Track what you study most. Filter your history by topic and review patterns over time.", color: "text-blue-600", bg: "bg-blue-50" },
];

const stats = [
  { value: "384", label: "dimensions per embedding" },
  { value: "10",  label: "auto-detected topics" },
  { value: "0.30", label: "similarity threshold" },
  { value: "<2s", label: "average analysis time" },
];

const steps = [
  { n: "01", title: "Ask your question",   desc: "Type any study question — from photosynthesis to calculus to Roman history." },
  { n: "02", title: "AI embeds & tags",    desc: "all-MiniLM-L6-v2 encodes it into a 384-dim vector and classifies the topic." },
  { n: "03", title: "See similar questions", desc: "Cosine similarity surfaces the top-5 related questions from your knowledge base." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Nav */}
      <header className="glass-panel sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-slate-900">StudyMind</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors">
              Sign in
            </Link>
            <Link to="/signup" className="px-4 py-2 text-sm font-semibold text-white gradient-brand hover:opacity-90 rounded-xl shadow-sm transition-opacity">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" /> AI-Powered Study Platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Ask smarter.{" "}
              <span className="text-gradient">Study deeper.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl">
              StudyMind finds the most semantically similar past questions to anything you ask and auto-tags the topic — powered by real sentence-embedding AI, not keyword matching.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3.5 gradient-brand text-white font-semibold rounded-xl shadow-lg transition-opacity hover:opacity-90">
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/8 hover:bg-white/12 text-white font-semibold rounded-xl border border-white/10 transition-colors">
                I have an account
              </Link>
            </div>
          </div>

          {/* Demo card */}
          <div className="mt-16 max-w-2xl">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Live analysis preview</div>
              <div className="bg-white/8 rounded-xl p-4 text-slate-300 text-sm leading-relaxed italic mb-4">
                "Why does the mitochondria produce ATP through oxidative phosphorylation?"
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/20 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">Biology · 94%</span>
                </div>
                <div className="text-slate-500 text-xs">3 similar questions found</div>
                <div className="ml-auto flex items-center gap-1 text-xs text-indigo-400 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Analyzed in 1.2s
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="gradient-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold tracking-tight">{s.value}</div>
              <div className="text-indigo-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">How it works</div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Real AI, not just search</h2>
          <p className="mt-4 text-slate-600">
            Every question is encoded into a 384-dim vector with{" "}
            <code className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 text-sm">all-MiniLM-L6-v2</code>{" "}
            and matched by cosine similarity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-200 card-shadow card-hover">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.bg}`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <h2 className="text-3xl font-extrabold tracking-tight mb-12 text-center">From question to insight in seconds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <div key={i}>
                <div className="text-5xl font-black text-indigo-500/30 mb-3">{s.n}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="gradient-brand rounded-3xl p-12 lg:p-16 text-white text-center shadow-2xl">
          <BookOpen className="w-12 h-12 mx-auto mb-5 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Build your knowledge base today</h2>
          <p className="mt-4 text-white/80 max-w-xl mx-auto">Free to use. No credit card required.</p>
          <Link to="/signup" className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
            Create your account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg gradient-brand flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-slate-700">StudyMind</span>
        </div>
        Built with FastAPI · React · MongoDB · sentence-transformers
      </footer>
    </div>
  );
}