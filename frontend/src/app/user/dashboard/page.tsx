'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { useApplicationsData, useNotificationsData } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { parseNotification } from '@/lib/notification-templates';
import { scholarshipServiceApi } from '@/services/scholarship.service';
import { mapPaginatedOpportunities, mapOpportunityDtoToScholarship } from '@/lib/scholarship-mapper';
import { Scholarship } from '@/types';
import { useApplications, useSavedScholarships } from '@/hooks/api';
import { toast } from 'react-hot-toast';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  hover: { 
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DashboardPage() {
  const { t } = useLanguage();
  // Use AppContext hooks
  const { applications } = useApplicationsData();
  const { notifications } = useNotificationsData();
  
  // Fetch scholarships and saved scholarships from API
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const { savedScholarships } = useSavedScholarships();
  
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const response = await scholarshipServiceApi.getScholarships({
          page: 0,
          size: 3,
          isPublic: true,
          currentDate: new Date().toISOString().split('T')[0]
        });
        const mapped = mapPaginatedOpportunities(response);
        setScholarships(mapped.scholarships);
      } catch (error) {
        console.error('Error fetching recommended scholarships:', error);
        toast.error('Failed to load recommended scholarships');
      } finally {
        setLoading(false);
      }
    };
    
    fetchScholarships();
  }, []);

  // Dashboard data from API
  const dashboardData = React.useMemo(() => ({
    stats: {
      applications: applications.length,
      inReview: applications.filter(a => a.status === 'PENDING' || a.status === 'VIEWED').length,
      accepted: applications.filter(a => a.status === 'ACCEPTED').length,
      saved: savedScholarships.length
    },
    recentApplications: applications.slice(0, 3).map(app => {
      const scholarship = scholarships.find(s => s.id === app.scholarshipId);
      return {
        id: app.id,
        scholarshipTitle: scholarship?.title || 'Unknown Scholarship',
        provider: scholarship?.providerName || 'Unknown Provider',
        status: app.status.toLowerCase(),
        appliedDate: app.createdAt ? app.createdAt.toISOString().split('T')[0] : '',
        deadline: scholarship?.applicationDeadline || ''
      };
    }),
    notifications: notifications.slice(0, 5),
    recommendedScholarships: scholarships.slice(0, 3)
  }), [scholarships, applications, notifications, savedScholarships]);

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
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{t('dashboard.welcomeUser').replace('{name}', 'John')}</h1>
              <p className="text-gray-600 mt-2">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button asChild>
                <Link href="/user/scholarships">
                  <Search className="h-4 w-4 mr-2" />
                  {t('dashboard.findScholarships')}
                </Link>
              </Button>
            </div>
        </div>

        {/* Match Toast Notifications */}
        <MatchToast />
      </div>
    </div>      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Stats Overview */}
        <RealTimeDashboardStats userRole="applicant" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Real-time Applications */}
          <div className="lg:col-span-2">
            <RealTimeApplicationStatus />
          </div>

          {/* Notifications */}
          <div>
            <Card className="border-0 bg-gradient-to-br from-white to-blue-50/20 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">{t('dashboard.notifications.title')}</CardTitle>
                <Button variant="outline" size="sm" className="border-blue-300 hover:bg-blue-50">
                  <Bell className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.notifications.slice(0, 5).map((notification) => {
                    const { templateKey, params } = parseNotification(notification);
                    return (
                      <div key={notification.id} className={`p-3 rounded-lg border ${!notification.read ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
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
        <Card className="mt-8 border-0 bg-gradient-to-br from-white to-cyan-50/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">{t('dashboard.recommended.title')}</CardTitle>
            <Button variant="outline" size="sm" className="border-blue-300 hover:bg-blue-50" asChild>
              <Link href="/user/scholarships">
                {t('dashboard.recommended.viewAll')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-equal-height"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {dashboardData.recommendedScholarships.map((scholarship, index) => (
                <motion.div
                  key={scholarship.id}
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <ScholarshipCard
                    scholarship={scholarship}
                    showMatchScore={true}
                    className="w-full h-full"
                  />
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8 border-0 bg-gradient-to-br from-white to-blue-50/20 shadow-lg">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={cardVariants} whileHover="hover">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-blue-200 w-full hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-400 hover:shadow-md transition-all group" asChild>
                <Link href="/user/profile">
                  <User className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                  <span className="text-gray-700 group-hover:text-blue-900 font-medium">{t('dashboard.quickAction.updateProfile')}</span>
                </Link>
              </Button>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-blue-200 w-full hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-400 hover:shadow-md transition-all group" asChild>
                <Link href="/user/scholarships">
                  <Search className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                  <span className="text-gray-700 group-hover:text-blue-900 font-medium">{t('dashboard.quickAction.browseScholarships')}</span>
                </Link>
              </Button>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-blue-200 w-full hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-400 hover:shadow-md transition-all group" asChild>
                <Link href="/user/applications">
                  <FileText className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                  <span className="text-gray-700 group-hover:text-blue-900 font-medium">{t('dashboard.quickAction.myApplications')}</span>
                </Link>
              </Button>
              </motion.div>
              <motion.div variants={cardVariants} whileHover="hover">
                <Button variant="outline" className="h-20 flex-col space-y-2 border-blue-200 w-full hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 hover:border-blue-400 hover:shadow-md transition-all group" asChild>
                <Link href="/user/settings">
                  <Target className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                  <span className="text-gray-700 group-hover:text-blue-900 font-medium">{t('dashboard.quickAction.settings')}</span>
                </Link>
              </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

