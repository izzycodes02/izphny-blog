import { Suspense } from 'react';
import PostsContent from './PostsContent';

// Loading component for Suspense fallback
function PostsLoading() {
  return (
    <div className="w-full p-3 flex justify-center items-center min-h-[400px]">
      <div className="text-gray-500">Loading posts...</div>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={<PostsLoading />}>
      <PostsContent />
    </Suspense>
  );
}
