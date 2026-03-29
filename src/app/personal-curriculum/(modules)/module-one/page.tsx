'use client';

import ModuleLayout from '../../components/ModuleLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fetchPostsByYear } from '@/actions/posts';
import type { BlogPost } from '@/types/blog';

export default function ModuleOnePage() {
  console.log('ModuleOnePage rendering');

  const weekATaskCompleted = 3;
  const progresslevelweekA = (weekATaskCompleted/13) * 100; 
  const weekBTaskCompleted = 0;
  const progresslevelweekB = (weekBTaskCompleted/13) * 100; 

  const [modulePosts, setModulePosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [openPosts, setOpenPosts] = useState(true); // Control accordion open state

  const moduleInfo = {
    title: 'Blender for Stylized 3D Art & Animation',
    code: 'BLDN 101',
    startDate: 'Friday 27 March 2026 ',
    endDate: 'Thursday 9 April 2026',
  };

  const overviewInfo = {
    objectives: [
      'Understand the Blender interface and workspace setup',
      'Master navigation and viewport controls',
      'Learn basic object manipulation (move, rotate, scale)',
      'Understand 3D space and coordinates',
      'Create and manage my first Blender project',
    ],
    learningResources: [
      'Blender beginner tutorial 2026',
      'Blender interface explained for beginners',
      'Blender donut tutorial updated',
      'Blender move rotate scale explained',
      'Blender modifiers beginner mirror subdivision',
    ],
  };

  // Fetch posts and filter for both tags
  useEffect(() => {
    const loadModulePosts = async () => {
      try {
        const postsData = await fetchPostsByYear();

        // Flatten all posts from the nested structure
        const allPosts: BlogPost[] = [];
        Object.values(postsData).forEach((yearData) => {
          Object.values(yearData).forEach((monthPosts) => {
            allPosts.push(...monthPosts);
          });
        });

        // Filter posts that have BOTH #BLDN 101 AND #Module 1 tags
        const filteredPosts = allPosts.filter((post) =>
          post.tags.includes('BLDN 101 Mod 1'),
        );

        // Sort by date (newest first) and take latest 5
        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setModulePosts(sortedPosts.slice(0, 5));
      } catch (error) {
        console.error('Failed to load module posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadModulePosts();
  }, []);

  const overviewContent = (
    <div>
      <h2>Welcome to Module 1: Foundations</h2>
      <p>
        This module covers the absolute basics of Blender. You&rsquo;ll learn
        the interface, navigation, and fundamental concepts needed to start your
        3D journey.
      </p>

      <h3>What You&rsquo;ll Learn:</h3>
      <ul>
        <li>Blender interface and workspace setup</li>
        <li>Navigation and viewport controls</li>
        <li>Basic object manipulation (move, rotate, scale)</li>
        <li>Understanding 3D space and coordinates</li>
        <li>Creating and managing your first project</li>
      </ul>

      <h3>Assignments:</h3>
      <ul>
        <li>Complete the Blender Guru Donut tutorial (first 3 videos)</li>
        <li>Create a simple scene with 3 primitive objects</li>
        <li>Submit a screenshot of your workspace</li>
      </ul>
    </div>
  );

  const progressContent = (
    <div>
      <h3 className="text-xl font-semibold mb-2">Current Progress</h3>
      <div className="bg-gray-100 border border-gray-200 dark:bg-gray-800 p-4 mb-4">
        <p className="font-semibold mb-2">
          Week 1 Progress: {progresslevelweekA.toFixed(0)}% - 11 / 13 Tasks
        </p>
        <div className="w-full bg-gray-200 h-2 border border-gray-300">
          <div
            className="bg-mainColour h-2"
            style={{ width: `${progresslevelweekA}%` }}
          ></div>
        </div>
      </div>
      <div className="bg-gray-100 border border-gray-200 dark:bg-gray-800 p-4 mb-4">
        <p className="font-semibold mb-2">
          Week 2 Progress: {progresslevelweekB.toFixed(0)}% - 0 / 13 Tasks
        </p>
        <div className="w-full bg-gray-200 h-2 border border-gray-300">
          <div
            className="bg-mainColour h-2"
            style={{ width: `${progresslevelweekB}%` }}
          ></div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="mt-8">
        <button
          onClick={() => setOpenPosts(!openPosts)}
          className="flex justify-between items-center mb-2 w-full"
        >
          <h3 className="text-xl font-semibold">Module Journal Posts</h3>
          <div className="flex items-center gap-6">
            <Link
              href="/posts?tag=BLDN%20101%20Mod%201"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all posts →
            </Link>
            <span className="text-gray-500 text-sm">
              {openPosts ? '▼' : '▶'}
            </span>
          </div>
        </button>

        {loadingPosts ? (
          <div className="text-gray-500 py-4">Loading posts...</div>
        ) : modulePosts.length > 0 ? (
          <div className="mb-2">
            {/* Posts List - Conditionally Rendered */}
            {openPosts && (
              <ul className="space-y-3 pl-2">
                {modulePosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/${post.year}/${post.month}/${post.slug}`}
                      className="border border-white hover:border-gray-200 dark:hover:border-gray-700 p-2 -mx-2 rounded flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex flex-col">
                          <span className="font-medium group-hover:underline">
                            {post.title}
                          </span>
                          {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      <time className="text-gray-500 dark:text-gray-400">
                        {format(new Date(post.date), 'MMM d')}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic py-4">No journal posts yet.</div>
        )}
      </div>
    </div>
  );

  const weekByWeekContent = [
    {
      title: 'Week 1 (Mar 27 → Apr 2)',
      focus: 'Navigation + Basic Modelling',
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-medium">Day 1–2</h3>
            <ul className="list-disc pl-4 leading-6">
              <li>Install Blender (latest version)</li>
              <li>Learn viewport controls (pan, zoom, orbit)</li>
              <li>Understand Object Mode vs Edit Mode</li>
              <li>Practice:</li>
              <ul className="list-disc pl-6">
                <li>Add cube, sphere, cylinder</li>
                <li>Move/rotate/scale each object</li>
              </ul>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium">Day 3–4</h3>
            <ul className="list-disc pl-4 leading-6">
              <li>Learn:</li>
              <ul className="list-disc pl-6">
                <li>Extrude (E)</li>
                <li>Scale (S)</li>
                <li>Grab (G)</li>
              </ul>
              <li>Create:</li>
              <ul className="list-disc pl-6">
                <li>A simple cup (cylinder-based)</li>
                <li>A basic book (cube-based)</li>
              </ul>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium">Day 5</h3>
            <ul className="list-disc pl-4 leading-6">
              <li>Learn modifiers:</li>
              <ul className="list-disc pl-6">
                <li>Subdivision Surface</li>
                <li>Mirror</li>
              </ul>
              <li>Apply to:</li>
              <ul className="list-disc pl-6">
                <li>Donut or rounded object</li>
              </ul>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Week 2 (Apr 3 → Apr 9)',
      focus: 'Refining Skills & First Project',
      content: (
        <div>
          <h3 className="text-lg font-medium mb-2">Topics Covered:</h3>
          <ul className="list-disc pl-4">
            <li>Advanced extrusion techniques</li>
            <li>Working with modifiers (Subdivision, Mirror, Array)</li>
            <li>Creating a complete scene with multiple objects</li>
            <li>Basic lighting and rendering</li>
          </ul>
          <h3 className="text-lg font-medium mt-4 mb-2">
            Practical Exercises:
          </h3>
          <ul className="list-disc pl-4">
            <li>Create a stylized tree using extrusion and modifiers</li>
            <li>Model a complete low-poly character</li>
            <li>Set up basic lighting and render your scene</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <ModuleLayout
      moduleTitle="Module 1 — Blender Foundations & Navigation"
      moduleDescription="This module will establish my working fluency in Blender. The focus is not artistic perfection but operational confidence—being able to navigate the interface, manipulate objects, and produce simple scenes without friction.
      By the end of these two weeks, I should be able to open Blender and immediately begin building, modifying, and rendering basic scenes without needing constant guidance."
      moduleInfo={moduleInfo}
      overviewInfo={overviewInfo}
      overviewContent={overviewContent}
      progressContent={progressContent}
      weekByWeekContent={weekByWeekContent}
    />
  );
}
