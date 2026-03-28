import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import { format } from 'date-fns';

export default function Home() {
  const posts = getAllPosts();
  const latestPosts = posts.slice(0, 5); // Show 5 latest posts

  return (
    <div className="w-full">
      {/* <h1 className="text-3xl font-bold mb-6">Welcome to iz.phny blog</h1>

      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Thoughts about dogs, life, and everything in between.
      </p> */}

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold">Latest Posts</h2>
          <Link
            href="/posts"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all posts →
          </Link>
        </div>

        <div className="space-y-6">
          {latestPosts.map((post) => (
            <article
              key={`${post.year}/${post.month}/${post.slug}`}
              className="border-b border-gray-200 dark:border-gray-800 pb-6"
            >
              <Link
                href={`/${post.year}/${post.month}/${post.slug}`}
                className="block group"
              >
                <h3 className="text-xl font-medium group-hover:text-gray-600 dark:group-hover:text-gray-300 mb-2">
                  {post.title}
                </h3>

                <time className="text-sm text-gray-500 dark:text-gray-400 block mb-2">
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>

                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {post.excerpt}
                  </p>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
