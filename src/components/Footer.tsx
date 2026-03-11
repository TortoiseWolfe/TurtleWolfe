import React from 'react';

export function Footer() {
  return (
    <footer className="bg-base-300 mt-auto py-4 text-center sm:py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-base-content/80 text-sm leading-relaxed">
          15+ years building accessible web applications with React, TypeScript,
          and Next.js. 20+ years in graphic design.
        </p>
        <p className="text-base-content/80 mt-1 text-xs">
          &copy; {new Date().getFullYear()} Jonathan Pohlner
        </p>
      </div>
    </footer>
  );
}
