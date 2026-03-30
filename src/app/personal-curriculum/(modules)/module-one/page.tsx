'use client';

import ModuleLayout from '../../components/ModuleLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fetchPostsByYear } from '@/actions/posts';
import type { BlogPost } from '@/types/blog';
import { IconCheck } from '@tabler/icons-react';

type Task = {
  text: string;
  isCompleted: boolean;
};

type Day = {
  title: string;
  items?: Task[];
  subSections?: {
    title: string;
    items?: Task[];
  }[];
};

function DaySection({ day }: { day: Day }) {
  return (
    <div>
      <h3 className="text-lg font-medium">{day.title}</h3>
      <ul className="list-disc pl-4 leading-6">
        {day.items?.map((item) => (
          <li key={`${day.title}-${item.text}`}>{item.text}</li>
        ))}
        {day.subSections?.map((section) => (
          <li key={section.title}>
            {section.title}
            {section.items && (
              <ul className="list-disc pl-6">
                {section.items.map((subItem) => (
                  <li key={`${section.title}-${subItem.text}`}>
                    {subItem.text}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const weekADays: Day[] = [
  {
    title: 'Day 1–2',
    items: [
      { text: 'Install Blender (latest version)', isCompleted: true },
      { text: 'Learn viewport controls (pan, zoom, orbit)', isCompleted: true },
      { text: 'Understand Object Mode vs Edit Mode', isCompleted: true },
    ],
    subSections: [
      {
        title: 'Practice:',
        items: [
          { text: 'Add cube, sphere, cylinder', isCompleted: true },
          { text: 'Move/rotate/scale each object', isCompleted: true },
        ],
      },
    ],
  },
  {
    title: 'Day 3–4',
    subSections: [
      {
        title: 'Learn:',
        items: [
          { text: 'Extrude (E)', isCompleted: true },
          { text: 'Scale (S)', isCompleted: true },
          { text: 'Grab (G)', isCompleted: true },
        ],
      },
      {
        title: 'Create:',
        items: [
          { text: 'A simple cup (cylinder-based)', isCompleted: false },
          { text: 'A basic book (cube-based)', isCompleted: false },
        ],
      },
    ],
  },
  {
    title: 'Day 5',
    subSections: [
      {
        title: 'Learn modifiers:',
        items: [
          { text: 'Subdivision Surface', isCompleted: false },
          { text: 'Mirror', isCompleted: false },
        ],
      },
      {
        title: 'Apply to:',
        items: [{ text: 'Donut or rounded object', isCompleted: false }],
      },
    ],
  },
  {
    title: 'Day 6 (assignment focus day one)',
    subSections: [
      {
        title: 'Build remaining objects:',
        items: [
          { text: 'Table', isCompleted: false },
          { text: 'Chair', isCompleted: false },
        ],
      },
      {
        title: 'Produce 2–3 renders (different angles)',
        items: [{ text: 'Take 3 renders', isCompleted: false }],
      },
    ],
  },
  {
    title: 'Day 7 (assignment focus day two)',
    subSections: [
      {
        title: 'Recreate 1 object from memory (no tutorial)',
        items: [{ text: 'Recreate cup from memory', isCompleted: false }],
      },
      {
        title: 'Render 1 simple image',
        items: [{ text: 'Take final render', isCompleted: false }],
      },
    ],
  },
];

const weekBDays: Day[] = [
  {
    title: 'Day 1–2',
    items: [
      { text: 'Install Blender (latest version)', isCompleted: false },
      {
        text: 'Learn viewport controls (pan, zoom, orbit)',
        isCompleted: false,
      },
      { text: 'Understand Object Mode vs Edit Mode', isCompleted: false },
    ],
    subSections: [
      {
        title: 'Practice:',
        items: [
          { text: 'Add cube, sphere, cylinder', isCompleted: false },
          { text: 'Move/rotate/scale each object', isCompleted: false },
        ],
      },
    ],
  },
  {
    title: 'Day 3–4',
    subSections: [
      {
        title: 'Learn:',
        items: [
          { text: 'Extrude (E)', isCompleted: false },
          { text: 'Scale (S)', isCompleted: false },
          { text: 'Grab (G)', isCompleted: false },
        ],
      },
      {
        title: 'Create:',
        items: [
          { text: 'A simple cup (cylinder-based)', isCompleted: false },
          { text: 'A basic book (cube-based)', isCompleted: false },
        ],
      },
    ],
  },
  {
    title: 'Day 5',
    subSections: [
      {
        title: 'Learn modifiers:',
        items: [
          { text: 'Subdivision Surface', isCompleted: false },
          { text: 'Mirror', isCompleted: false },
        ],
      },
      {
        title: 'Apply to:',
        items: [{ text: 'Donut or rounded object', isCompleted: false }],
      },
    ],
  },
  {
    title: 'Day 6 (assignment focus)',
    subSections: [
      {
        title: 'Finalize room scene',
        items: [{ text: 'Finalize room scene', isCompleted: false }],
      },
      {
        title: 'Produce 2–3 renders (different angles)',
        items: [{ text: 'Produce 2–3 renders', isCompleted: false }],
      },
    ],
  },
  {
    title: 'Day 7 (review)',
    subSections: [
      {
        title: 'Rebuild part of the scene from memory',
        items: [{ text: 'Rebuild scene from memory', isCompleted: false }],
      },
      {
        title: 'Identify friction points (navigation, shortcuts, etc.)',
        items: [{ text: 'Document friction points', isCompleted: false }],
      },
    ],
  },
];

function WeekChecklist({ days }: { days: Day[] }) {
  return (
    <div className="mt-4 space-y-4">
      {days.map((day) => (
        <div
          key={day.title}
          className="border-t border-gray-200 dark:border-gray-700 pt-3"
        >
          <h4 className="font-medium mb-2">{day.title}</h4>
          <ul className="space-y-2">
            {day.items?.map((item) => (
              <li
                key={`${day.title}-${item.text}`}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-3 border border-gray-400 flex items-center justify-center">
                  {item.isCompleted && (
                    <IconCheck size={8} className="mainColourText" />
                  )}
                </div>
                <span className={item.isCompleted ? ' text-gray-500' : ''}>
                  {item.text}
                </span>
              </li>
            ))}
            {day.subSections?.map((section) => (
              <div key={section.title}>
                <ul className="space-y-2 mt-1">
                  {section.items?.map((subItem) => (
                    <li
                      key={`${section.title}-${subItem.text}`}
                      className="flex items-center gap-2"
                    >
                      <div className="w-3 h-3 border border-gray-400 flex items-center justify-center">
                        {subItem.isCompleted && (
                          <IconCheck size={8} className="mainColourText" />
                        )}
                      </div>
                      <span
                        className={subItem.isCompleted ? ' text-gray-500' : ''}
                      >
                        <span className="font-medium">{section.title}</span>{' '}
                        {subItem.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function ModuleOnePage() {
  console.log('ModuleOnePage rendering');

  // Helper function to count total and completed tasks for a week
  const calculateWeekProgress = (days: Day[]) => {
    let totalTasks = 0;
    let completedTasks = 0;

    const countTasks = (items?: Task[]) => {
      if (!items) return;
      items.forEach((item) => {
        totalTasks++;
        if (item.isCompleted) completedTasks++;
      });
    };

    days.forEach((day) => {
      countTasks(day.items);
      day.subSections?.forEach((section) => {
        countTasks(section.items);
      });
    });

    return {
      total: totalTasks,
      completed: completedTasks,
      percentage: totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100,
    };
  };

  // Calculate progress for each week using the static data
  const weekAProgress = calculateWeekProgress(weekADays);
  const weekBProgress = calculateWeekProgress(weekBDays);

  const [modulePosts, setModulePosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [openPosts, setOpenPosts] = useState(true);

  const [showWeekAProgress, toggleWeekAProgress] = useState(false);
  const [showWeekBProgress, toggleWeekBProgress] = useState(false);

  const moduleInfo = {
    title: 'Blender for Stylized 3D Art & Animation',
    code: 'BLDN 101',
    startDate: 'Friday 27 March 2026 ',
    endDate: 'Thursday 9 April 2026',
    status: 'In Progress',
  } as const;

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
    assignmentDetails: {
      weekAAssignmentTitle: 'Week 1 Assignment',
      weekAAssignmentContent: (
        <div>
          <p className="leading-6">Create and render 5 simple objects:</p>
          <ul className="list-disc list-inside space-y-1 pl-4 leading-6">
            <li>Cup</li>
            <li>Table</li>
            <li>Donut</li>
            <li>Book</li>
            <li>Chair</li>
          </ul>
          <p className="leading-6">Constraints:</p>
          <ul className="list-disc list-inside space-y-1 pl-4 leading-6">
            <li>Use only primitives + basic edits</li>
            <li>Apply at least 1 modifier to 2 objects</li>
            <li>Produce 1 clean render (Eevee)</li>
          </ul>
        </div>
      ),
      weekBAssignmentTitle: 'Week 2 Assignment',
      weekBAssignmentContent: (
        <div>
          <p className="leading-6">Create a simple room scene:</p>
          <ul className="list-disc list-inside space-y-1 pl-4 leading-6">
            <li>Include:</li>
            <ul className="leading-6 list-disc list-inside space-y-1 pl-6">
              <li>At least 3 objects from Week 1</li>
              <li>One light source</li>
              <li>One camera angle</li>
            </ul>
            <li>Output:</li>
            <ul className="leading-6 list-disc list-inside space-y-1 pl-6">
              <li>2–3 rendered images</li>
            </ul>
          </ul>
        </div>
      ),
    },
    successCriteria: {
      title: 'Success Criteria',
      content: (
        <div>
          <p className="leading-6">
            To be considered successful in this module, I should:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4 leading-6">
            <li>Navigate Blender without hesitation</li>
            <li>Know essential shortcuts (G, S, R, Tab, E)</li>
            <li>Be able to build simple objects without tutorials</li>
            <li>Produce a basic but intentional render</li>
          </ul>
        </div>
      ),
    },
  };

  // Fetch posts and filter for both tags
  useEffect(() => {
    const loadModulePosts = async () => {
      try {
        const postsData = await fetchPostsByYear();

        const allPosts: BlogPost[] = [];
        Object.values(postsData).forEach((yearData) => {
          Object.values(yearData).forEach((monthPosts) => {
            allPosts.push(...monthPosts);
          });
        });

        const filteredPosts = allPosts.filter((post) =>
          post.tags.includes('BLDN 101 Mod 1'),
        );

        // Sort posts by datetime (newest first)
        const sortedPosts = filteredPosts.sort(
          (a, b) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
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

  const overviewContent = <div></div>;

  const progressContent = (
    <div>
      <h3 className="text-xl font-semibold mb-2">Current Progress</h3>

      {/* Week 1 Progress Section */}
      <div
        onClick={() => toggleWeekAProgress(!showWeekAProgress)}
        className="bg-gray-100 border border-gray-200 dark:bg-gray-800 p-4 mb-4"
      >
        <button className="flex justify-between w-full">
          <span className="font-semibold mb-2">
            Week 1 Progress: {weekAProgress.percentage.toFixed(0)}% -{' '}
            {weekAProgress.completed} / {weekAProgress.total} Tasks
          </span>
          <span>{showWeekAProgress ? '▼' : '▶'}</span>
        </button>

        <div className="w-full bg-gray-200 h-2 border border-gray-300">
          <div
            className="bg-mainColour h-2 transition-all duration-300"
            style={{ width: `${weekAProgress.percentage}%` }}
          ></div>
        </div>

        {showWeekAProgress && <WeekChecklist days={weekADays} />}
      </div>

      {/* Week 2 Progress Section */}
      <div
        onClick={() => toggleWeekBProgress(!showWeekBProgress)}
        className="bg-gray-100 border border-gray-200 dark:bg-gray-800 p-4 mb-4"
      >
        <button className="flex justify-between w-full">
          <span className="font-semibold mb-2">
            Week 2 Progress: {weekBProgress.percentage.toFixed(0)}% -{' '}
            {weekBProgress.completed} / {weekBProgress.total} Tasks
          </span>
          <span>{showWeekBProgress ? '▼' : '▶'}</span>
        </button>
        <div className="w-full bg-gray-200 h-2 border border-gray-300">
          <div
            className="bg-mainColour h-2 transition-all duration-300"
            style={{ width: `${weekBProgress.percentage}%` }}
          ></div>
        </div>

        {showWeekBProgress && <WeekChecklist days={weekBDays} />}
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
            <span className="text-gray-500 ">{openPosts ? '▼' : '▶'}</span>
          </div>
        </button>

        {loadingPosts ? (
          <div className="text-gray-500 py-4">Loading posts...</div>
        ) : modulePosts.length > 0 ? (
          <div className="mb-2">
            {openPosts && (
              <ul className="space-y-3 pl-2">
                {modulePosts.map((post) => {
                  const postDate = new Date(post.datetime);
                  return (
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
                          {format(postDate, 'MMM d')}
                        </time>
                      </Link>
                    </li>
                  );
                })}
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
          {weekADays.map((day) => (
            <DaySection key={day.title} day={day} />
          ))}
        </div>
      ),
    },
    {
      title: 'Week 2 (Apr 3 → Apr 9)',
      focus: 'Refining Skills & First Project',
      content: (
        <div className="flex flex-col gap-6">
          {weekBDays.map((day) => (
            <DaySection key={day.title} day={day} />
          ))}
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
