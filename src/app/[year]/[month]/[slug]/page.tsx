import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { MDXComponents } from 'mdx/types';

// Custom components for MDX
const components: MDXComponents = {
  // Custom image component with Next.js Image optimization
  img: (props) => (
    <div className="my-8">
      <Image
        src={props.src || ''}
        alt={props.alt || ''}
        width={800}
        height={400}
        className="rounded-lg w-full h-auto"
        sizes="(max-width: 768px) 100vw, 800px"
      />
      {props.alt && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
          {props.alt}
        </p>
      )}
    </div>
  ),

  // Custom blockquote styling
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2 my-6 italic text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),

  // Code blocks
  pre: (props) => (
    <pre
      className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto my-6"
      {...props}
    />
  ),

  // Headers with anchor links
  h1: (props) => (
    <h1
      className="text-3xl font-bold mt-8 mb-4"
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      {...props}
    />
  ),

  h2: (props) => (
    <h2
      className="text-2xl font-semibold mt-8 mb-4"
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      {...props}
    />
  ),

  h3: (props) => (
    <h3
      className="text-xl font-medium mt-6 mb-3"
      id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
      {...props}
    />
  ),

  // Paragraphs
  p: (props) => (
    <p
      className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
      {...props}
    />
  ),

  // Lists
  ul: (props) => (
    <ul
      className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),

  ol: (props) => (
    <ol
      className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),

  li: (props) => <li className="leading-relaxed" {...props} />,

  // Links
  a: (props) => (
    <a
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),

  // Horizontal rule
  hr: (props) => (
    <hr className="my-8 border-gray-200 dark:border-gray-800" {...props} />
  ),
};

interface PostPageProps {
  params: {
    year: string;
    month: string;
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  // Await the params Promise
  const { year, month, slug } = await params;

  const post = getPostBySlug(year, month, slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex(
    (p) => p.year === year && p.month === month && p.slug === slug,
  );

  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <article className="max-w-3xl mx-auto">
      {/* Navigation back to posts */}
      <div className="mb-8">
        <Link
          href="/posts"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          ← Back to all posts
        </Link>
      </div>

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
          <time dateTime={post.date}>
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </time>

          <span>•</span>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/posts/filter?tag=${encodeURIComponent(tag)}`}
                className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="my-8">
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={600}
              className="rounded-lg w-full h-auto object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        )}
      </header>

      {/* MDX Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote source={post.content} components={components} />
      </div>

      {/* Post Footer with Navigation */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          {prevPost ? (
            <Link
              href={`/${prevPost.year}/${prevPost.month}/${prevPost.slug}`}
              className="group max-w-[45%]"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                ← Previous Post
              </span>
              <span className="text-blue-600 dark:text-blue-400 group-hover:underline line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div /> // Empty div for spacing
          )}

          {nextPost ? (
            <Link
              href={`/${nextPost.year}/${nextPost.month}/${nextPost.slug}`}
              className="group text-right max-w-[45%]"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
                Next Post →
              </span>
              <span className="text-blue-600 dark:text-blue-400 group-hover:underline line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div /> // Empty div for spacing
          )}
        </div>
      </footer>
    </article>
  );
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = getAllPosts();

  // Return params matching your folder structure [year]/[month]/[slug]
  return posts.map((post) => ({
    year: post.year,
    month: post.month,
    slug: post.slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: PostPageProps) {
  // Await the params Promise
  const { year, month, slug } = await params;

  const post = getPostBySlug(year, month, slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: post.image ? [post.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}