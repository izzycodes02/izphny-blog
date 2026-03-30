'use client';

import React, { useState, useEffect, useMemo } from 'react';

const TypingAnimation = () => {
  const lines = useMemo(() => ['i live', 'pray', 'play', '& work'], []);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) return;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing mode
        if (currentCharIndex <= lines[currentLineIndex].length) {
          const currentText = lines[currentLineIndex].substring(
            0,
            currentCharIndex,
          );
          const newDisplayed = [...displayedLines];
          newDisplayed[currentLineIndex] = currentText;
          setDisplayedLines(newDisplayed);
          setCurrentCharIndex(currentCharIndex + 1);
        } else {
          // Finished typing current line, wait before next action
          setIsWaiting(true);
          setTimeout(() => {
            setIsWaiting(false);
            if (currentLineIndex === lines.length - 1) {
              // Last line typed, start deleting from first line
              setIsDeleting(true);
              setCurrentLineIndex(0);
              setCurrentCharIndex(lines[0].length);
            } else {
              // Move to next line
              setCurrentLineIndex(currentLineIndex + 1);
              setCurrentCharIndex(0);
            }
          }, 1000); // Wait 1 second before next line or deletion
        }
      } else {
        // Deleting mode
        if (currentCharIndex >= 0) {
          const currentText = lines[currentLineIndex].substring(
            0,
            currentCharIndex,
          );
          const newDisplayed = [...displayedLines];
          newDisplayed[currentLineIndex] = currentText;
          setDisplayedLines(newDisplayed);
          setCurrentCharIndex(currentCharIndex - 1);
        } else {
          // Finished deleting, move to next line for deletion or restart typing
          if (currentLineIndex === lines.length - 1) {
            // All lines deleted, start over
            setIsDeleting(false);
            setCurrentLineIndex(0);
            setCurrentCharIndex(0);
            setDisplayedLines([]);
          } else {
            setCurrentLineIndex(currentLineIndex + 1);
            setCurrentCharIndex(lines[currentLineIndex + 1].length);
          }
        }
      }
    }, 100); // Typing speed (milliseconds per character)

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    currentLineIndex,
    isDeleting,
    isWaiting,
    displayedLines,
    lines,
  ]);

  return (
    <section className="flex w-full text-center items-center flex-col my-20 mainColourText">
      {lines.map((line, index) => (
        <p key={index} className="min-h-[1.5em]">
          {displayedLines[index] || ''}
          {index === currentLineIndex &&
            !isDeleting &&
            currentCharIndex <= line.length && (
              <span className="animate-pulse">|</span>
            )}
        </p>
      ))}
    </section>
  );
};

export default TypingAnimation;
