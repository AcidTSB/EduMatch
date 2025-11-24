'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle,
  Share2,
  FileText,
  Mail,
  ExternalLink,
  Users,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Clock, // Thêm Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { ApplyButton } from '@/components/ApplyButton';
import { useApplications, useSavedScholarships } from '@/hooks/api';
import { scholarshipServiceApi } from '@/services/scholarship.service';
import { mapOpportunityDetailToScholarship } from '@/lib/scholarship-mapper';
import {
  Scholarship,
  ScholarshipType,
  StudyMode,
  ModerationStatus,
} from '@/types';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export default function ScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [matchScore, setMatchScore] = useState<number | undefined>(undefined);

  const { checkApplicationStatus } = useApplications();
  const {
    isScholarshipSaved,
    toggleSaved,
    loading: savedLoading,
  } = useSavedScholarships();

  useEffect(() => {
    const fetchData = async () => {
      const scholarshipId = params.id as string;
      setIsLoading(true);

      try {
        // Fetch scholarship detail from API
        const response = await scholarshipServiceApi.getScholarshipById(scholarshipId);
        
        // Map backend response to frontend format
        const mapped = mapOpportunityDetailToScholarship(response);
        setScholarship(mapped.scholarship);
        setMatchScore(mapped.matchScore);

        // Increment view count
        scholarshipServiceApi.incrementViewCount(scholarshipId);

        // Check if user has applied - only set to true if explicitly confirmed
        const appStatus = await checkApplicationStatus(scholarshipId);
        // checkApplicationStatus returns { hasApplied: boolean, application?: ... }
        setHasApplied(appStatus?.hasApplied === true);
      } catch (error) {
        console.error('Error fetching scholarship:', error);
        toast.error(t('scholarshipDetail.loadError') || 'Failed to load scholarship');
        setScholarship(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, t, checkApplicationStatus]);

  // SỬA 2: Thêm kiểm tra null cho scholarship và scholarship.id
  const handleSaveToggle = async () => {
    if (!scholarship || !scholarship.id) return; // Đảm bảo scholarship và id tồn tại

    const scholarshipIdStr = scholarship.id.toString();
    await toggleSaved(scholarshipIdStr);
    toast.success(
      isScholarshipSaved(scholarshipIdStr)
        ? 'Removed from saved'
        : 'Saved for later'
    );
  };

  // Hàm tính Duration (số tháng)
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Tính số tháng chênh lệch
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();

    // Làm tròn nếu cần (ở đây lấy tháng trọn vẹn hoặc hơn)
    return months <= 0 ? 0 : months;
  };

  // SỬA 3: Đổi 'ScholarshipLevel' thành 'ScholarshipType'
  const getLevelColor = (level: ScholarshipType | string) => {
    // ... (Giữ nguyên logic màu)
    switch (level) {
      case ScholarshipType.UNDERGRADUATE:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case ScholarshipType.MASTER: // Lỗi này được sửa trong file types
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ScholarshipType.PHD: // Lỗi này được sửa trong file types
        return 'bg-green-100 text-green-800 border-green-200';
      case ScholarshipType.POSTDOC: // Lỗi này được sửa trong file types
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case ScholarshipType.RESEARCH:
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: ModerationStatus | string) => {
    switch (status) {
      case ModerationStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ModerationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ModerationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading)
    return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Scholarship Not Found</h1>
        <Button onClick={() => router.push('/user/scholarships')}>
          Back to List
        </Button>
      </div>
    );
  }

  const duration =
    scholarship.endDate && scholarship.startDate
      ? calculateDuration(scholarship.startDate, scholarship.endDate)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('scholarshipDetail.back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {/* SỬA 4: Các lỗi 'level', 'studyMode', 'moderationStatus' được sửa trong file types */}
                  <Badge
                    className={cn('border', getLevelColor(scholarship.level))}
                  >
                    {scholarship.level.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {scholarship.studyMode.replace('_', ' ')}
                  </Badge>
                  <Badge
                    className={getStatusColor(scholarship.moderationStatus)}
                  >
                    {scholarship.moderationStatus}
                  </Badge>

                  {(scholarship.matchScore !== undefined || matchScore !== undefined) && (
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-700 bg-green-50 font-semibold"
                    >
                      {(scholarship.matchScore || matchScore || 0)}% Match
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {scholarship.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  {scholarship.university && (
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                      {scholarship.university}
                    </div>
                  )}

                  {scholarship.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {scholarship.location}
                    </div>
                  )}

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    {/* SỬA 5: Thêm fallback cho formatDate */}
                    {t('scholarshipDetail.due')}{' '}
                    {formatDate(scholarship.applicationDeadline || '')}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    {/* SỬA 6: Đổi 'viewsCnt' thành 'viewCount' */}
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
                      <span className="text-gray-600">
                        {t('scholarshipDetail.amount')}:
                      </span>
                      <p className="font-medium text-2xl text-green-600">
                        {/* SỬA 7: Lỗi 'scholarshipAmount' được sửa trong file types */}
                        {formatCurrency(scholarship.scholarshipAmount || 0)}
                      </p>
                    </div>

                    {/* THÊM: Duration (Tính toán) */}
                    {duration > 0 && (
                      <div>
                        <span className="text-gray-600">
                          {t('scholarshipDetail.duration')}:
                        </span>
                        <p className="font-medium text-lg">
                          {duration} {t('scholarshipDetail.months')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* THÊM: Timeline */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {t('scholarshipDetail.timeline')}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                      <span className="text-sm text-gray-600 whitespace-nowrap w-32">
                        {t('scholarshipDetail.applicationDeadline')}:
                      </span>
                      {/* Thêm pl-1 vào đây */}
                      <span className="text-sm font-medium text-red-600 pl-1">
                        {/* SỬA 8: Thêm fallback cho formatDate */}
                        {formatDate(scholarship.applicationDeadline || '')}
                      </span>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                      <span className="text-sm text-gray-600 whitespace-nowrap w-32">
                        {t('scholarshipDetail.startDate')}:
                      </span>
                      {/* Thêm pl-1 vào đây */}
                      <span className="text-sm font-medium text-gray-900 pl-1">
                        {formatDate(scholarship.startDate || '')}
                      </span>
                    </div>
                    {scholarship.endDate && (
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                        <span className="text-sm text-gray-600 whitespace-nowrap w-32">
                          {t('scholarshipDetail.endDate')}:
                        </span>
                        {/* Thêm pl-1 vào đây */}
                        <span className="text-sm font-medium text-gray-900 pl-1">
                          {formatDate(scholarship.endDate)}
                        </span>
                      </div>
                    )}
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
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {t('scholarshipDetail.minGpa')}:
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {scholarship.minGpa}/4.0
                      </p>
                    </div>

                    {scholarship.requiredSkills &&
                      scholarship.requiredSkills.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600 block mb-2">
                            {t('scholarshipDetail.requiredSkills')}:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {scholarship.requiredSkills.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
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
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        Email:
                      </span>
                      <a
                        href={`mailto:${scholarship.contactEmail}`}
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {scholarship.contactEmail}
                      </a>
                    </div>
                    {scholarship.website && (
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 items-baseline">
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          Website:
                        </span>
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
                    {isScholarshipSaved(scholarship?.id.toString() || '') ? (
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
                <CardTitle className="text-lg">
                  {t('scholarshipDetail.quickStats')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {t('scholarshipDetail.views')}
                  </span>
                  {/* SỬA 9: Đổi 'viewsCnt' thành 'viewCount' */}
                  <span className="font-medium">{scholarship.viewCount}</span>
                </div>
                {/* Applications count - removed static data, will be fetched from API if needed */}
              </CardContent>
            </Card>

            {/* Tags */}
            {scholarship.tags && scholarship.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('scholarshipDetail.tags')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
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