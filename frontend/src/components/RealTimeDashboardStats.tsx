'use client';

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, Heart, TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';
import { useRealTime } from '@/providers/RealTimeProvider';
import { useDashboardStore } from '@/stores/realtimeStore';
import { useApplicationsData, useSavedScholarshipsData, useScholarshipsData } from '@/contexts/AppContext';

interface DashboardStatsProps {
  userRole?: 'applicant' | 'provider' | 'admin';
}

export function RealTimeDashboardStats({ userRole = 'applicant' }: DashboardStatsProps) {
  const { socket } = useRealTime();
  const { stats } = useDashboardStore();
  
  // Get real data from AppContext
  const { applications } = useApplicationsData();
  const { savedScholarships } = useSavedScholarshipsData();
  const { scholarships } = useScholarshipsData();

  const getApplicantStats = () => [
    {
      id: 'applications',
      title: 'Total Applications',
      value: applications.length,
      change: stats?.applicationsChange || '+2',
      icon: FileText,
      color: 'bg-brand-blue-100 text-brand-blue-600',
      changeColor: 'text-green-600'
    },
    {
      id: 'review',
      title: 'In Review',
      value: applications.filter(a => a.status === 'UNDER_REVIEW').length,
      change: stats?.reviewChange || '+1',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
      changeColor: 'text-green-600'
    },
    {
      id: 'accepted',
      title: 'Accepted',
      value: applications.filter(a => a.status === 'ACCEPTED').length,
      change: stats?.acceptedChange || '0',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      changeColor: 'text-green-600'
    },
    {
      id: 'saved',
      title: 'Saved',
      value: savedScholarships.length,
      change: stats?.savedChange || '+3',
      icon: Heart,
      color: 'bg-purple-100 text-purple-600',
      changeColor: 'text-green-600'
    }
  ];

  const getProviderStats = () => [
    {
      id: 'scholarships',
      title: 'Active Scholarships',
      value: stats?.activeScholarships || 5,
      change: stats?.scholarshipsChange || '+1',
      icon: Award,
      color: 'bg-brand-blue-100 text-brand-blue-600',
      changeColor: 'text-green-600'
    },
    {
      id: 'applications',
      title: 'Total Applications',
      value: stats?.totalApplications || 45,
      change: stats?.applicationsChange || '+7',
      icon: FileText,
      color: 'bg-green-100 text-green-600',
      changeColor: 'text-green-600'
    },
    {
      id: 'pending',
      title: 'Pending Review',
      value: stats?.pendingReview || 12,
      change: stats?.pendingChange || '+3',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
      changeColor: 'text-orange-600'
    },
    {
      id: 'views',
      title: 'Profile Views',
      value: stats?.profileViews || 234,
      change: stats?.viewsChange || '+18',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      changeColor: 'text-green-600'
    }
  ];

  const getAdminStats = () => [
    {
      id: 'users',
      title: 'Total Users',
      value: stats?.totalUsers || 1234,
      change: stats?.usersChange || '+23',
      icon: Users,
      color: 'bg-brand-blue-100 text-brand-blue-600',
      changeColor: 'text-green-600'
    },
    {
      id: 'scholarships',
      title: 'Active Scholarships',
      value: stats?.activeScholarships || 89,
      change: stats?.scholarshipsChange || '+5',
      icon: Award,
      color: 'bg-green-100 text-green-600',
      changeColor: 'text-green-600'
    },
    {
      id: 'applications',
      title: 'Total Applications',
      value: stats?.totalApplications || 567,
      change: stats?.applicationsChange || '+34',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      changeColor: 'text-green-600'
    },
    {
      id: 'issues',
      title: 'Open Issues',
      value: stats?.openIssues || 7,
      change: stats?.issuesChange || '-2',
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600',
      changeColor: 'text-green-600'
    }
  ];

  const getStatsByRole = () => {
    switch (userRole) {
      case 'provider':
        return getProviderStats();
      case 'admin':
        return getAdminStats();
      default:
        return getApplicantStats();
    }
  };

  const statsData = getStatsByRole();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        const isPositiveChange = stat.change.startsWith('+');
        const isNegativeChange = stat.change.startsWith('-');
        
        return (
          <Card key={stat.id} className="relative overflow-hidden">
            <CardContent className="flex items-center p-6">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg mr-4 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  {stat.change !== '0' && (
                    <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                      isPositiveChange ? 'bg-green-100 text-green-700' :
                      isNegativeChange ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${
                        isNegativeChange ? 'transform rotate-180' : ''
                      }`} />
                      {stat.change}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
              </div>
            </CardContent>
            
            {/* Real-time indicator */}
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}