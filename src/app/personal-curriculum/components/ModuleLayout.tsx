'use client';

import { useState } from 'react';
import Link from 'next/link';

console.log('ModuleLayout.tsx file loaded');

interface WeekData {
  title: string;
  focus: string;
  content: React.ReactNode;
}

interface ModuleLayoutProps {
  moduleTitle: string;
  moduleDescription?: string;
  moduleInfo: {
    code?: string;
    startDate?: string;
    endDate?: string;
    status?: 'Not Started' | 'In Progress' | 'Completed';
  };
  overviewInfo: {
    objectives?: string[];
    learningResources?: string[];
    assignmentDetails?: {
      weekAAssignmentTitle: string;
      weekAAssignmentContent: React.ReactNode;
      weekBAssignmentTitle: string;
      weekBAssignmentContent: React.ReactNode;
    };
    successCriteria?: {
      title: string;
      content: React.ReactNode;
    }
  };
  overviewContent?: React.ReactNode;
  progressContent?: React.ReactNode;
  weekByWeekContent?: WeekData[];
}

export default function ModuleLayout({
  moduleTitle,
  moduleDescription,
  moduleInfo,
  overviewInfo,
  overviewContent,
  progressContent,
  weekByWeekContent,
}: ModuleLayoutProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'progress' | 'weekbyweek'
  >(weekByWeekContent ? 'overview' : 'overview');


  return (
    <div className="w-full p-3 max-w-4xl mx-auto">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          href="/personal-curriculum"
          className="text-purple-600 hover:underline inline-flex items-center gap-1"
        >
          ← Back to Curriculum
        </Link>
      </div>

      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold mb-2">{moduleTitle}</h1>

        {/* Course Info Table */}
        <div className="my-6">
          <table className="w-full table-fixed border-collapse">
            <tbody>
              {moduleInfo.code && (
                <tr>
                  <td className="border border-gray-300 p-2 w-24 font-bold align-top">
                    Course Code
                  </td>
                  <td className="border border-gray-300 p-2">
                    {moduleInfo.code}
                  </td>
                </tr>
              )}
              {moduleInfo.startDate && (
                <tr>
                  <td className="border border-gray-300 p-2 w-24 font-bold align-top">
                    Start Date
                  </td>
                  <td className="border border-gray-300 p-2">
                    {moduleInfo.startDate}
                  </td>
                </tr>
              )}
              {moduleInfo.endDate && (
                <tr>
                  <td className="border border-gray-300 p-2 w-24 font-bold align-top">
                    End Date
                  </td>
                  <td className="border border-gray-300 p-2">
                    {moduleInfo.endDate}
                  </td>
                </tr>
              )}
              {moduleInfo.status && (
                <tr>
                  <td className="border border-gray-300 p-2 w-24 font-bold align-top">
                    Status
                  </td>
                  <td className="border border-gray-300 p-2">
                    {moduleInfo.status}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {moduleDescription && (
          <p className="leading-6 mb-6">{moduleDescription}</p>
        )}
      </header>

      {/* Tabs */}
      <div className="mb-6 bg-faint p-1 rounded-sm">
        <div className="flex border-gray-200 gap-2 sm:flex-row flex-col">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1 pt-[6px] font-medium transition-colors w-full ${
              activeTab === 'overview'
                ? 'border border-gray-200 bg-white'
                : 'mainColourText2 hover:underline'
            }`}
          >
            Module Overview
          </button>
          {weekByWeekContent && (
            <button
              onClick={() => setActiveTab('weekbyweek')}
              className={`px-4 py-1 rounded-sm font-medium transition-colors w-full ${
                activeTab === 'weekbyweek'
                  ? 'border border-gray-200 bg-white'
                  : 'mainColourText2 hover:underline'
              }`}
            >
              Week by Week Tasks
            </button>
          )}
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-1 rounded-sm pt-[6px] font-medium transition-colors w-full ${
              activeTab === 'progress'
                ? 'border border-gray-200 bg-white'
                : 'mainColourText2 hover:underline'
            }`}
          >
            Actual Progress
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {activeTab === 'overview' && (
          <div>
            {/* Objectives Section */}
            {overviewInfo.objectives && overviewInfo.objectives.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Module Objectives
                </h2>
                <p className="leading-6">By completion, I should be able to:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  {overviewInfo.objectives.map((objective, index) => (
                    <li key={index} className="leading-6">
                      {objective}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <hr className="my-8" />

            {/* Learning Resources Section */}
            {overviewInfo.learningResources &&
              overviewInfo.learningResources.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    Learning Resources (YouTube Search Strategy)
                  </h2>
                  <p className="leading-6">Search for:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    {overviewInfo.learningResources.map((resource, index) => (
                      <li key={index} className="leading-6">
                        {resource}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            <hr className="my-8" />

            {overviewInfo.assignmentDetails && (
              <section>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    {overviewInfo.assignmentDetails.weekAAssignmentTitle}
                  </h2>
                  {overviewInfo.assignmentDetails.weekAAssignmentContent}
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    {overviewInfo.assignmentDetails.weekBAssignmentTitle}
                  </h2>
                  {overviewInfo.assignmentDetails.weekBAssignmentContent}
                </div>
              </section>
            )}

            <hr className="my-8" />

            {overviewInfo.successCriteria && (
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Success Criteria
                </h2>
                <div>
                  {overviewInfo.successCriteria.content}
                </div>
              </section>
            )}

            {/* Custom Overview Content */}
            {overviewContent}
          </div>
        )}

        {activeTab === 'weekbyweek' && weekByWeekContent && (
          <div className="space-y-8">
            {weekByWeekContent.map((week, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold mb-2">{week.title}</h2>
                <p className="mb-3">
                  <b>Focus:</b> {week.focus}
                </p>
                <div>{week.content}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'progress' && progressContent}
      </div>
    </div>
  );
}
