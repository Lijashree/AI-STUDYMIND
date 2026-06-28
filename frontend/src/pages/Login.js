import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Brain, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) { toast.success("Welcome back!"); navigate("/dashboard"); }
    else { setError(res.error); toast.error(res.error); }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 flex-col">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 flex flex-col justify-between p-12 h-full text-white">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center">
              <Brain className="w-4 h-4 text-indigo-300" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg">StudyMind</span>
          </Link>
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
              Welcome back.<br />Your knowledge base awaits.
            </h2>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
              Pick up exactly where you left off — every question is searchable by meaning.
            </p>
            {["Semantic AI question matching", "Auto topic classification", "Personal study analytics"].map(f => (
              <div key={f} className="flex items-center gap-3 text-slate-300 text-sm mb-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900">StudyMind</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Email address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full h-11 gradient-brand text-white font-semibold rounded-xl transition-opacity hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}