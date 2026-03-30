'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { fetchPostsByYear, fetchAllTags } from '@/actions/posts';
import type { BlogPost, PostsByYear, TagCount } from '@/types/blog';
import Image from 'next/image';

export default function PostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for posts data
  const [postsByYear, setPostsByYear] = useState<PostsByYear | null>(null);
  const [allTags, setAllTags] = useState<TagCount[]>([]);
  const [loading, setLoading] = useState(true);

  // State for open months - initialize with all months open
  const [openMonths, setOpenMonths] = useState<Set<string>>(new Set());

  // Get filter values from URL
  const yearFilter = searchParams.get('year') || '';
  const monthFilter = searchParams.get('month') || '';
  const tagFilter = searchParams.get('tag') || '';

  // Local state for form inputs
  const [selectedYear, setSelectedYear] = useState(yearFilter);
  const [selectedMonth, setSelectedMonth] = useState(monthFilter);
  const [selectedTag, setSelectedTag] = useState(tagFilter);

  // Helper function to safely get datetime from post (backward compatible)
  const getPostDateTime = (post: BlogPost): string => {
    // If post has datetime field, use it
    if (post.datetime) {
      return post.datetime;
    }
    // // Fallback for old posts with separate date and time
    // if (post.date) {
    //   return post.time ? `${post.date}T${post.time}` : post.date;
    // }
    // Last resort fallback
    return new Date().toISOString();
  };

  // Helper function to safely parse date
  const parsePostDate = (post: BlogPost): Date => {
    try {
      const dateTimeStr = getPostDateTime(post);
      console.log('Parsing date for post:', post.slug, 'using datetime string:', dateTimeStr);
      const date = new Date(dateTimeStr);
      console.log('Parsed date for post:', post.slug, date);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date for post:', post.slug, dateTimeStr);
        return new Date(); // fallback to current date
      }
      return date;
    } catch (error) {
      console.error('Error parsing date for post:', post.slug, error);
      return new Date(); // fallback to current date
    }
  };

  // Fetch all data on the client
  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, tagsData] = await Promise.all([
          fetchPostsByYear(),
          fetchAllTags(),
        ]);

        // Sort posts within each month by datetime (newest first)
        const sortedPostsData: PostsByYear = {};
        Object.keys(postsData).forEach((year) => {
          sortedPostsData[year] = {};
          Object.keys(postsData[year]).forEach((month) => {
            // Sort posts by datetime descending with safe parsing
            sortedPostsData[year][month] = [...postsData[year][month]].sort(
              (a, b) => {
                const dateA = parsePostDate(a);
                const dateB = parsePostDate(b);
                return dateB.getTime() - dateA.getTime();
              },
            );
          });
        });

        setPostsByYear(sortedPostsData);
        setAllTags(tagsData);

        // Initialize all months as open
        const initialOpenMonths = new Set<string>();
        Object.keys(sortedPostsData).forEach((year) => {
          Object.keys(sortedPostsData[year]).forEach((month) => {
            initialOpenMonths.add(`${year}-${month}`);
          });
        });
        setOpenMonths(initialOpenMonths);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Toggle month accordion
  const toggleMonth = (year: string, month: string) => {
    const key = `${year}-${month}`;
    setOpenMonths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

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
          // Keep posts sorted when filtering
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

  // Helper function to check if multiple posts on same day
  const hasMultiplePostsOnSameDay = (
    posts: BlogPost[],
    currentPost: BlogPost,
  ) => {
    try {
      const currentDate = format(parsePostDate(currentPost), 'yyyy-MM-dd');
      const sameDayPosts = posts.filter((post) => {
        const postDate = parsePostDate(post);
        return format(postDate, 'yyyy-MM-dd') === currentDate;
      });
      return sameDayPosts.length > 1;
    } catch (error) {
      console.error('Error in hasMultiplePostsOnSameDay:', error);
      return false;
    }
  };

  return (
    <div className="w-full p-3">
      <h1 className="text-3xl font-bold mb-6 font-serif">All Posts</h1>

      {loading ? (
        <div className="w-full p-3 flex justify-center items-center">
          <div className="text-gray-500">Loading posts...</div>
        </div>
      ) : !postsByYear ? (
        <div className="w-full p-3 flex justify-center items-center">
          <div className="text-red-500">Failed to load posts</div>
        </div>
      ) : null}

      {/* Filters Section*/}
      <div className="mb-8 p-4 bg-[#e1d0c4] rounded border-brown">
        <div className="flex items-end gap-2 flex-col md:flex-row">
          {/* Year Filter */}
          <div className="flex-1 w-full">
            <label htmlFor="year" className="block font-semibold">
              Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth('');
              }}
              className="w-full px-1 py-1 border border-[var(--main-colour)] rounded bg-white text-gray-900"
            >
              <option value="">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year} (
                  {postsByYear &&
                    Object.values(postsByYear[year]).reduce(
                      (acc, posts) => acc + posts.length,
                      0,
                    )}
                  )
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex-1 w-full">
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
              className="w-full px-1 py-1 border border-[var(--main-colour)] rounded bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Months</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month} ({postsByYear?.[selectedYear]?.[month]?.length || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Tags Filter */}
          <div className="flex-1 w-full">
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
              className="w-full px-1 py-1 border border-[var(--main-colour)] rounded bg-white text-gray-900"
            >
              <option value="">All Tags</option>
              {allTags.map(({ tag, count }) => (
                <option key={tag} value={tag}>
                  #{tag} ({count})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-3 w-full justify-center ">
          <button
            onClick={applyFilters}
            className="px-3 py-1 bg-[var(--main-colour4)] text-white rounded hover:bg-[var(--main-colour2)] transition-colors duration-200"
          >
            apply filters
          </button>
          {(yearFilter || monthFilter || tagFilter) && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-white text-gray-700 dark:text-gray-300 rounded italic hover:bg-gray-100 transition-colors border border-[var(--main-colour)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(yearFilter || monthFilter || tagFilter) && (
          <div className="mt-3 text-gray-700 text-center">
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
            <span className="ml-1 mainColourText2 ">
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

      {/* Posts Display with Accordion Months */}
      {years.length > 0 ? (
        years.map((year) => (
          <section key={year} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-800 pb-2 font-serif">
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
              .map(([month, posts]) => {
                const monthKey = `${year}-${month}`;
                const isOpen = openMonths.has(monthKey);

                return (
                  <div key={monthKey} className="mb-4">
                    {/* Month Header - Clickable */}
                    <button
                      onClick={() => toggleMonth(year, month)}
                      className="w-full flex items-center justify-between text-left mb-2 group"
                    >
                      <h3 className="text-lg font-medium text-gray-600 group-hover:text-gray-900">
                        {month}{' '}
                        <span className="text-sm">[{posts.length}]</span>
                      </h3>
                      <span className="text-gray-500 text-sm">
                        {isOpen ? '▼' : '▶'}
                      </span>
                    </button>

                    {/* Posts List - Conditionally Rendered */}
                    {isOpen && (
                      <ul className="space-y-3 pl-2">
                        {posts.map((post, index, array) => {
                          const postDate = parsePostDate(post);
                          const hasMultipleSameDay = hasMultiplePostsOnSameDay(
                            array,
                            post,
                          );

                          return (
                            <li key={post.slug}>
                              <Link
                                href={`/${post.year}/${post.month}/${post.slug}`}
                                className="border-t border-b border-white hover:border-gray-200 dark:hover:border-gray-700 py-2 px-1 -mx-3 flex justify-between items-center group MyPointerCursor"
                              >
                                <div className="flex items-center gap-2 flex-1 MyPointerCursor">
                                  {/* post image in a square box */}
                                  {post.image && (
                                    <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                      <Image
                                        width={48}
                                        height={48}
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover MyPointerCursor"
                                      />
                                    </div>
                                  )}

                                  <div className="flex flex-col">
                                    {/* title */}
                                    <span className="font-semibold group-hover:underline group-hover:mainColourText2 MyPointerCursor">
                                      {post.title}
                                    </span>

                                    {/* excerpt */}
                                    {post.excerpt && (
                                      <p className=" text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 MyPointerCursor">
                                        {post.excerpt}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <time className="text-gray-500 dark:text-gray-400 text-sm">
                                  {format(postDate, 'd MMM')}
                                </time>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
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
