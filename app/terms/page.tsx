import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-studio-dark text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-sm text-studio-muted hover:text-white transition-colors gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold font-mono tracking-tight mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-studio-muted leading-relaxed">
          <p>Last updated: August 4, 2026</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using Genblaze Studio, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Hackathon Use</h2>
          <p>
            This application was created as a submission for the <strong>Backblaze Generative Media Hackathon: Build with Genblaze on B2</strong> hosted on Devpost. The software is provided "as is", without warranty of any kind.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Content and AI Generation</h2>
          <p>
            Our service allows you to generate media using AI models. You are solely responsible for the prompts you provide and the resulting media. You agree not to use the service to generate illegal, harmful, or explicitly offensive content.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Storage and Data</h2>
          <p>
            Generated assets are stored in Backblaze B2 Object Storage. We reserve the right to delete, modify, or manage this storage as part of the normal operation of this demo application.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Disclaimer</h2>
          <p>
            Genblaze Studio is a demonstration prototype. We shall not be held liable for any damages resulting from the use or inability to use the service.
          </p>
        </div>
      </div>
    </div>
  );
}
