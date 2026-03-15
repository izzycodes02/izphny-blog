import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.scss";
import Sidebar from '@/components/Sidebar';
import { getAllPosts, getPostsByYear, getAllTags } from '@/lib/posts';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'iz.phny | blog',
  description: 'Personal blog about dogs and life',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const postsByYear = getPostsByYear();
  const tags = getAllTags();
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="flex min-h-screen">
          <Sidebar postsByYear={postsByYear} tags={tags} />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
