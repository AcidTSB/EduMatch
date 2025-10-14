'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, FileText, Award, 
  Calendar, ArrowUp, ArrowDown, Download, Eye 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatCard from '@/components/admin/StatCard';
import CSVExportButton from '@/components/admin/CSVExportButton';
import { getAdminStats, SCHOLARSHIPS, APPLICATIONS } from '@/lib/mock-data';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  // Get real stats from unified data
  const stats = getAdminStats();

  // Mock analytics data
  const overviewStats = {
    totalUsers: { value: stats.totalUsers, change: 12.5, trend: 'up' as const },
    totalScholarships: { value: stats.totalScholarships, change: 8.3, trend: 'up' as const },
    totalApplications: { value: stats.totalApplications, change: 15.7, trend: 'up' as const },
    totalRevenue: { value: stats.totalRevenue, change: -3.2, trend: 'down' as const }
  };

  const userGrowth = [
    { month: 'Jan', users: 2100, applicants: 1200, providers: 900 },
    { month: 'Feb', users: 2250, applicants: 1300, providers: 950 },
    { month: 'Mar', users: 2400, applicants: 1400, providers: 1000 },
    { month: 'Apr', users: 2550, applicants: 1500, providers: 1050 },
    { month: 'May', users: 2700, applicants: 1600, providers: 1100 },
    { month: 'Jun', users: stats.totalUsers, applicants: stats.totalStudents, providers: stats.totalProviders }
  ];

  // Get top scholarships by application count
  const topScholarships = SCHOLARSHIPS
    .map(sch => {
      const applications = APPLICATIONS.filter(app => app.scholarshipId === sch.id);
      const views = Math.floor(Math.random() * 3000) + 500; // Mock views
      return {
        id: sch.id,
        title: sch.title,
        applications: applications.length,
        views,
        conversionRate: views > 0 ? ((applications.length / views) * 100).toFixed(1) : '0'
      };
    })
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5);

  const revenueByCategory = [
    { category: 'Premium Subscriptions', amount: 28500, percentage: 59 },
    { category: 'Application Fees', amount: 12800, percentage: 26.5 },
    { category: 'Featured Listings', amount: 5200, percentage: 10.8 },
    { category: 'Other Services', amount: 1820, percentage: 3.7 }
  ];

  const userEngagement = {
    avgSessionDuration: '8m 42s',
    avgPagesPerSession: 5.3,
    bounceRate: 32.4,
    returnUserRate: 68.2
  };

  const exportData = {
    overview: [
      { Metric: 'Total Users', Value: overviewStats.totalUsers.value, Change: `${overviewStats.totalUsers.change}%` },
      { Metric: 'Total Scholarships', Value: overviewStats.totalScholarships.value, Change: `${overviewStats.totalScholarships.change}%` },
      { Metric: 'Total Applications', Value: overviewStats.totalApplications.value, Change: `${overviewStats.totalApplications.change}%` },
      { Metric: 'Total Revenue', Value: overviewStats.totalRevenue.value, Change: `${overviewStats.totalRevenue.change}%` }
    ],
    topScholarships: topScholarships.map(s => ({
      Title: s.title,
      Applications: s.applications,
      Views: s.views,
      'Conversion Rate': `${s.conversionRate}%`
    }))
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Comprehensive platform insights and metrics</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 border rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </Button>
            ))}
          </div>
          <CSVExportButton
            data={exportData.overview}
            filename="analytics-overview"
          />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={overviewStats.totalUsers.value.toLocaleString()}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          trend={overviewStats.totalUsers.trend}
          change={overviewStats.totalUsers.change}
          changeLabel="vs last period"
          sparklineData={[2100, 2250, 2400, 2550, 2700, 2847]}
        />
        <StatCard
          title="Scholarships"
          value={overviewStats.totalScholarships.value.toLocaleString()}
          icon={<Award className="w-6 h-6 text-purple-600" />}
          trend={overviewStats.totalScholarships.trend}
          change={overviewStats.totalScholarships.change}
          changeLabel="vs last period"
          sparklineData={[280, 295, 310, 325, 332, 342]}
        />
        <StatCard
          title="Applications"
          value={overviewStats.totalApplications.value.toLocaleString()}
          icon={<FileText className="w-6 h-6 text-green-600" />}
          trend={overviewStats.totalApplications.trend}
          change={overviewStats.totalApplications.change}
          changeLabel="vs last period"
          sparklineData={[4200, 4600, 4950, 5200, 5400, 5621]}
        />
        <StatCard
          title="Revenue"
          value={`$${overviewStats.totalRevenue.value.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-orange-600" />}
          trend={overviewStats.totalRevenue.trend}
          change={Math.abs(overviewStats.totalRevenue.change)}
          changeLabel="vs last period"
          sparklineData={[52000, 51500, 50200, 49800, 49000, 48320]}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userGrowth.slice(-3).map((data, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{data.month}</span>
                        <span className="text-sm font-bold text-gray-900">{data.users} users</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${(data.users / 3000) * 100}%` }}
                        />
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>Applicants: {data.applicants}</span>
                        <span>Providers: {data.providers}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>User Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Avg Session Duration</span>
                    <span className="text-lg font-bold text-blue-600">{userEngagement.avgSessionDuration}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Avg Pages/Session</span>
                    <span className="text-lg font-bold text-green-600">{userEngagement.avgPagesPerSession}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Bounce Rate</span>
                    <span className="text-lg font-bold text-orange-600">{userEngagement.bounceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Return User Rate</span>
                    <span className="text-lg font-bold text-purple-600">{userEngagement.returnUserRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Scholarships */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Performing Scholarships</CardTitle>
                <CSVExportButton
                  data={exportData.topScholarships}
                  filename="top-scholarships"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topScholarships.map((sch, idx) => (
                  <div key={sch.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{sch.title}</h4>
                      <div className="flex gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {sch.applications} applications
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {sch.views} views
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{sch.conversionRate}%</div>
                      <div className="text-xs text-gray-500">conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Applicants</span>
                      <span className="font-bold">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Providers</span>
                      <span className="font-bold">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Premium</span>
                    <Badge className="bg-yellow-100 text-yellow-700">28%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Free</span>
                    <Badge variant="secondary">72%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Today</span>
                    <span className="font-bold text-green-600">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active This Week</span>
                    <span className="font-bold text-blue-600">2,134</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scholarships Tab */}
        <TabsContent value="scholarships" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Active</span>
                    <span className="text-lg font-bold text-green-600">287</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">Pending Review</span>
                    <span className="text-lg font-bold text-yellow-600">38</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Expired</span>
                    <span className="text-lg font-bold text-gray-600">17</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Avg Applications/Scholarship</span>
                    <span className="text-lg font-bold text-blue-600">16.4</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Acceptance Rate</span>
                    <span className="text-lg font-bold text-purple-600">23.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByCategory.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">${item.amount.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Revenue</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${revenueByCategory.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
