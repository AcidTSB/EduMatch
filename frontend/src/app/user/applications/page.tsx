'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useApplicationsData, useScholarshipsData } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ApplicationsPage() {
  const { t } = useLanguage();
  // Use AppContext hooks
  const { applications } = useApplicationsData();
  const { scholarships } = useScholarshipsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'destructive';
      case 'UNDER_REVIEW':
        return 'warning';
      case 'SUBMITTED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return t('applicantApplications.stats.accepted');
      case 'REJECTED':
        return t('applicantApplications.stats.rejected');
      case 'UNDER_REVIEW':
        return t('applicantApplications.stats.underReview');
      case 'SUBMITTED':
        return t('applicantApplications.stats.submitted');
      default:
        return 'Unknown';
    }
  };

  const filteredApplications = applications.filter(app => {
    const scholarship = scholarships.find(s => s.id === app.scholarshipId);
    if (!scholarship) return false;

    const matchesSearch = !searchTerm || 
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.providerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'PENDING').length,
    underReview: applications.filter(a => a.status === 'VIEWED').length,
    accepted: applications.filter(a => a.status === 'ACCEPTED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{t('applicantApplications.title')}</h1>
              <p className="text-gray-600 mt-2">
                {t('applicantApplications.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('applicantApplications.stats.total')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg mr-4">
                <AlertCircle className="h-6 w-6 text-cyan-700" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">{stats.submitted}</p>
                <p className="text-xs text-muted-foreground">{t('applicantApplications.stats.submitted')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">{stats.underReview}</p>
                <p className="text-xs text-muted-foreground">{t('applicantApplications.stats.underReview')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">{t('applicantApplications.stats.accepted')}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg mr-4">
                <XCircle className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">{t('applicantApplications.stats.rejected')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('applicantApplications.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
                >
                  <option value="all">{t('applicantApplications.filterStatus')}</option>
                  <option value="SUBMITTED">{t('applicantApplications.statusOptions.submitted')}</option>
                  <option value="UNDER_REVIEW">{t('applicantApplications.statusOptions.underReview')}</option>
                  <option value="ACCEPTED">{t('applicantApplications.statusOptions.accepted')}</option>
                  <option value="REJECTED">{t('applicantApplications.statusOptions.rejected')}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('applicantApplications.empty.title')}</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? t('applicantApplications.empty.withFilters')
                    : t('applicantApplications.empty.noApps')
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => window.location.href = '/user/scholarships'}>
                    {t('applicantApplications.empty.browse')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application) => {
              const scholarship = scholarships.find(s => s.id === application.scholarshipId);
              if (!scholarship) return null;

              return (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {scholarship.title}
                          </h3>
                          <Badge variant={getStatusVariant(application.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(application.status)}
                              <span>{getStatusLabel(application.status)}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Building2 className="h-4 w-4 mr-1" />
                          {scholarship.providerName || 'Unknown Provider'}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {t('applicantApplications.labels.applied')}: {application.createdAt ? formatDate(application.createdAt) : 'N/A'}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {t('applicantApplications.labels.updated')}: {application.updatedAt ? formatDate(application.updatedAt) : 'N/A'}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {application.additionalDocs?.length || 0} {t('applicantApplications.labels.documents')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {t('applicantApplications.actions.viewDetails')}
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          {t('applicantApplications.actions.download')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

