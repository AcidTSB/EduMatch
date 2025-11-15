'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, GraduationCap, DollarSign } from 'lucide-react';
import { Scholarship } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplyButton } from '@/components/ApplyButton';
// Thêm formatCurrency vào import nếu chưa có
import { formatDate, getDaysUntilDeadline, truncateText, getMatchScoreColor, formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApplications } from '@/hooks/api';
import { scholarshipCardVariants } from '@/lib/animations';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  showMatchScore?: boolean;
  className?: string;
}

export function ScholarshipCard({ scholarship, showMatchScore = false, className }: ScholarshipCardProps) {
  const { t } = useLanguage();
  const { checkApplicationStatus } = useApplications();
  const [hasApplied, setHasApplied] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        // Chuyển ID sang string nếu cần
        const status = await checkApplicationStatus(scholarship.id.toString());
        setHasApplied(!!status);
      } catch (error) {
        // Failed to check application status
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [scholarship.id, checkApplicationStatus]);
  
  // SỬA: Dùng applicationDeadline thay vì deadline (đã bị xóa)
  const daysUntilDeadline = getDaysUntilDeadline(scholarship.applicationDeadline);
  const isDeadlineSoon = daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
  const isExpired = daysUntilDeadline < 0;

  const getDeadlineStatus = () => {
    if (isExpired) {
      return { text: t('scholarshipCard.expired'), variant: 'destructive' as const, color: 'text-danger-500' };
    }
    if (isDeadlineSoon) {
      return { text: t('scholarshipCard.daysLeft').replace('{days}', daysUntilDeadline.toString()), variant: 'warning' as const, color: 'text-warning-600' };
    }
    // SỬA: Dùng applicationDeadline
    return { text: formatDate(scholarship.applicationDeadline), variant: 'outline' as const, color: 'text-muted-foreground' };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <motion.div
      variants={scholarshipCardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`flex flex-col h-full border-0 bg-gradient-to-br from-white to-blue-50/30 shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}>
        {/* Header */}
        <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-balance bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
            {scholarship.title}
          </CardTitle>
          {/* Match Score (Giữ nguyên logic, trường này đã được thêm lại vào type) */}
          {showMatchScore && scholarship.matchScore && (
            <div className="flex flex-col items-center flex-shrink-0 min-w-[50px]">
              <div className={`text-lg font-bold ${getMatchScoreColor(scholarship.matchScore)}`}>
                {scholarship.matchScore}%
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{t('scholarshipCard.match')}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/* SỬA: Dùng university hoặc providerId (nếu university null) */}
          <span className="font-medium">{scholarship.university || `Provider #${scholarship.providerId}`}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {/* SỬA: Dùng location */}
            <span>{scholarship.location || "Remote"}</span>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 flex flex-col space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
          {truncateText(scholarship.description, 120)}
        </p>

        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {/* SỬA: field đã bị xóa, chuyển sang dùng tags */}
          {scholarship.tags && scholarship.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {scholarship.tags && scholarship.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              {t('scholarshipCard.more').replace('{count}', (scholarship.tags.length - 3).toString())}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            {/* SỬA: Dùng level */}
            <span>{scholarship.level}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {/* SỬA: Dùng studyMode */}
            <span>{scholarship.studyMode.replace('_', ' ')}</span>
          </div>
          
          {/* SỬA: Dùng scholarshipAmount */}
          {(scholarship.scholarshipAmount ?? scholarship.amount ?? 0) > 0 && (
            <div className="flex items-center gap-2 col-span-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <DollarSign className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {/* SỬA: Format scholarshipAmount */}
                {formatCurrency((scholarship.scholarshipAmount ?? scholarship.amount ?? 0))}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={`text-sm font-medium ${deadlineStatus.color}`}>
              {t('scholarshipCard.deadline')}: {deadlineStatus.text}
            </span>
          </div>
          
          {isDeadlineSoon && (
            <Badge variant={deadlineStatus.variant} className="text-xs">
              {t('scholarshipCard.urgent')}
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
          <Link href={`/user/scholarships/${scholarship.id}`}>
            {t('scholarshipCard.viewDetails')}
          </Link>
        </Button>
        <ApplyButton
          scholarship={scholarship}
          hasApplied={hasApplied}
          disabled={loading || isExpired}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
          showDialog={true}
        />
      </CardFooter>
    </Card>
    </motion.div>
  );
}