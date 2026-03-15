import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Post not found
      </p>
      <Link
        href="/posts"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        View all posts →
      </Link>
    </div>
  );
}
