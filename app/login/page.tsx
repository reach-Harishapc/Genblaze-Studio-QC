'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('backblaze2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Force router refresh to pick up the new cookie
        router.push('/studio');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-studio-card border border-studio-border rounded-2xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-backblaze-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center relative z-10 space-y-2">
          <div className="w-12 h-12 bg-backblaze-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-backblaze-500/20">
            <ShieldCheck className="w-6 h-6 text-backblaze-500" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-tight">Access Secure Vault</h1>
          <p className="text-studio-muted text-sm">Enter the demo password to access the Genblaze Studio & Backblaze B2 Vault.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-studio-muted">Demo Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-studio-dark/50 border border-studio-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-backblaze-500 focus:ring-1 focus:ring-backblaze-500 transition-all"
                placeholder="Enter password..."
              />
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-backblaze-500 hover:bg-backblaze-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Studio'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
        
        <div className="text-center text-xs text-studio-muted pt-4 border-t border-studio-border/50 relative z-10">
          <p>For Hackathon Judges: The password is pre-filled (backblaze2026).</p>
        </div>
      </div>
    </div>
  );
}
