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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('maanaksetu_theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
