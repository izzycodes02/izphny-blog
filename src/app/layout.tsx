import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.scss';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
import { getPostsByYear, getAllTags } from '@/lib/posts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'izphny ✷ blog',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#35291d]`}
      >
        <div className="flex justify-center min-h-screen bg-white shadow-lg shadow-black">
          <div className="flex flex-col md:flex-row md:w-[720px] h-dvh w-full">
            <div className="sm:hidden">
              <MobileHeader postsByYear={postsByYear} tags={tags} />
            </div>

            <Sidebar postsByYear={postsByYear} tags={tags} />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
