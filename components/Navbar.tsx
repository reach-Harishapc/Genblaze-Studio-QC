'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Database, ShieldCheck, Sparkles, Activity, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [b2Status, setB2Status] = useState<{
    connected: boolean;
    bucket: string;
    isMock: boolean;
  } | null>(null);

  useEffect(() => {
    fetch('/api/b2/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setB2Status(data.status);
        }
      })
      .catch(() => {
        setB2Status({ connected: true, bucket: 'genblaze-ai-media-vault', isMock: true });
      });
  }, []);

  // Hide the global Navbar on public pages (Landing, Login, Legal)
  if (['/', '/login', '/privacy', '/terms'].includes(pathname)) {
    return null;
  }

  const navItems = [
    { name: 'Studio Prompt Engine', href: '/studio', icon: Sparkles },
    { name: 'B2 Asset Vault', href: '/gallery', icon: Database },
    { name: 'QC Analytics', href: '/analytics', icon: Activity },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-studio-border bg-studio-bg/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Tagline */}
          <Link href="/studio" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-flame-gradient shadow-lg shadow-backblaze-500/20 transition-transform group-hover:scale-105">
              <Flame className="h-6 w-6 text-white animate-pulse-glow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-mono">
                  GENBLAZE
                </span>
                <span className="hidden sm:inline-block rounded bg-backblaze-500/10 px-2 py-0.5 text-xs font-semibold text-backblaze-400 border border-backblaze-500/30">
                  STUDIO QC
                </span>
              </div>
              <p className="hidden sm:block text-xs text-studio-muted">
                Agentic Generative Media & B2 Provenance Vault
              </p>
            </div>
          </Link>

          {/* Top Right: Sign Out & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button 
              onClick={async () => {
                await fetch('/api/auth/signout', { method: 'POST' });
                window.location.href = '/';
              }}
              className="text-xs font-semibold text-studio-muted hover:text-white px-3 py-1.5 rounded-lg border border-studio-border hover:bg-studio-card transition-colors"
            >
              Sign Out
            </button>
            <button 
              className="md:hidden p-2 text-studio-muted hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Nav / Side-Nav */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-studio-bg border-r border-studio-border transform transition-transform duration-300 ease-in-out
        md:relative md:w-full md:transform-none md:border-b md:border-r-0 md:bg-studio-dark/20 md:z-10
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col md:flex-row md:items-center justify-between max-w-7xl mx-auto px-4 py-6 md:py-2 sm:px-6 lg:px-8 gap-8 md:gap-0 mt-16 md:mt-0 h-full md:h-auto overflow-y-auto md:overflow-visible">
          
          {/* Left side: Center Nav Links (Tabs) */}
          <nav className="flex flex-col md:flex-row md:items-center gap-2 md:gap-1 bg-transparent md:bg-studio-subtle/80 md:p-1.5 rounded-xl md:border border-studio-border">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 md:gap-2 rounded-lg px-4 md:px-3.5 py-3 md:py-1.5 text-base md:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-backblaze-500 text-white shadow-md shadow-backblaze-500/30'
                      : 'text-studio-muted hover:text-white hover:bg-studio-card'
                  }`}
                >
                  <Icon className="h-5 w-5 md:h-4 md:w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Backblaze B2 Health Badge & QC Active */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-3">
            <div className="flex items-center gap-3 md:gap-2 rounded-lg border border-studio-border bg-studio-card px-4 md:px-3 py-3 md:py-1.5 text-sm md:text-xs text-studio-text">
              <Database className="h-5 w-5 md:h-4 md:w-4 text-backblaze-500 shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-white">Backblaze B2</span>
                </div>
                <span className="text-[11px] md:text-[10px] text-studio-muted font-mono truncate max-w-[150px] md:max-w-[120px]">
                  {b2Status?.bucket || 'genblaze-vault'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-1 rounded-xl md:rounded-full bg-emerald-500/10 px-4 md:px-2.5 py-3 md:py-1 text-sm md:text-xs text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5 md:h-3.5 md:w-3.5 shrink-0" />
              <span className="font-mono">Self-Healing QC Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
}
