'use client';

import React, { useState } from 'react';
import { 
  Plus,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  FileText,
  Award,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ScholarshipStatus } from '@/types';
import { useApplicationsData, useScholarshipsData } from '@/contexts/AppContext';

export default function ProviderDashboardPage() {
  // Use AppContext data
  const { applications } = useApplicationsData();
  const { scholarships } = useScholarshipsData();

  // Calculate real stats from AppContext data
  const dashboardData = React.useMemo(() => ({
    stats: {
      totalScholarships: scholarships.length,
      activeScholarships: scholarships.filter(s => s.status === ScholarshipStatus.PUBLISHED).length,
      totalApplications: applications.length,
      acceptedStudents: applications.filter(a => a.status === 'ACCEPTED').length
    },
    recentApplications: applications.slice(0, 3).map(app => ({
      id: app.id,
      applicantName: app.applicant?.name || 'Unknown',
      applicantEmail: app.applicant?.email || 'No email',
      scholarshipTitle: scholarships.find(s => s.id === app.scholarshipId)?.title || 'Unknown Scholarship',
      appliedDate: app.submittedAt?.toISOString().split('T')[0] || '',
      status: app.status.toLowerCase(),
      gpa: app.applicant?.gpa || 0,
      university: app.applicant?.university || 'Unknown'
    })),
    myScholarships: scholarships.slice(0, 4).map(s => ({
      ...s,
      status: s.status || ScholarshipStatus.PUBLISHED,
      applicationCount: applications.filter(app => app.scholarshipId === s.id).length
    }))
  }), [scholarships, applications]);

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
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
      case 'submitted':
        return 'New Application';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Provider Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage your scholarships and review applications
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button asChild>
                <Link href="/provider/scholarships/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scholarship
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-brand-blue-100 rounded-lg mr-4">
                <Award className="h-6 w-6 text-brand-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardData.stats.totalScholarships}</p>
                <p className="text-xs text-muted-foreground">Total Scholarships</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardData.stats.activeScholarships}</p>
                <p className="text-xs text-muted-foreground">Active Scholarships</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardData.stats.totalApplications}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dashboardData.stats.acceptedStudents}</p>
                <p className="text-xs text-muted-foreground">Accepted Students</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Applications</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/provider/applications">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{application.applicantName}</h4>
                          <Badge variant={getStatusVariant(application.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(application.status)}
                              <span>{getStatusLabel(application.status)}</span>
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{application.scholarshipTitle}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span>GPA: {application.gpa}</span>
                          <span>{application.university}</span>
                          <span>Applied: {formatDate(application.appliedDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/provider/applications`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applications this week</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending reviews</span>
                    <span className="font-semibold text-yellow-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Acceptance rate</span>
                    <span className="font-semibold text-green-600">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. GPA</span>
                    <span className="font-semibold">3.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Scholarships */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Scholarships</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/provider/scholarships">
                Manage All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.myScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={scholarship.status === ScholarshipStatus.PUBLISHED ? 'success' : 'secondary'}>
                        {scholarship.status === ScholarshipStatus.PUBLISHED ? 'Published' : 'Draft'}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/provider/scholarships/${scholarship.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/provider/scholarships/${scholarship.id}/applications`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {scholarship.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {scholarship.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {scholarship.applicationCount} applications
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Deadline: {scholarship.deadline ? formatDate(scholarship.deadline) : 'TBA'}
                      </div>
                      {scholarship.stipend && (
                        <div className="flex items-center text-sm text-green-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {scholarship.stipend}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/provider/scholarships/${scholarship.id}/applications`}>
                        View Applications ({scholarship.applicationCount})
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/provider/scholarships/create">
                  <Plus className="h-6 w-6" />
                  <span>Create Scholarship</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/provider/applications">
                  <FileText className="h-6 w-6" />
                  <span>Review Applications</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/provider/scholarships">
                  <Award className="h-6 w-6" />
                  <span>Manage Scholarships</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                <Link href="/provider/analytics">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Analytics</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
