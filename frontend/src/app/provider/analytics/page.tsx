'use client';

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  GraduationCap,
  Award,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import { useApplicationsData, useScholarshipsData } from '@/contexts/AppContext';
import { ApplicationStatus, ScholarshipStatus } from '@/types';

export default function ProviderAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('last-6-months');
  
  // Get real data from AppContext
  const { applications } = useApplicationsData();
  const { scholarships } = useScholarshipsData();

  // Calculate real analytics data
  const analyticsData = useMemo(() => {
    const acceptedApplications = applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length;
    const rejectedApplications = applications.filter(app => app.status === ApplicationStatus.REJECTED).length;
    const pendingApplications = applications.filter(app => 
      app.status === ApplicationStatus.SUBMITTED || app.status === ApplicationStatus.UNDER_REVIEW
    ).length;
    
    const activeScholarships = scholarships.filter(s => s.status === ScholarshipStatus.PUBLISHED).length;
    const acceptanceRate = applications.length > 0 ? (acceptedApplications / applications.length * 100) : 0;
    const averageApplicationsPerScholarship = scholarships.length > 0 ? applications.length / scholarships.length : 0;

    // Calculate scholarship performance
    const scholarshipPerformance = scholarships.map(scholarship => {
      const scholarshipApplications = applications.filter(app => app.scholarshipId === scholarship.id);
      const accepted = scholarshipApplications.filter(app => app.status === ApplicationStatus.ACCEPTED).length;
      const rejected = scholarshipApplications.filter(app => app.status === ApplicationStatus.REJECTED).length;
      const pending = scholarshipApplications.filter(app => 
        app.status === ApplicationStatus.SUBMITTED || app.status === ApplicationStatus.UNDER_REVIEW
      ).length;
      
      return {
        id: scholarship.id,
        title: scholarship.title,
        applications: scholarshipApplications.length,
        accepted,
        rejected,
        pending,
        acceptanceRate: scholarshipApplications.length > 0 ? Number((accepted / scholarshipApplications.length * 100).toFixed(1)) : 0,
        averageRating: 4.0 + Math.random() * 1 // Mock rating for now
      };
    });

    // Calculate demographics
    const universityStats = new Map();
    const majorStats = new Map();
    
    applications.forEach(app => {
      if (app.applicant?.university) {
        universityStats.set(app.applicant.university, (universityStats.get(app.applicant.university) || 0) + 1);
      }
      if (app.applicant?.major) {
        majorStats.set(app.applicant.major, (majorStats.get(app.applicant.major) || 0) + 1);
      }
    });

    const topUniversities = Array.from(universityStats.entries())
      .map(([name, count]) => ({
        name,
        applications: count,
        percentage: Number((count / applications.length * 100).toFixed(1))
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 7);

    const topMajors = Array.from(majorStats.entries())
      .map(([name, count]) => ({
        name,
        applications: count,
        percentage: Number((count / applications.length * 100).toFixed(1))
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 6);

    return {
      overview: {
        totalScholarships: scholarships.length,
        totalApplications: applications.length,
        acceptedApplications,
        rejectedApplications,
        pendingApplications,
        activeScholarships,
        acceptanceRate: Number(acceptanceRate.toFixed(1)),
        averageApplicationsPerScholarship: Number(averageApplicationsPerScholarship.toFixed(1))
      },
      scholarshipPerformance,
      topUniversities,
      topMajors,
      // Mock monthly stats for now
      monthlyStats: [
        { month: 'Feb', applications: 18, accepted: 3, rejected: 12, pending: 3 },
        { month: 'Mar', applications: 25, accepted: 4, rejected: 16, pending: 5 },
        { month: 'Apr', applications: 22, accepted: 3, rejected: 14, pending: 5 },
        { month: 'May', applications: 28, accepted: 5, rejected: 18, pending: 5 },
        { month: 'Jun', applications: 31, accepted: 4, rejected: 22, pending: 5 },
        { month: 'Jul', applications: applications.length, accepted: acceptedApplications, rejected: rejectedApplications, pending: pendingApplications }
      ]
    };
  }, [applications, scholarships]);
  
  const { overview, monthlyStats, scholarshipPerformance, topUniversities, topMajors } = analyticsData;

  // Export functions
  const generateReportCSV = () => {
    const headers = ['Metric', 'Value', 'Period'];
    const data = [
      ['Total Scholarships', overview.totalScholarships, timeRange],
      ['Total Applications', overview.totalApplications, timeRange],
      ['Accepted Applications', overview.acceptedApplications, timeRange],
      ['Acceptance Rate', `${overview.acceptanceRate}%`, timeRange],
      ['Average Applications per Scholarship', overview.averageApplicationsPerScholarship, timeRange],
    ];
    
    const csvContent = [headers, ...data]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    changeType = 'positive',
    description 
  }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    description?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {change && (
              <p className={`text-xs mt-1 ${
                changeType === 'positive' ? 'text-green-600' : 
                changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${
            changeType === 'positive' ? 'bg-green-100' : 
            changeType === 'negative' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Icon className={`h-6 w-6 ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SimpleChart = ({ data, type = 'bar' }: { data: any[]; type?: 'bar' | 'line' }) => (
    <div className="h-64 flex items-end justify-center space-x-2">
      {data.slice(-6).map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          <div 
            className="bg-brand-blue-500 rounded-t"
            style={{ 
              height: `${(item.applications / Math.max(...data.map(d => d.applications))) * 200}px`,
              width: '32px'
            }}
          />
          <span className="text-xs text-gray-600">{item.month}</span>
        </div>
      ))}
    </div>
  );

  const SimpleDonutChart = ({ data, title }: { data: any[]; title: string }) => (
    <div className="space-y-4">
      <h4 className="font-semibold text-center">{title}</h4>
      <div className="space-y-2">
        {data.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="font-semibold">{item.applications}</span>
              <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Insights and performance metrics for your scholarships
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline"
                onClick={() => {
                  // Export functionality
                  console.log('Exporting report...');
                  const csvContent = generateReportCSV();
                  downloadCSV(csvContent, `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Applications"
            value={overview.totalApplications}
            icon={Users}
            change="+12% from last month"
            changeType="positive"
          />
          
          <StatCard
            title="Acceptance Rate"
            value={`${overview.acceptanceRate}%`}
            icon={CheckCircle}
            change="+2.3% from last month"
            changeType="positive"
          />
          
          <StatCard
            title="Active Scholarships"
            value={overview.activeScholarships}
            icon={Award}
            change="2 ending soon"
            changeType="neutral"
          />
          
          <StatCard
            title="Avg Applications per Scholarship"
            value={overview.averageApplicationsPerScholarship}
            icon={TrendingUp}
            change="+5.2 from last month"
            changeType="positive"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Applications Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Applications Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleChart data={monthlyStats} type="line" />
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2" />
                Application Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{overview.acceptedApplications}</p>
                    <p className="text-sm text-gray-600">Accepted</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-2">
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {overview.pendingApplications}
                    </p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-2">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">{overview.rejectedApplications}</p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scholarship Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Scholarship Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Scholarship</th>
                    <th className="text-center py-3 px-2">Applications</th>
                    <th className="text-center py-3 px-2">Accepted</th>
                    <th className="text-center py-3 px-2">Acceptance Rate</th>
                    <th className="text-center py-3 px-2">Avg Rating</th>
                    <th className="text-center py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarshipPerformance.map((scholarship, index) => (
                    <tr key={scholarship.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2">
                        <div>
                          <h4 className="font-semibold">{scholarship.title}</h4>
                          <p className="text-sm text-gray-600">ID: {scholarship.id}</p>
                        </div>
                      </td>
                      <td className="text-center py-4 px-2">
                        <span className="font-semibold">{scholarship.applications}</span>
                      </td>
                      <td className="text-center py-4 px-2">
                        <span className="font-semibold text-green-600">{scholarship.accepted}</span>
                      </td>
                      <td className="text-center py-4 px-2">
                        <Badge variant={scholarship.acceptanceRate > 15 ? 'default' : 'secondary'}>
                          {scholarship.acceptanceRate}%
                        </Badge>
                      </td>
                      <td className="text-center py-4 px-2">
                        <div className="flex items-center justify-center">
                          <span className="font-semibold mr-1">{scholarship.averageRating}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-xs ${
                                  star <= scholarship.averageRating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-2">
                        <Badge variant="default">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Universities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Top Universities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleDonutChart data={topUniversities} title="" />
            </CardContent>
          </Card>

          {/* Top Majors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Popular Majors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleDonutChart data={topMajors} title="" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Application Volume</h4>
                  <p className="text-blue-700 text-sm">
                    Your scholarships have received {overview.totalApplications} applications with an average of {overview.averageApplicationsPerScholarship} per scholarship.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Acceptance Rate</h4>
                  <p className="text-green-700 text-sm">
                    Current acceptance rate is {overview.acceptanceRate}% with {overview.acceptedApplications} applications accepted out of {overview.totalApplications} total.
                  </p>
                </div>
              </div>

              {overview.pendingApplications > 0 && (
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900">Action Required</h4>
                    <p className="text-yellow-700 text-sm">
                      You have {overview.pendingApplications} pending applications that require review.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}