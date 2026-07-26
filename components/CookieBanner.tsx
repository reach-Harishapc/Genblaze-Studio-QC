'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-[100] sm:p-6 md:p-8 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-studio-card border border-studio-border p-6 rounded-2xl shadow-2xl shadow-black/50 pointer-events-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-backblaze-500/10 rounded-xl shrink-0">
            <Cookie className="w-6 h-6 text-backblaze-500" />
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">Privacy Choices & Cookies</h3>
            <p className="text-sm text-studio-muted leading-relaxed">
              We use cookies to ensure you get the best experience on our website, analyze site traffic, and support our Backblaze B2 authentication flows. 
              <a href="/privacy" className="text-backblaze-500 hover:underline ml-1">Learn more in our Privacy Policy.</a>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            onClick={declineCookies}
            className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-studio-muted hover:text-white bg-studio-dark/50 hover:bg-studio-dark border border-studio-border rounded-xl transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-white bg-backblaze-500 hover:bg-backblaze-600 rounded-xl transition-colors"
          >
            Accept All
          </button>
          <button onClick={declineCookies} className="p-2 text-studio-muted hover:text-white transition-colors ml-2 hidden sm:block">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
