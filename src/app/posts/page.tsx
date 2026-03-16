'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  fetchPostsByYear,
  fetchAllTags,
  fetchPostsByTag,
} from '@/actions/posts';
import type { PostsByYear, BlogPost, TagCount } from '@/types/blog';

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for posts data
  const [postsByYear, setPostsByYear] = useState<PostsByYear | null>(null);
  const [allTags, setAllTags] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);

  // Get filter values from URL
  const yearFilter = searchParams.get('year') || '';
  const monthFilter = searchParams.get('month') || '';
  const tagFilter = searchParams.get('tag') || '';

  // Local state for form inputs
  const [selectedYear, setSelectedYear] = useState(yearFilter);
  const [selectedMonth, setSelectedMonth] = useState(monthFilter);
  const [selectedTag, setSelectedTag] = useState(tagFilter);

  // Fetch all data on the client
  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, tagsData] = await Promise.all([
          fetchPostsByYear(),
          fetchAllTags(),
        ]);
        setPostsByYear(postsData);
        setAllTags(tagsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update local state when URL params change
  useEffect(() => {
    setSelectedYear(yearFilter);
    setSelectedMonth(monthFilter);
    setSelectedTag(tagFilter);
  }, [yearFilter, monthFilter, tagFilter]);

  // Get available years for dropdown
  const availableYears = postsByYear
    ? Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))
    : [];

  // Get available months based on selected year
  const availableMonths =
    selectedYear && postsByYear?.[selectedYear]
      ? Object.keys(postsByYear[selectedYear]).sort((a, b) => {
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
          return monthOrder.indexOf(a) - monthOrder.indexOf(b);
        })
      : [];

  // Filter posts based on URL params
  const filteredPostsByYear = useMemo(() => {
    if (!postsByYear) return {};

    // If no filters, return all
    if (!yearFilter && !monthFilter && !tagFilter) {
      return postsByYear;
    }

    const filtered: PostsByYear = {};

    Object.entries(postsByYear).forEach(([year, months]) => {
      if (yearFilter && year !== yearFilter) return;

      Object.entries(months).forEach(([month, posts]) => {
        if (monthFilter && month !== monthFilter) return;

        // Filter by tag if needed
        const filteredPosts = tagFilter
          ? posts.filter((post) => post.tags.includes(tagFilter))
          : posts;

        if (filteredPosts.length > 0) {
          if (!filtered[year]) {
            filtered[year] = {};
          }
          filtered[year][month] = filteredPosts;
        }
      });
    });

    return filtered;
  }, [postsByYear, yearFilter, monthFilter, tagFilter]);

  // Sort years for display
  const years = Object.keys(filteredPostsByYear).sort(
    (a, b) => Number(b) - Number(a),
  );

  // Handle filter application
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedYear) params.set('year', selectedYear);
    if (selectedMonth) params.set('month', selectedMonth);
    if (selectedTag) params.set('tag', selectedTag);
    router.push(`/posts?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedYear('');
    setSelectedMonth('');
    setSelectedTag('');
    router.push('/posts');
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full p-3 flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading posts...</div>
      </div>
    );
  }

  // Error state
  if (!postsByYear) {
    return (
      <div className="w-full p-3 flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Failed to load posts</div>
      </div>
    );
  }

  return (
    <div className="w-full p-3">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>

      {/* Filters Section */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
        <div className="flex items-end gap-2">
          {/* Year Filter */}
          <div className="flex-1">
            <label
              htmlFor="year"
              className="block font-semibold text-gray-700 dark:text-gray-300"
            >
              Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth('');
              }}
              className="w-full px-1 py-1 border border-gray-300 rounded bg-white text-gray-900"
            >
              <option value="">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year} (
                  {Object.values(postsByYear[year]).reduce(
                    (acc, posts) => acc + posts.length,
                    0,
                  )}
                  )
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex-1">
            <label
              htmlFor="month"
              className="block font-semibold text-gray-700 dark:text-gray-300"
            >
              Month
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={!selectedYear}
              className="w-full px-1 py-1 border border-gray-300 rounded bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Months</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month} ({postsByYear[selectedYear]?.[month]?.length || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Tags Filter */}
          <div className="flex-1">
            <label
              htmlFor="tags"
              className="block font-semibold text-gray-700 dark:text-gray-300"
            >
              Tags
            </label>
            <select
              id="tags"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-1 py-1 border border-gray-300 rounded bg-white text-gray-900"
            >
              <option value="">All Tags</option>
              {allTags.map(({ tag, count }) => (
                <option key={tag} value={tag}>
                  #{tag} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
        </div>

        <div className="flex gap-2 mt-3 w-full justify-center">
          <button
            onClick={applyFilters}
            className="px-3 py-1 bg-gray-950 text-white rounded hover:bg-gray-800 transition-colors"
          >
            apply filters
          </button>
          {(yearFilter || monthFilter || tagFilter) && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded italic hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(yearFilter || monthFilter || tagFilter) && (
          <div className="mt-3 text-gray-600 dark:text-gray-400 text-center">
            Active filters:{' '}
            {yearFilter && (
              <span className="inline-flex items-center mr-2">
                Year: {yearFilter}
              </span>
            )}
            {monthFilter && (
              <span className="inline-flex items-center mr-2">
                Month: {monthFilter}
              </span>
            )}
            {tagFilter && (
              <span className="inline-flex items-center mr-2">
                Tag: #{tagFilter}
              </span>
            )}
            <span className="ml-1 text-purple-600 ">
              (
              {Object.values(filteredPostsByYear).reduce(
                (acc, months) =>
                  acc +
                  Object.values(months).reduce(
                    (sum, posts) => sum + posts.length,
                    0,
                  ),
                0,
              )}{' '}
              posts)
            </span>
          </div>
        )}
      </div>

      {/* Posts Display */}
      {years.length > 0 ? (
        years.map((year) => (
          <section key={year} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
              {year}
            </h2>

            {Object.entries(filteredPostsByYear[year])
              .sort((a, b) => {
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
                return monthOrder.indexOf(a[0]) - monthOrder.indexOf(b[0]);
              })
              .map(([month, posts]) => (
                <div key={`${year}-${month}`} className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-600 dark:text-gray-400">
                    {month} <span className="text-sm">({posts.length})</span>
                  </h3>

                  <ul className="space-y-3">
                    {posts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/${post.year}/${post.month}/${post.slug}`}
                          className="border border-white hover:border-gray-200 dark:hover:border-gray-700 p-2 -mx-2 rounded flex justify-between items-center group"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <div className="flex flex-col">
                              <span className="font-medium group-hover:underline">
                                {post.title}
                              </span>
                              {post.excerpt && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                  {post.excerpt}
                                </p>
                              )}
                            </div>
                          </div>

                          <time className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(post.date), 'MMM d')}
                          </time>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </section>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No posts match the selected filters.
        </div>
      )}
    </div>
  );
}
