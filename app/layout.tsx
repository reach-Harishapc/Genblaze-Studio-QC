import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import ClientFooter from '@/components/ClientFooter';

export const metadata: Metadata = {
  title: 'Genblaze Studio | Agentic Media & Backblaze B2 Vault',
  description: 'Agentic Generative Multimodal AI Media & Self-Healing Quality Control Studio with Backblaze B2 Object Archival and C2PA Provenance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-studio-bg text-studio-text antialiased flex flex-col selection:bg-backblaze-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
          {/* Footer removed from global layout to avoid duplication, it will be placed inside protected layouts if needed, but for now we just remove the global one since the marketing page has its own. Wait, the studio dashboard needs a footer too. Let's create a ClientFooter wrapper. */}
          <ClientFooter />
        </body>
      </html>
    );
  }
