'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  Building2, 
  User, 
  Award,
  CheckCircle,
  Heart,
  Share2,
  FileText,
  GraduationCap,
  Globe,
  Mail,
  ExternalLink,
  Users,
  Star,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { ApplyButton } from '@/components/ApplyButton';
import { useApplications, useSavedScholarships } from '@/hooks/api';
import { mockScholarships } from '@/lib/mock-api';
import { Scholarship, ScholarshipType, ScholarshipStatus } from '@/types';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  // Use our custom hooks
  const { checkApplicationStatus } = useApplications();
  const { isScholarshipSaved, toggleSaved, loading: savedLoading } = useSavedScholarships();

  useEffect(() => {
    const fetchData = async () => {
      const scholarshipId = params.id as string;
      setIsLoading(true);

      try {
        // For now, use mock data but with API structure
        // TODO: Replace with actual API call when backend is ready
        const found = mockScholarships.find(s => s.id === scholarshipId);
        setScholarship(found || null);

        if (found) {
          // Check if user has already applied
          const applicationStatus = await checkApplicationStatus(scholarshipId);
          setHasApplied(!!applicationStatus);
        }
      } catch (error) {
        console.error('Error fetching scholarship:', error);
        toast.error(t('scholarshipDetail.loadError'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, checkApplicationStatus]);

  const handleSaveToggle = async () => {
    if (!scholarship) return;

    try {
      await toggleSaved(scholarship.id);
      toast.success(isScholarshipSaved(scholarship.id) ? t('scholarshipDetail.savedSuccess') : t('scholarshipDetail.unsavedSuccess'));
    } catch (error) {
      toast.error(t('scholarshipDetail.savedError'));
    }
  };

  const getTypeColor = (type: ScholarshipType) => {
    switch (type) {
      case ScholarshipType.UNDERGRADUATE:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case ScholarshipType.GRADUATE:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ScholarshipType.PHD:
        return 'bg-green-100 text-green-800 border-green-200';
      case ScholarshipType.POSTDOC:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case ScholarshipType.RESEARCH:
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: ScholarshipStatus) => {
    switch (status) {
      case ScholarshipStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case ScholarshipStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case ScholarshipStatus.CLOSED:
        return 'bg-red-100 text-red-800';
      case ScholarshipStatus.EXPIRED:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('scholarshipDetail.back')}
          </Button>
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('scholarshipDetail.notFound')}</h1>
              <p className="text-gray-600 mb-6">
                {t('scholarshipDetail.notFoundDesc')}
              </p>
              <Button onClick={() => router.push('/applicant/scholarships')}>
                {t('scholarshipDetail.browseAll')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = new Date() > new Date(scholarship.applicationDeadline);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('scholarshipDetail.back')}
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={cn("border", getTypeColor(scholarship.type))}>
                    {scholarship.type.replace('_', ' ')}
                  </Badge>
                  <Badge className={getStatusColor(scholarship.status)}>
                    {scholarship.status}
                  </Badge>
                  {scholarship.isRemote && (
                    <Badge variant="outline">
                      <Globe className="h-3 w-3 mr-1" />
                      {t('scholarshipDetail.remote')}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {scholarship.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    {scholarship.university}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {scholarship.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t('scholarshipDetail.due')} {formatDate(scholarship.applicationDeadline)}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {scholarship.viewCount} {t('scholarshipDetail.views')}
                  </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed">
                  {scholarship.description}
                </p>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {t('scholarshipDetail.details')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Financial Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {t('scholarshipDetail.financialInfo')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{t('scholarshipDetail.amount')}:</span>
                      <p className="font-medium text-2xl text-green-600">
                        {formatCurrency(scholarship.amount || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('scholarshipDetail.duration')}:</span>
                      <p className="font-medium">{scholarship.duration} {t('scholarshipDetail.months')}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('scholarshipDetail.payment')}:</span>
                      <p className="font-medium">
                        {scholarship.isPaidMonthly ? t('scholarshipDetail.monthly') : t('scholarshipDetail.lumpSum')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('scholarshipDetail.department')}:</span>
                      <p className="font-medium">{scholarship.department}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timeline */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {t('scholarshipDetail.timeline')}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                      <span className="text-sm text-gray-600 whitespace-nowrap">{t('scholarshipDetail.applicationDeadline')}:</span>
                      <span className={cn("text-sm font-medium", isDeadlinePassed ? "text-red-600" : "text-gray-900")}>
                        {formatDate(scholarship.applicationDeadline)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                      <span className="text-sm text-gray-600 whitespace-nowrap">{t('scholarshipDetail.startDate')}:</span>
                      <span className="text-sm font-medium text-gray-900">{scholarship.startDate ? formatDate(scholarship.startDate) : t('scholarshipDetail.tbd')}</span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                      <span className="text-sm text-gray-600 whitespace-nowrap">{t('scholarshipDetail.endDate')}:</span>
                      <span className="text-sm font-medium text-gray-900">{scholarship.endDate ? formatDate(scholarship.endDate) : t('scholarshipDetail.tbd')}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Requirements */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t('scholarshipDetail.requirements')}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                      <span className="text-sm text-gray-600 whitespace-nowrap">{t('scholarshipDetail.minGpa')}:</span>
                      <p className="text-sm font-medium text-gray-900">{scholarship.minGpa}/4.0</p>
                    </div>
                    
                    {scholarship.requiredSkills && scholarship.requiredSkills.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">{t('scholarshipDetail.requiredSkills')}:</span>
                        <div className="flex flex-wrap gap-2">
                          {scholarship.requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {scholarship.preferredSkills && scholarship.preferredSkills.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">{t('scholarshipDetail.preferredSkills')}:</span>
                        <div className="flex flex-wrap gap-2">
                          {scholarship.preferredSkills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {t('scholarshipDetail.contactInfo')}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                      <span className="text-sm text-gray-600 whitespace-nowrap">Email:</span>
                      <a href={`mailto:${scholarship.contactEmail}`} className="text-sm text-blue-600 hover:underline break-all">
                        {scholarship.contactEmail}
                      </a>
                    </div>
                    {scholarship.website && (
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                        <span className="text-sm text-gray-600 whitespace-nowrap">Website:</span>
                        <a 
                          href={scholarship.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {t('scholarshipDetail.visitWebsite')}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <ApplyButton 
                    scholarship={scholarship}
                    hasApplied={hasApplied}
                    className="w-full"
                  />

                  <Button 
                    variant="outline" 
                    onClick={handleSaveToggle}
                    disabled={savedLoading}
                    className="w-full"
                  >
                    {isScholarshipSaved(scholarship?.id || '') ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 mr-2" />
                        {t('scholarshipDetail.saved')}
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        {t('scholarshipDetail.saveForLater')}
                      </>
                    )}
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('scholarshipDetail.share')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('scholarshipDetail.quickStats')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('scholarshipDetail.views')}</span>
                  <span className="font-medium">{scholarship.viewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('scholarshipDetail.applications')}</span>
                  <span className="font-medium">{Math.floor(Math.random() * 50) + 10}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('scholarshipDetail.acceptanceRate')}</span>
                  <span className="font-medium">{Math.floor(Math.random() * 30) + 15}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('scholarshipDetail.competition')}</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.random() > 0.5 ? t('scholarshipDetail.competitionHigh') : t('scholarshipDetail.competitionMedium')}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {scholarship.tags && scholarship.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('scholarshipDetail.tags')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
