'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, PlayCircle, Database, ShieldCheck, Zap } from 'lucide-react';
import CookieBanner from '@/components/CookieBanner';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "The Agentic Engine for",
      highlight: "Generative Media.",
      description: "Prompt AI models with automated Quality Control, self-healing retries, and durable archival to Backblaze B2 Object Storage."
    },
    {
      title: "Self-Healing",
      highlight: "Quality Control.",
      description: "Automatically evaluate generated assets against strict thresholds. Failed generations are instantly refined and retried."
    },
    {
      title: "Immutable C2PA",
      highlight: "Provenance.",
      description: "Securely archive media, metadata sidecars, and cryptographically signed provenance data directly into your Backblaze B2 Vault."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-studio-dark text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="w-full border-b border-studio-border/50 bg-studio-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-backblaze-500 to-red-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold font-mono tracking-tight">Genblaze <span className="text-backblaze-500">Studio</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-studio-muted hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-backblaze-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center relative z-10">
          <div className="min-h-[220px] md:min-h-[200px] flex flex-col justify-center transition-opacity duration-500">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              {slides[currentSlide].title} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-backblaze-500 to-red-500">
                {slides[currentSlide].highlight}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-studio-muted max-w-2xl mx-auto mb-10">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Carousel Indicators */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-backblaze-500' : 'w-2 bg-studio-border hover:bg-studio-muted'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-backblaze-500 hover:bg-backblaze-600 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 group">
              Open Studio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://youtu.be/_0vQmE3hHcU" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-studio-card border border-studio-border hover:border-studio-muted text-white font-bold rounded-full transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5 text-studio-muted" />
              Watch Demo
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-studio-border/30">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-studio-card/50 border border-studio-border p-8 rounded-2xl">
              <Database className="w-10 h-10 text-purple-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Durable B2 Storage</h3>
              <p className="text-studio-muted">Automatically archive every generated image, video, and audio file to your immutable Backblaze B2 Vault with C2PA sidecars.</p>
            </div>

            <div className="bg-studio-card/50 border border-studio-border p-8 rounded-2xl">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Agentic Quality Control</h3>
              <p className="text-studio-muted">Our Genblaze orchestrator evaluates media for resolution, artifacts, and prompt fidelity before saving, ensuring production quality.</p>
            </div>

            <div className="bg-studio-card/50 border border-studio-border p-8 rounded-2xl">
              <Zap className="w-10 h-10 text-amber-500 mb-6" />
              <h3 className="text-xl font-bold mb-3">Self-Healing Retries</h3>
              <p className="text-studio-muted">If a generation fails the QC threshold, the pipeline automatically refines parameters and retries the prompt with the AI provider.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-studio-border/50 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="w-5 h-5" />
            <span className="font-mono font-bold tracking-tight">Genblaze Studio</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-studio-muted">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}
