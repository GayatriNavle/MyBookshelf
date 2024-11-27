import React from 'react';
import { BookOpen, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReadingProgressProps {
  bookId: string;
  progress: number;
  onProgressUpdate: (progress: number) => void;
  onAddComment: () => void;
  className?: string;
}

export function ReadingProgress({
  bookId,
  progress,
  onProgressUpdate,
  onAddComment,
  className,
}: ReadingProgressProps) {
  return (
    <div className={cn("bg-white rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span className="font-medium">Reading Progress</span>
        </div>
        <button
          onClick={onAddComment}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <MessageCircle className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="range"
            value={progress}
            onChange={(e) => onProgressUpdate(Number(e.target.value))}
            className="w-full"
            min="0"
            max="100"
            step="1"
          />
          <span className="text-sm font-medium w-12">{progress}%</span>
        </div>

        {progress === 100 && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md text-sm">
            Congratulations! You've finished this book! 🎉
          </div>
        )}
      </div>
    </div>
  );
}