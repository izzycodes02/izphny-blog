import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  experimental: {
    mdxRs: true,
  },
  images: {
    domains: ['64.media.tumblr.com', 'i.pinimg.com'],
  },
};

export default withMDX(nextConfig);
