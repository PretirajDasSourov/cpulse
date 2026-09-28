import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CPulse — Your Competitive Programming Journey, Unified',
  description: 'Track problems, ratings, contests, streaks, and progress across coding platforms.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-cyan-500 selection:text-zinc-950">{children}</body>
    </html>
  );
}\n