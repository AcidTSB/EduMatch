'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Building2,
  Heart,
  Clock,
  BookOpen,
  TrendingUp,
  Bell,
  User,
  FileText,
  Award,
  Target,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDate, getDaysUntilDeadline } from '@/lib/utils';
import { RealTimeDashboardStats } from '@/components/RealTimeDashboardStats';
import { RealTimeApplicationStatus } from '@/components/RealTimeApplicationStatus';
import { MatchToast } from '@/components/MatchToast';
import { ScholarshipCard } from '@/components/ScholarshipCard';
import { useScholarshipsData, useApplicationsData, useNotificationsData } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseNotification } from '@/lib/notification-templates';

export default function DashboardPage() {
  const { t } = useLanguage();
  // Use AppContext hooks
  const { scholarships } = useScholarshipsData();
  const { applications } = useApplicationsData();
  const { notifications } = useNotificationsData();

  // Mock dashboard data - in real app, this would come from API
  const dashboardData = React.useMemo(() => ({
    stats: {
      applications: applications.length,
      inReview: applications.filter(a => a.status === 'UNDER_REVIEW').length,
      accepted: applications.filter(a => a.status === 'ACCEPTED').length,
      saved: 8
    },
    recentApplications: applications.slice(0, 3).map(app => ({
      id: app.id,
      scholarshipTitle: app.scholarship?.title || 'Unknown Scholarship',
      provider: app.scholarship?.providerName || 'Unknown Provider',
      status: app.status.toLowerCase(),
      appliedDate: app.submittedAt?.toISOString().split('T')[0] || '',
      deadline: app.scholarship?.deadline || ''
    })),
    notifications: notifications.slice(0, 5),
    recommendedScholarships: scholarships.slice(0, 3)
  }), [scholarships, applications, notifications]);

  const [savedScholarships, setSavedScholarships] = useState<string[]>(['sch1', 'sch2']);

  const toggleSaved = (scholarshipId: string) => {
    setSavedScholarships(prev => 
      prev.includes(scholarshipId)
        ? prev.filter(id => id !== scholarshipId)
        : [...prev, scholarshipId]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'submitted':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'under_review':
        return 'warning';
      case 'submitted':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return t('dashboard.status.accepted');
      case 'rejected':
        return t('dashboard.status.rejected');
      case 'under_review':
        return t('dashboard.status.underReview');
      case 'submitted':
        return t('dashboard.status.submitted');
      default:
        return t('dashboard.status.unknown');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{t('dashboard.welcomeUser').replace('{name}', 'John')}</h1>
              <p className="text-gray-600 mt-2">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button asChild>
                <Link href="/applicant/scholarships">
                  <Search className="h-4 w-4 mr-2" />
                  {t('dashboard.findScholarships')}
                </Link>
              </Button>
            </div>
        </div>

        {/* Match Toast Notifications */}
        <MatchToast />
      </div>
    </div>      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Stats Overview */}
        <RealTimeDashboardStats userRole="applicant" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Real-time Applications */}
          <div className="lg:col-span-2">
            <RealTimeApplicationStatus />
          </div>

          {/* Notifications */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('dashboard.notifications.title')}</CardTitle>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.notifications.slice(0, 5).map((notification) => {
                    const { templateKey, params } = parseNotification(notification);
                    return (
                      <div key={notification.id} className={`p-3 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <h5 className="font-medium text-sm text-gray-900">{t(templateKey + '.title', params || {})}</h5>
                        <p className="text-xs text-gray-600 mt-1">{t(templateKey, params || {})}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatDate(notification.createdAt.toString())}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Scholarships */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboard.recommended.title')}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/applicant/scholarships">
                {t('dashboard.recommended.viewAll')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-equal-height">
              {dashboardData.recommendedScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  showMatchScore={true}
                  className="w-full"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/applicant/profile">
                  <User className="h-6 w-6" />
                  <span>{t('dashboard.quickAction.updateProfile')}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/applicant/scholarships">
                  <Search className="h-6 w-6" />
                  <span>{t('dashboard.quickAction.browseScholarships')}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/applicant/applications">
                  <FileText className="h-6 w-6" />
                  <span>{t('dashboard.quickAction.myApplications')}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/applicant/settings">
                  <Target className="h-6 w-6" />
                  <span>{t('dashboard.quickAction.settings')}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
