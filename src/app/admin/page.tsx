'use client';

import { RouteGuard } from '@/components/RouteGuard';

export default function AdminDashboard() {
  return (
    <RouteGuard requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {/* Add your admin dashboard content here */}
      </div>
    </RouteGuard>
  );
} 