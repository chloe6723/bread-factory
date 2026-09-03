import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const sans = Geist({ variable: '--font-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: '麦麦面包房｜功能骨架 v0.3',
  description: '从面包美食家，到甜品师，再到面包房主理人的暖心面包生活。',
  openGraph: { title: '麦麦面包房', description: '记录今天吃了什么，也经营自己的梦幻面包房。', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: '麦麦面包房', description: '一间会慢慢长大的暖心面包房。', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
