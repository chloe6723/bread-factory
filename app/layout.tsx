import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '面包时钟｜你的智能烘焙车间',
  description: '从食谱、备料到分步计时与作品记录，陪你轻松完成每一次烘焙。',
  openGraph: {
    title: '面包时钟',
    description: '你的智能烘焙车间',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '面包时钟',
    description: '你的智能烘焙车间',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
