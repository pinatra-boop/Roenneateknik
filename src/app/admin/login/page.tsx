"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Loader2, Wrench } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Forkert email eller adgangskode");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-accent/20 mb-4">
            <Wrench size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Admin Login</h1>
          <p className="text-text-muted text-sm mt-1">Rønne Autoteknik CMS</p>
        </div>

        <div className="glass-light rounded-3xl border border-border p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-text-muted mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ronneautoteknik.dk"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Adgangskode
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/50 focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-accent hover:bg-accent-light text-white font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Logger ind...</>
              ) : (
                "Log ind"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
