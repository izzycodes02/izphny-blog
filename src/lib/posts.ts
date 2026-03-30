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

    // Get datetime from frontmatter, fallback to old date field if needed
    let datetime = data.datetime;
    if (!datetime && data.date) {
      // If datetime doesn't exist but date does, use date
      datetime = data.time ? `${data.date}T${data.time}` : data.date;
    }
    if (!datetime) {
      // Last resort fallback - use file modification time or current date
      const stats = fs.statSync(filePath);
      datetime = stats.mtime.toISOString();
      console.warn(
        `No date/datetime found for post: ${slug}, using file modification time`,
      );
    }

    return {
      slug,
      title: data.title,
      datetime, // Add the datetime field
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      image: data.image,
      moodImage: data.moodImage,
      moodDescription: data.moodDescription,
      content,
      year,
      month,
    };
  });

  // Sort posts by datetime (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getPostsByYear(): PostsByYear {
  const posts = getAllPosts();
  const postsByYear: PostsByYear = {};

  posts.forEach((post) => {
    const year = post.year;
    // Parse the month from datetime instead of date
    const month = new Date(post.datetime).toLocaleString('default', {
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

    // Get datetime from frontmatter, fallback to old date field if needed
    let datetime = data.datetime;
    if (!datetime && data.date) {
      datetime = data.time ? `${data.date}T${data.time}` : data.date;
    }
    if (!datetime) {
      const stats = fs.statSync(filePath);
      datetime = stats.mtime.toISOString();
      console.warn(
        `No date/datetime found for post: ${slug}, using file modification time`,
      );
    }

    return {
      slug,
      title: data.title,
      datetime, // Add the datetime field
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      image: data.image,
      moodImage: data.moodImage,
      moodDescription: data.moodDescription,
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

// create a getPostsByTag function that returns an array of posts that have the specified tag#
export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
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
