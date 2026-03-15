'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PostsByYear, TagCount } from '../types/blog';

interface SidebarProps {
  postsByYear: PostsByYear;
  tags: TagCount[];
}

export default function Sidebar({ postsByYear, tags }: SidebarProps) {
  const [openYears, setOpenYears] = useState<string[]>([]);
  const [openTags, setOpenTags] = useState(false);

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

  return (
    <aside className="w-64 h-screen sticky top-0 p-6 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Blog Logo and Title */}
      <div className="mb-8">
        <div className="text-2xl mb-2">📝</div>
        <Link
          href="/"
          className="text-xl font-bold hover:text-gray-600 dark:hover:text-gray-300"
        >
          iz.phny blog
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="block py-1 hover:text-gray-600 dark:hover:text-gray-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/posts"
              className="block py-1 hover:text-gray-600 dark:hover:text-gray-300"
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
                  className="flex items-center justify-between w-full py-1 text-left hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span>
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
                            href={`/posts/filter?year=${year}&month=${month}`}
                            className="block py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                          >
                            {month} ({posts.length})
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
              <ul className="space-y-1">
                {topTags.map(({ tag, count }) => (
                  <li key={tag}>
                    <Link
                      href={`/posts/filter?tag=${encodeURIComponent(tag)}`}
                      className="block py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      #{tag} ({count})
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </nav>

      {/* Optional: Footer */}
      <div className="mt-auto pt-6 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} iz.phny</p>
      </div>
    </aside>
  );
}
