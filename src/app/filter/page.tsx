import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import { format } from 'date-fns';

interface FilterPageProps {
  searchParams: {
    year?: string;
    month?: string;
    tag?: string;
  };
}

export default function FilterPage({ searchParams }: FilterPageProps) {
  const posts = getAllPosts();
  const { year, month, tag } = searchParams;

  let filteredPosts = posts;
  let filterTitle = 'All Posts';

  if (year && month) {
    filteredPosts = posts.filter(
      (post) => post.year === year && post.month === month,
    );
    filterTitle = `${month} ${year}`;
  } else if (year) {
    filteredPosts = posts.filter((post) => post.year === year);
    filterTitle = `Posts from ${year}`;
  } else if (tag) {
    filteredPosts = posts.filter((post) =>
      post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );
    filterTitle = `#${tag}`;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/posts"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          ← Back to all posts
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{filterTitle}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
      </p>

      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <article
            key={`${post.year}/${post.month}/${post.slug}`}
            className="border-b border-gray-200 dark:border-gray-800 pb-6"
          >
            <Link
              href={`/${post.year}/${post.month}/${post.slug}`}
              className="block group"
            >
              <h2 className="text-xl font-medium group-hover:text-gray-600 dark:group-hover:text-gray-300 mb-2">
                {post.title}
              </h2>

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
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/posts/filter?tag=${encodeURIComponent(t)}`}
                      className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}

        {filteredPosts.length === 0 && (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}
