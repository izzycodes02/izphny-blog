import Link from 'next/link';
import { getAllPosts } from '../lib/posts';
import { format } from 'date-fns';
import TypingAnimation from '@/components/TypingAnimation';

export default function Home() {
  const posts = getAllPosts();
  // show only 2 now
  const latestPosts = posts.slice(0, 2);

  return (
    <div className="w-full p-3">

      <TypingAnimation />

      <hr className="mb-8" />

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-semibold font-serif">Latest Posts</h2>
          <Link
            href="/posts"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all posts →
          </Link>
        </div>

        {/* I want it in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {latestPosts.map((post) => {
            // Parse the datetime string to a Date object inside the map
            const postDate = new Date(post.datetime);
            
            return (
              <article
                key={`${post.year}/${post.month}/${post.slug}`}
                className="border border-gray-200 p-2 dark:border-gray-800 flex flex-col justify-between h-full"
              >
              {/* Post title and excerpt - clickable to full post */}

              <Link
                href={`/${post.year}/${post.month}/${post.slug}`}
                className="block group"
              >
                <div className="p-1 px-2 pb-[2px] mb-2 inset-border-shadow flex items-center text-gray-600 border justify-between font-thin  MyPointerCursor">
                  <span> ✷</span>
                  <span className="text-outline-white">
                    {format(postDate, 'dd / MMM / yyyy')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold group-hover:mainColourText group-hover:underline mb-2 MyPointerCursor">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3 MyPointerCursor">
                    {post.excerpt}
                  </p>
                )}
              </Link>

              {/* Tags section - separate from the main post link */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <Link
                      key={tag}
                      href={`/posts?tag=${encodeURIComponent(tag)}`}
                      className={`bg-[#f0f0f0] text-[10px] px-2 py-1 rounded-sm bgfaint hover:mainColourText2 hover:underline transition-colors duration-200
      ${i >= 3 ? 'hidden' : ''}
      ${i >= 2 ? 'md:hidden' : ''}
    `}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
            )}
            </article>
          );
        })}
        </div>
      </section>

      <hr className="my-8" />
    </div>
  );
}
