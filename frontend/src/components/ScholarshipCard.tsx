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
import { formatDate, getDaysUntilDeadline, truncateText, getMatchScoreColor } from '@/lib/utils';
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
        const status = await checkApplicationStatus(scholarship.id);
        setHasApplied(!!status);
      } catch (error) {
        console.error('Error checking application status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [scholarship.id, checkApplicationStatus]);
  
  const daysUntilDeadline = getDaysUntilDeadline(scholarship.deadline || scholarship.applicationDeadline);
  const isDeadlineSoon = daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
  const isExpired = daysUntilDeadline < 0;

  const getDeadlineStatus = () => {
    if (isExpired) {
      return { text: t('scholarshipCard.expired'), variant: 'destructive' as const, color: 'text-danger-500' };
    }
    if (isDeadlineSoon) {
      return { text: t('scholarshipCard.daysLeft').replace('{days}', daysUntilDeadline.toString()), variant: 'warning' as const, color: 'text-warning-600' };
    }
    return { text: formatDate(scholarship.deadline || scholarship.applicationDeadline), variant: 'outline' as const, color: 'text-muted-foreground' };
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
      <Card className={`flex flex-col h-full ${className}`}>
        {/* Header */}
        <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg font-semibold line-clamp-2 text-balance">
            {scholarship.title}
          </CardTitle>
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
          <span className="font-medium">{scholarship.providerName || scholarship.university}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{scholarship.country || scholarship.location}</span>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 flex flex-col space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
          {truncateText(scholarship.description, 120)}
        </p>

        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {scholarship.field && scholarship.field.slice(0, 3).map((field, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {field}
            </Badge>
          ))}
          {scholarship.field && scholarship.field.length > 3 && (
            <Badge variant="outline" className="text-xs">
              {t('scholarshipCard.more').replace('{count}', (scholarship.field.length - 3).toString())}
            </Badge>
          )}
          {!scholarship.field && scholarship.tags && scholarship.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>{scholarship.level || scholarship.type}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{scholarship.studyMode || (scholarship.isRemote ? t('scholarshipCard.remote') : t('scholarshipCard.onsite'))}</span>
          </div>
          
          {(scholarship.stipend || scholarship.amount) && (
            <div className="flex items-center gap-2 col-span-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-success-600">
                {scholarship.stipend || (scholarship.amount ? `$${scholarship.amount.toLocaleString()}` : '')}
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
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/applicant/scholarships/${scholarship.id}`}>
            {t('scholarshipCard.viewDetails')}
          </Link>
        </Button>
        <ApplyButton
          scholarship={scholarship}
          hasApplied={hasApplied}
          disabled={loading || isExpired}
          className="flex-1"
          showDialog={true}
        />
      </CardFooter>
    </Card>
    </motion.div>
  );
}
