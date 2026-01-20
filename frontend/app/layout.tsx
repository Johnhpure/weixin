import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Layers } from 'lucide-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeCreate AI - 智创·公众号生成",
  description: "AI-powered content creation for WeChat Official Accounts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 dark:bg-black dark:text-white transition-colors duration-300`}
      >
        <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20"></div>

        <header className="fixed top-0 w-full z-50 glass-panel border-b border-gray-200/50 dark:border-gray-800/50 h-16 flex items-center px-6 justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center">
              <Layers size={18} />
            </div>
            <span>WeCreate AI</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">核心引擎</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">模版库</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">设置</a>
          </nav>
        </header>

        <main className="pt-24 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
