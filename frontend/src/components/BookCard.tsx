import React from 'react';
import { BookOpen, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface BookCardProps {
  cover: string;
  title: string;
  author: string;
  rating: number;
  progress?: number;
  className?: string;
}

export function BookCard({ cover, title, author, rating, progress, className }: BookCardProps) {
  return (
    <div className={cn("group relative bg-white rounded-lg shadow-md transition-all hover:shadow-xl", className)}>
      <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
        <img
          src={cover}
          alt={title}
          className="object-cover w-full h-full transition-transform group-hover:scale-105"
        />
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm">{progress}%</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600">{author}</p>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}