import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MaanakSetu - BIS SmartSpec AI | Indian Standards Procurement Engine',
  description:
    'AI-powered Indian Standards recommendation, normative knowledge graph, version tracking, and compulsory QCO certification engine for public procurement tenders.',
  keywords: [
    'BIS',
    'Bureau of Indian Standards',
    'Indian Standards',
    'Public Procurement',
    'GeM',
    'QCO',
    'SmartSpec AI',
    'MaanakSetu',
    'Tender Specifications',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
