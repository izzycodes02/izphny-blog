'use server';

import { getPostsByYear, getAllTags, getPostsByTag } from '@/lib/posts';

export async function fetchPostsByYear() {
  return getPostsByYear();
}

export async function fetchAllTags() {
  return getAllTags();
}

export async function fetchPostsByTag(tag: string) {
  return getPostsByTag(tag);
}