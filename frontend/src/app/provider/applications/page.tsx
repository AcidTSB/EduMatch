'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Mail,
  GraduationCap,
  Star,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  MessageSquare,
  Building2,
  Send,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProviderApplications, useScholarships } from '@/hooks/api';
import { useApplicationsData, useScholarshipsData } from '@/contexts/AppContext';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { ApplicationStatus } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProviderApplicationsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scholarshipFilter, setScholarshipFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  // Use AppContext hooks instead of API hooks
  const { applications, loading, refetch: refetchApplications } = useApplicationsData();
  const { scholarships, refetch: refetchScholarships } = useScholarshipsData();

  // Mock functions for provider-specific actions
  const updateApplicationStatus = async (applicationId: string, status: string) => {
    // This would update the application status in real implementation
    console.log('Updating application', applicationId, 'to status', status);
    return true;
  };

  const sendMessage = async (applicationId: string, message: string) => {
    // This would send message to applicant in real implementation
    console.log('Sending message to application', applicationId, ':', message);
    return true;
  };

  useEffect(() => {
    refetchApplications();
    refetchScholarships();
  }, []);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success(`Application ${newStatus} successfully!`);
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedApplication || !messageText.trim()) return;

    try {
      await sendMessage(selectedApplication.id, messageText);
      toast.success('Message sent successfully!');
      setMessageText('');
      setIsMessageDialogOpen(false);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

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

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'ACCEPTED':
        return 'default'; // Green
      case 'REJECTED':
        return 'destructive'; // Red
      case 'UNDER_REVIEW':
        return 'secondary'; // Yellow
      case 'SUBMITTED':
        return 'outline'; // Blue
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return t('providerApplications.statusLabels.accepted');
      case 'REJECTED':
        return t('providerApplications.statusLabels.rejected');
      case 'UNDER_REVIEW':
        return t('providerApplications.statusLabels.underReview');
      case 'SUBMITTED':
        return t('providerApplications.statusLabels.new');
      default:
        return status;
    }
  };

  const filteredApplications = applications.filter((app: any) => {
    const scholarship = scholarships.find(s => s.id === app.scholarshipId);
    
    const matchesSearch = !searchTerm || 
      app.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesScholarship = scholarshipFilter === 'all' || app.scholarshipId === scholarshipFilter;
    
    return matchesSearch && matchesStatus && matchesScholarship;
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter((a: any) => a.status === 'SUBMITTED').length,
    underReview: applications.filter((a: any) => a.status === 'UNDER_REVIEW').length,
    accepted: applications.filter((a: any) => a.status === 'ACCEPTED').length,
    rejected: applications.filter((a: any) => a.status === 'REJECTED').length
  };

  const ApplicationDetailModal = ({ application }: { application: any }) => (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>{application.applicant?.name || 'Unknown Applicant'}</span>
          <Badge variant={getStatusVariant(application.status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(application.status)}
              <span>{getStatusLabel(application.status)}</span>
            </div>
          </Badge>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Applicant Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('providerApplications.modal.applicantInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{application.applicant?.name || 'Unknown'}</h3>
                <p className="text-gray-600">{application.applicant?.email || 'No email'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">{t('providerApplications.modal.university')}</p>
                <p className="font-semibold">{application.applicant?.profile?.university || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('providerApplications.modal.major')}</p>
                <p className="font-semibold">{application.applicant?.profile?.major || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('providerApplications.modal.gpa')}</p>
                <p className="font-semibold">{application.applicant?.profile?.gpa || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('providerApplications.modal.graduationYear')}</p>
                <p className="font-semibold">{application.applicant?.profile?.graduationYear || 'Not specified'}</p>
              </div>
            </div>

            {application.applicant?.profile?.skills && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">{t('providerApplications.modal.skills')}</p>
                <div className="flex flex-wrap gap-2">
                  {application.applicant.profile.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500 mb-2">{t('providerApplications.modal.applicationDate')}</p>
              <p className="font-semibold">{formatDate(application.submittedAt || application.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Cover Letter */}
        {application.coverLetter && (
          <Card>
            <CardHeader>
              <CardTitle>{t('providerApplications.modal.coverLetter')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
            </CardContent>
          </Card>
        )}

        {/* Motivation */}
        {application.motivation && (
          <Card>
            <CardHeader>
              <CardTitle>{t('providerApplications.modal.motivation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{application.motivation}</p>
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        {application.additionalInfo && (
          <Card>
            <CardHeader>
              <CardTitle>{t('providerApplications.modal.additionalInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{application.additionalInfo}</p>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Links */}
        {(application.portfolioUrl || application.linkedinUrl || application.githubUrl) && (
          <Card>
            <CardHeader>
              <CardTitle>{t('providerApplications.modal.portfolioLinks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {application.portfolioUrl && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">Portfolio</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('providerApplications.actions.visit')}
                      </a>
                    </Button>
                  </div>
                )}
                {application.linkedinUrl && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">LinkedIn</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={application.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('providerApplications.actions.visit')}
                      </a>
                    </Button>
                  </div>
                )}
                {application.githubUrl && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">GitHub</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={application.githubUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('providerApplications.actions.visit')}
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        {application.additionalDocs && application.additionalDocs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('providerApplications.modal.documents')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {application.additionalDocs.map((doc: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{doc}</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      {t('providerApplications.actions.download')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="flex-1"
            onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}
            disabled={loading}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {t('providerApplications.actions.accept')}
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
            disabled={loading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {t('providerApplications.actions.reject')}
          </Button>
          <Button 
            variant="outline"
            className="flex-1"
            onClick={() => handleStatusUpdate(application.id, 'UNDER_REVIEW')}
            disabled={loading}
          >
            <Clock className="h-4 w-4 mr-2" />
            {t('providerApplications.actions.underReview')}
          </Button>
          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t('providerApplications.actions.sendMessage')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('providerApplications.message.title')} {application.applicant?.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">{t('providerApplications.message.label')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('providerApplications.message.placeholder')}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsMessageDialogOpen(false)}
                  >
                    {t('providerApplications.message.cancel')}
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || loading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t('providerApplications.message.send')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{t('providerApplications.title')}</h1>
              <p className="text-gray-600 mt-2">
                {t('providerApplications.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-brand-blue-100 rounded-lg mr-4">
                <User className="h-6 w-6 text-brand-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('providerApplications.stats.total')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.submitted}</p>
                <p className="text-xs text-muted-foreground">{t('providerApplications.stats.new')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.underReview}</p>
                <p className="text-xs text-muted-foreground">{t('providerApplications.stats.underReview')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">{t('providerApplications.stats.accepted')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mr-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">{t('providerApplications.stats.rejected')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('providerApplications.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('providerApplications.filterStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('providerApplications.statusOptions.all')}</SelectItem>
                  <SelectItem value="SUBMITTED">{t('providerApplications.statusOptions.new')}</SelectItem>
                  <SelectItem value="UNDER_REVIEW">{t('providerApplications.statusOptions.underReview')}</SelectItem>
                  <SelectItem value="ACCEPTED">{t('providerApplications.statusOptions.accepted')}</SelectItem>
                  <SelectItem value="REJECTED">{t('providerApplications.statusOptions.rejected')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scholarshipFilter} onValueChange={setScholarshipFilter}>
                <SelectTrigger className="w-full lg:w-64">
                  <SelectValue placeholder={t('providerApplications.filterScholarship')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('providerApplications.scholarshipOptions.all')}</SelectItem>
                  {scholarships.slice(0, 10).map((scholarship: any) => (
                    <SelectItem key={scholarship.id} value={scholarship.id}>
                      {scholarship.title && scholarship.title.length > 30 
                        ? `${scholarship.title.substring(0, 30)}...`
                        : scholarship.title || 'Untitled Scholarship'
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">{t('providerApplications.loading')}</p>
              </CardContent>
            </Card>
          ) : loading && applications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">{t('providerApplications.loading')}</p>
              </CardContent>
            </Card>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('providerApplications.empty.title')}</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || statusFilter !== 'all' || scholarshipFilter !== 'all'
                    ? t('providerApplications.empty.withFilters')
                    : t('providerApplications.empty.noApps')
                  }
                </p>
                {(searchTerm || statusFilter !== 'all' || scholarshipFilter !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setScholarshipFilter('all');
                    }}
                    className="mt-4"
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((application: any) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.applicant?.name || 'Unknown Applicant'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {application.applicant?.email || 'No email provided'}
                          </p>
                        </div>
                        <Badge variant={getStatusVariant(application.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(application.status)}
                            <span>{getStatusLabel(application.status)}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-3">
                        {scholarships.find(s => s.id === application.scholarshipId)?.title || 'Unknown Scholarship'}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {application.applicant?.profile?.university || 'Not specified'}
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          {application.applicant?.profile?.major || 'Not specified'}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          GPA: {application.applicant?.profile?.gpa || 'N/A'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {t('providerApplications.labels.applied')}: {formatDate(application.submittedAt || application.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t('providerApplications.actions.viewDetails')}
                          </Button>
                        </DialogTrigger>
                        {selectedApplication && (
                          <ApplicationDetailModal application={selectedApplication} />
                        )}
                      </Dialog>

                      <Select
                        value={application.status || 'SUBMITTED'}
                        onValueChange={(value) => handleStatusUpdate(application.id, value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUBMITTED">New</SelectItem>
                          <SelectItem value="UNDER_REVIEW">Review</SelectItem>
                          <SelectItem value="ACCEPTED">Accept</SelectItem>
                          <SelectItem value="REJECTED">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}