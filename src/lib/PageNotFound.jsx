import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent text-white shadow-lg">
          <Compass className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">404</h1>
          <p className="text-muted-foreground">This page drifted off the map.</p>
        </div>
        <Link
          to="/"
          className="inline-flex h-11 items-center justify-center rounded-lg gradient-accent px-6 text-sm font-medium text-white shadow hover:gradient-accent-hover transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
