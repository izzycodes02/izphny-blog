import { getAllPosts, getPostsByYear } from '@/lib/posts';
import Link from 'next/link';
import { format } from 'date-fns';

export default function PostsPage() {
  const postsByYear = getPostsByYear();

  // Sort years in descending order
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="w-full p-3">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>

      {years.map((year) => (
        <section key={year} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
            {year}
          </h2>

          {Object.entries(postsByYear[year])
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
                        className="block hover:bg-gray-50 dark:hover:bg-gray-900 p-2 -mx-2 rounded"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{post.title}</span>
                          <time className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(post.date), 'MMM d')}
                          </time>
                        </div>
                        {post.excerpt && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </section>
      ))}
    </div>
  );
}
