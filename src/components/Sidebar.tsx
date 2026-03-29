'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PostsByYear, TagCount } from '../types/blog';
import Image from 'next/image';

interface SidebarProps {
  postsByYear: PostsByYear;
  tags: TagCount[];
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  postsByYear,
  tags,
  isMobileMenuOpen,
  onClose,
}: SidebarProps) {
  const [openYears, setOpenYears] = useState<string[]>([]);
  const [openTags, setOpenTags] = useState(false);
  const [openPCModules, setOpenPCModules] = useState(false);

  const toggleYear = (year: string) => {
    setOpenYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  // Calculate total posts per year
  const getYearTotal = (year: string) => {
    const months = postsByYear[year];
    return Object.values(months).reduce((acc, posts) => acc + posts.length, 0);
  };

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear).sort(
    (a, b) => Number(b) - Number(a),
  );

  // Get top 5 tags
  const topTags = tags.slice(0, 5);

  const pcModules = [
    { name: 'Module 1', link: '/personal-curriculum/module-one' },
  ];

  const sidebarContent = (
    <>
      {/* Blog Logo and Title */}
      <div className="flex items-center mb-2 flex-col border border-gray-200 p-1">
        <Image
          src="/profile.jpg"
          alt="Blog Logo"
          width={100}
          height={100}
          className="w-full rounded-sm"
        />
        <Link
          href="/"
          className="text-lg mt-1 font-bold hover:text-gray-600 dark:hover:text-gray-300 font-serif"
          onClick={onClose}
        >
          @izphny
        </Link>
      </div>

      {/* Blinkies and stamps */}
      <div className="w-full flex flex-col gap-1 mb-6">
        <Image
          src="https://64.media.tumblr.com/728288fc5eca98653320359b1b37bea2/a28ae0e85c39e0d8-d0/s250x400/59b21c3d71dfe5b49442638fd558c49604f38f7a.gif"
          alt="Stamp 1"
          width={50}
          height={50}
          className="w-full"
        />
        {/* stamps */}
        <div className="flex gap-1 w-full">
          <Image
            src="https://64.media.tumblr.com/1424058e488e3d5c1b55dc8380c71dba/7c5f710738a8057a-e6/s100x200/91bfb061bfd97fb3dec994c432532347eee85f07.gif"
            alt="Stamp 1"
            width={50}
            height={50}
            className="w-full"
          />
          <Image
            src="https://64.media.tumblr.com/87c74466c2379ca3d737283381e7ebaf/7c5f710738a8057a-18/s100x200/13bc111af4ad48f23acc082035fb308eb500fda4.gif"
            alt="Stamp 1"
            width={50}
            height={50}
            className="w-full"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="block py-1 hover:text-gray-600 hover:underline"
              onClick={onClose}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/posts"
              className="block py-1 hover:text-gray-600 hover:underline"
              onClick={onClose}
            >
              Posts
            </Link>
          </li>
        </ul>

        {/* Years Accordion */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Years</h3>
          <ul className="space-y-1">
            {sortedYears.map((year) => (
              <li key={year}>
                <button
                  onClick={() => toggleYear(year)}
                  className="flex items-center justify-between w-full py-1 text-left hover:text-gray-600 group"
                >
                  <span className="group-hover:underline">
                    {year} [{getYearTotal(year)}]
                  </span>
                  <span>{openYears.includes(year) ? '▼' : '▶'}</span>
                </button>

                {/* Months Accordion Content */}
                {openYears.includes(year) && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {Object.entries(postsByYear[year])
                      .sort((a, b) => {
                        // Sort months in chronological order
                        const monthOrder = [
                          'January',
                          'February',
                          'March',
                          'April',
                          'May',
                          'June',
                          'July',
                          'August',
                          'September',
                          'October',
                          'November',
                          'December',
                        ];
                        return (
                          monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0])
                        );
                      })
                      .map(([month, posts]) => (
                        <li key={`${year}-${month}`}>
                          <Link
                            href={`/posts?year=${year}&month=${month}`}
                            className="block py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:underline"
                            onClick={onClose}
                          >
                            {month} [{posts.length}]
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Tags Accordion */}
        {topTags.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setOpenTags(!openTags)}
              className="flex items-center justify-between w-full font-semibold mb-2"
            >
              <span>Tags</span>
              <span>{openTags ? '▼' : '▶'}</span>
            </button>

            {openTags && (
              <ul className="ml-4 space-y-1">
                {topTags.map(({ tag, count }) => (
                  <li key={tag}>
                    <Link
                      href={`/posts?tag=${encodeURIComponent(tag)}`}
                      className="block py-1 text-gray-600 hover:text-gray-900 hover:underline"
                      onClick={onClose}
                    >
                      #{tag} ({count})
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Personal Curriculum Modules */}
        <div className="mt-6">
          <button
            onClick={() => setOpenPCModules(!openPCModules)}
            className="flex items-center justify-between w-full font-semibold mb-2"
          >
            <span>Personal Curriculum</span>
            <span>{openPCModules ? '▼' : '▶'}</span>
          </button>

          {openPCModules && (
            <ul className="space-y-1 ml-4">
              <li>
                <Link
                  href="/personal-curriculum"
                  className="block py-1 text-gray-600  hover:text-gray-900 hover:underline"
                  onClick={onClose}
                >
                  Overview
                </Link>
              </li>
              {pcModules.map((module, index) => (
                <li key={index}>
                  <Link
                    href={module.link}
                    className="block py-1 text-gray-600  hover:text-gray-900 hover:underline"
                    onClick={onClose}
                  >
                    {module.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      {/* Optional: Footer */}
      <div className="mt-auto pt-6 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} izphny</p>
      </div>
    </>
  );

  // For desktop, render as normal sidebar
  // For mobile, render as full-screen overlay menu
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className=" hidden md:flex w-44 h-screen sticky top-0 pb-3 pl-6 pr-0 pt-8 flex-col flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Full-Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <aside className="absolute inset-0 bg-white overflow-y-auto p-3 pt-8 flex flex-col">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
              aria-label="Close menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
