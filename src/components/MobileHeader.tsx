'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PostsByYear, TagCount } from '@/types/blog';
import Sidebar from './Sidebar';
import { IconMenu2Filled } from '@tabler/icons-react';

interface MobileHeaderProps {
  postsByYear: PostsByYear;
  tags: TagCount[];
}

export default function MobileHeader({ postsByYear, tags }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-1 border border-gray-300 hover:bg-gray-100 rounded transition-colors MyPointerCursor"
          aria-label="Open menu"
        >
          <IconMenu2Filled className="w-5 h-5 MyPointerCursor" />
        </button>
        <Link href="/" className="text-xl font-medium font-serif">
          izphny ✷ blog
        </Link>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {isMenuOpen && <></>}

      <Sidebar
        postsByYear={postsByYear}
        tags={tags}
        isMobileMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
