'use client';

import { RouteGuard } from '@/components/RouteGuard';

export default function UserDashboard() {
  return (
    <RouteGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        {/* Add your user dashboard content here */}
      </div>
    </RouteGuard>
  );
} 