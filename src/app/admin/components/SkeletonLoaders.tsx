"use client";

import React from 'react';

// Skeleton Loader for Form Tabs (Hero, About, Contact)
export function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Title Header */}
      <div className="space-y-3">
        <div className="h-6 w-1/3 bg-slate-800 rounded-lg"></div>
        <div className="h-4 w-2/3 bg-slate-900 rounded-lg"></div>
      </div>

      {/* Grid Inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-3.5 w-24 bg-slate-800 rounded"></div>
          <div className="h-12 w-full bg-slate-950/40 border border-slate-900 rounded-2xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-32 bg-slate-800 rounded"></div>
          <div className="h-12 w-full bg-slate-950/40 border border-slate-900 rounded-2xl"></div>
        </div>
      </div>

      {/* Large Input / Textarea */}
      <div className="space-y-2">
        <div className="h-3.5 w-28 bg-slate-800 rounded"></div>
        <div className="h-28 w-full bg-slate-950/40 border border-slate-900 rounded-2xl"></div>
      </div>

      {/* Another Grid Inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-3.5 w-20 bg-slate-800 rounded"></div>
          <div className="h-12 w-full bg-slate-950/40 border border-slate-900 rounded-2xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3.5 w-36 bg-slate-800 rounded"></div>
          <div className="h-12 w-full bg-slate-950/40 border border-slate-900 rounded-2xl"></div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-slate-900">
        <div className="h-14 w-44 bg-slate-850 rounded-2xl"></div>
      </div>
    </div>
  );
}

// Skeleton Loader for Grid List Tabs (Skills, Projects, Certificates, Socials)
export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="animate-pulse space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-3 flex-grow">
          <div className="h-6 w-1/3 bg-slate-800 rounded-lg"></div>
          <div className="h-4 w-1/2 bg-slate-900 rounded-lg"></div>
        </div>
        <div className="h-12 w-36 bg-slate-850 rounded-2xl self-start flex-shrink-0"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-slate-950/30 border border-slate-900 rounded-2xl p-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 w-full">
              {/* Image/Logo Placeholder */}
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex-shrink-0"></div>
              {/* Text Lines */}
              <div className="space-y-2 flex-grow">
                <div className="h-4 w-2/3 bg-slate-850 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-900 rounded"></div>
                <div className="h-3 w-1/3 bg-slate-900 rounded-full"></div>
              </div>
            </div>
            {/* Action Buttons Placeholder */}
            <div className="flex gap-1.5 flex-shrink-0">
              <div className="w-8 h-8 bg-slate-900 rounded-lg"></div>
              <div className="w-8 h-8 bg-slate-900 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
