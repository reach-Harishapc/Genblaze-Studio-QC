import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-studio-dark text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-sm text-studio-muted hover:text-white transition-colors gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold font-mono tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-studio-muted leading-relaxed">
          <p>Last updated: August 4, 2026</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Genblaze Studio ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to all information collected through our website and application.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Data We Collect & Store</h2>
          <p>
            When you use Genblaze Studio to generate media, we collect and store:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Text prompts used for generation.</li>
            <li>Generated images, audio, and video files.</li>
            <li>Metadata associated with the generation (Quality Control scores, attempt counts, generation latency).</li>
          </ul>
          <p className="mt-4">
            <strong>All generated assets and metadata sidecars are durably archived in Backblaze B2 Object Storage.</strong> Backblaze B2 provides enterprise-grade security and immutability options for your data.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. AI Model Providers</h2>
          <p>
            Our application acts as an orchestration layer using the Genblaze Python SDK. When you request media generation, your prompts are securely transmitted to third-party AI model providers (such as GMI Cloud, OpenAI, or Pollinations.ai) solely for the purpose of executing the generation. We do not control the data retention policies of these third-party providers.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Cookies and Authentication</h2>
          <p>
            We use secure, HttpOnly cookies to authenticate your session (e.g., the `demo_auth` cookie). These are required for the application to function and secure your access to the Backblaze B2 Vault dashboard.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact the hackathon team via Devpost.
          </p>
        </div>
      </div>
    </div>
  );
}
