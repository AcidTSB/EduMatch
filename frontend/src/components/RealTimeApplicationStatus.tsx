'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, XCircle, AlertCircle, Calendar, Building2, ArrowRight } from 'lucide-react';
import { useApplicationStore } from '@/stores/realtimeStore';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useApplicationsData, useScholarshipsData } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function RealTimeApplicationStatus() {
  const { t } = useLanguage();
  const { applicationStatuses } = useApplicationStore();
  
  // Get real data from AppContext
  const { applications } = useApplicationsData();
  const { scholarships } = useScholarshipsData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'SUBMITTED':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'ACCEPTED':
        return 'default'; // Green
      case 'REJECTED':
        return 'destructive';
      case 'UNDER_REVIEW':
        return 'secondary';
      case 'SUBMITTED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return t('applicationStatus.accepted');
      case 'REJECTED':
        return t('applicationStatus.rejected');
      case 'UNDER_REVIEW':
        return t('applicationStatus.underReview');
      case 'SUBMITTED':
        return t('applicationStatus.submitted');
      default:
        return t('applicationStatus.unknown');
    }
  };

  // Use real applications data with scholarship info
  const displayApplications = applications.slice(0, 5).map(app => {
    const scholarship = scholarships.find(s => s.id === app.scholarshipId);
    return {
      id: app.id,
      scholarshipId: app.scholarshipId,
      scholarshipTitle: scholarship?.title || 'Unknown Scholarship',
      provider: scholarship?.providerName || 'Unknown Provider',
      status: app.status,
      appliedDate: app.submittedAt ? formatDate(app.submittedAt) : null,
      deadline: scholarship?.deadline ? formatDate(scholarship.deadline) : null,
      updatedAt: app.updatedAt ? formatDate(app.updatedAt) : null
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('dashboard.recentApplications.title')}</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Real-time updates"></div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/user/applications">
              {t('dashboard.recentApplications.viewAll')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayApplications.map((application: any) => (
            <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {application.scholarshipTitle || `Scholarship ${application.scholarshipId}`}
                </h4>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Building2 className="h-4 w-4 mr-1" />
                  {application.provider || 'Unknown Provider'}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {t('dashboard.recentApplications.applied')}: {application.appliedDate ? formatDate(application.appliedDate) : formatDate(application.updatedAt)}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={getStatusVariant(application.status)} className="flex items-center space-x-1">
                  {getStatusIcon(application.status)}
                  <span>{getStatusLabel(application.status)}</span>
                </Badge>
              </div>
            </div>
          ))}
          
          {displayApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('dashboard.recentApplications.noApplications')}</p>
              <Button asChild className="mt-4">
                <Link href="/user/scholarships">{t('dashboard.recentApplications.browse')}</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}