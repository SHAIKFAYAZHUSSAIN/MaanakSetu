import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MaanakSetu — From Tender Requirement to Standards-Ready Specification',
  description:
    'AI procurement standards copilot for identifying applicable Indian Standards (IS), normative references, revision currency, and compulsory BIS/QCO regulatory compliance for government departments and PSUs.',
  keywords: [
    'MaanakSetu',
    'Bureau of Indian Standards',
    'Indian Standards',
    'BIS',
    'Public Procurement',
    'GeM',
    'CPWD',
    'Quality Control Orders',
    'QCO',
    'Tender Specifications',
    'Standards-Ready',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ivory text-charcoal antialiased selection:bg-brand selection:text-white">
        {children}
      </body>
    </html>
  );
}
