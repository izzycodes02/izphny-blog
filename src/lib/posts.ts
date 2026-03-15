import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, PostsByYear, TagCount } from '../types/blog';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');

export function getAllPosts(): BlogPost[] {
  // Recursively get all MDX files
  const getMDXFiles = (dir: string): string[] => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let mdxFiles: string[] = [];

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        mdxFiles = [...mdxFiles, ...getMDXFiles(fullPath)];
      } else if (file.name.endsWith('.mdx')) {
        mdxFiles.push(fullPath);
      }
    }

    return mdxFiles;
  };

  const mdxFiles = getMDXFiles(postsDirectory);

  const posts = mdxFiles.map((filePath) => {
    // Get the relative path from posts directory
    const relativePath = path.relative(postsDirectory, filePath);
    const pathParts = relativePath.split(path.sep);

    // Extract year, month, and slug from path
    const year = pathParts[0];
    const month = pathParts[1];
    const slug = pathParts[2].replace(/\.mdx$/, '');

    // Read file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      image: data.image,
      content,
      year,
      month,
    };
  });

  // Sort posts by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostsByYear(): PostsByYear {
  const posts = getAllPosts();
  const postsByYear: PostsByYear = {};

  posts.forEach((post) => {
    const year = post.year;
    const month = new Date(post.date).toLocaleString('default', {
      month: 'long',
    });

    if (!postsByYear[year]) {
      postsByYear[year] = {};
    }
    if (!postsByYear[year][month]) {
      postsByYear[year][month] = [];
    }

    postsByYear[year][month].push(post);
  });

  return postsByYear;
}

export function getPostBySlug(
  year?: string,
  month?: string,
  slug?: string,
): BlogPost | null {
  if (!year || !month || !slug) return null;

  const filePath = path.join(postsDirectory, year, month, `${slug}.mdx`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      image: data.image,
      content,
      year,
      month,
    };
  } catch (error) {
    console.error(
      `Error reading post at ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

export function getAllTags(): TagCount[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
