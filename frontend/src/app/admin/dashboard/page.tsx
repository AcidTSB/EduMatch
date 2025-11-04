import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* StatCards, ChartArea, ChartBar, ChartPie, ActivityFeed sẽ được thêm sau */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* StatCard components */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ChartArea, ChartBar, ChartPie components */}
      </div>
      <div className="mt-8">
        {/* ActivityFeed component */}
      </div>
    </div>
  );
}
