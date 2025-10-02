'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApplications } from '@/hooks/api';
import { Scholarship } from '@/types';
import { toast } from 'react-hot-toast';

interface ApplyButtonProps {
  scholarship: Scholarship;
  hasApplied?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  showDialog?: boolean; // If false, will navigate to detail page instead
}

export function ApplyButton({ 
  scholarship, 
  hasApplied = false, 
  disabled = false,
  variant = 'default',
  size = 'default',
  className = '',
  children,
  showDialog = true
}: ApplyButtonProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    motivation: '',
    additionalInfo: '',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  });

  const { submitApplication, loading: applicationLoading } = useApplications();

  const isDeadlinePassed = new Date() > new Date(scholarship.applicationDeadline);
  const canApply = scholarship.status === 'PUBLISHED' && !isDeadlinePassed && !hasApplied;

  const handleApply = async () => {
    if (!canApply) return;

    try {
      await submitApplication({
        scholarshipId: scholarship.id,
        ...applicationData,
      });

      setIsDialogOpen(false);
      toast.success('Application submitted successfully!');
      
      // Reset form
      setApplicationData({
        coverLetter: '',
        motivation: '',
        additionalInfo: '',
        portfolioUrl: '',
        linkedinUrl: '',
        githubUrl: ''
      });

      // Refresh the page or redirect
      router.refresh();
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleClick = () => {
    if (!showDialog) {
      router.push(`/applicant/scholarships/${scholarship.id}`);
      return;
    }
  };

  // Button content
  const buttonContent = children || (
    hasApplied ? (
      <>
        <CheckCircle className="h-4 w-4 mr-2" />
        Applied
      </>
    ) : canApply ? (
      <>
        <GraduationCap className="h-4 w-4 mr-2" />
        Apply Now
      </>
    ) : (
      isDeadlinePassed ? "Deadline Passed" : "View Details"
    )
  );

  if (hasApplied) {
    return (
      <Button 
        disabled 
        variant={variant} 
        size={size} 
        className={className}
      >
        {buttonContent}
      </Button>
    );
  }

  if (!canApply) {
    return (
      <Button 
        disabled={isDeadlinePassed} 
        variant={isDeadlinePassed ? 'secondary' : variant} 
        size={size} 
        className={className}
        onClick={handleClick}
      >
        {buttonContent}
      </Button>
    );
  }

  if (!showDialog) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handleClick}
        disabled={disabled || applicationLoading}
      >
        {buttonContent}
      </Button>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={disabled || applicationLoading}
        >
          {buttonContent}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for {scholarship.title}</DialogTitle>
          <DialogDescription>
            Submit your application for this scholarship. Make sure to provide all required information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <Textarea
              id="coverLetter"
              placeholder="Write your cover letter..."
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
              className="min-h-[120px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motivation">Motivation *</Label>
            <Textarea
              id="motivation"
              placeholder="Why are you interested in this scholarship?"
              value={applicationData.motivation}
              onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
              className="min-h-[120px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional information you'd like to share..."
              value={applicationData.additionalInfo}
              onChange={(e) => setApplicationData({...applicationData, additionalInfo: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
              <Input
                id="portfolioUrl"
                type="url"
                placeholder="https://"
                value={applicationData.portfolioUrl}
                onChange={(e) => setApplicationData({...applicationData, portfolioUrl: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/"
                value={applicationData.linkedinUrl}
                onChange={(e) => setApplicationData({...applicationData, linkedinUrl: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/"
              value={applicationData.githubUrl}
              onChange={(e) => setApplicationData({...applicationData, githubUrl: e.target.value})}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(false)}
            disabled={applicationLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={applicationLoading || !applicationData.coverLetter || !applicationData.motivation}
          >
            {applicationLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}