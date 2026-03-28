'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PostsByYear, TagCount } from '@/types/blog';
import Sidebar from './Sidebar';

interface MobileHeaderProps {
  postsByYear: PostsByYear;
  tags: TagCount[];
}

export default function MobileHeader({ postsByYear, tags }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <Link href="/" className="text-xl font-bold">
          izphny blog
        </Link>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      <Sidebar
        postsByYear={postsByYear}
        tags={tags}
        isMobileMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
