"use client";

/**
 * Upload Progress Bar Component
 *
 * Visual progress indicator for file uploads.
 * Shows percentage and animates from 0-100%.
 */

import { useEffect, useState } from "react";

interface UploadProgressBarProps {
  /** Current progress percentage (0-100) */
  progress: number;
}

export function UploadProgressBar({ progress }: UploadProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Animate progress bar smoothly
  useEffect(() => {
    if (progress < displayProgress) {
      // Reset if new progress is lower (new upload)
      setDisplayProgress(0);
      setIsComplete(false);
    } else {
      // Animate towards target progress
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
        if (progress === 100) {
          setIsComplete(true);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [progress, displayProgress]);

  const getBarColor = () => {
    if (isComplete) return "bg-green-500";
    if (progress < 30) return "bg-blue-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {isComplete ? "Upload complete!" : "Uploading..."}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(displayProgress)}%
        </span>
      </div>

      {/* Progress bar container */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        {/* Progress bar fill */}
        <div
          className={`h-full ${getBarColor()} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}
