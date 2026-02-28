import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AppB Backend',
  description: 'Email sending API',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}