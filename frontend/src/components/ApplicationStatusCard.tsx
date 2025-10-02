'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApplicationStore } from '@/stores/realtimeStore';
import { ApplicationStatus } from '@/types/realtime';
import { formatDistanceToNow } from 'date-fns';
import { Clock, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';

interface ApplicationStatusCardProps {
  applicationId: string;
  scholarshipTitle: string;
  providerId: string;
  providerName: string;
  submittedAt: string;
}

export function ApplicationStatusCard({
  applicationId,
  scholarshipTitle,
  providerId,
  providerName,
  submittedAt
}: ApplicationStatusCardProps) {
  const { applicationStatuses } = useApplicationStore();
  const status = applicationStatuses[applicationId];

  const getStatusConfig = (status?: ApplicationStatus['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Review',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="h-4 w-4" />,
          description: 'Your application is being reviewed'
        };
      case 'interview':
        return {
          label: 'Interview Scheduled',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Users className="h-4 w-4" />,
          description: 'You have been selected for interview'
        };
      case 'accepted':
        return {
          label: 'Accepted',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-4 w-4" />,
          description: 'Congratulations! Your application was accepted'
        };
      case 'rejected':
        return {
          label: 'Not Selected',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-4 w-4" />,
          description: 'Unfortunately, your application was not selected'
        };
      case 'waitlist':
        return {
          label: 'Waitlisted',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertCircle className="h-4 w-4" />,
          description: 'You are on the waiting list'
        };
      default:
        return {
          label: 'Pending Review',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="h-4 w-4" />,
          description: 'Your application is being processed'
        };
    }
  };

  const statusConfig = getStatusConfig(status?.status);
  const lastUpdated = status?.updatedAt || submittedAt;

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight mb-1">
              {scholarshipTitle}
            </CardTitle>
            <p className="text-sm text-gray-600">by {providerName}</p>
          </div>
          <Badge 
            variant="outline" 
            className={`ml-3 flex-shrink-0 ${statusConfig.color} animate-pulse`}
          >
            <span className="flex items-center gap-1">
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{statusConfig.description}</p>
          
          {status?.notes && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-1">Notes from provider:</p>
              <p className="text-sm text-gray-600">{status.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <span>
              Submitted {formatDistanceToNow(new Date(submittedAt), { addSuffix: true })}
            </span>
            <span>
              Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        {/* Progress bar for pending applications */}
        {status?.status === 'pending' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Review Progress</span>
              <span>Step 1 of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 animate-pulse" 
                style={{ width: '33%' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Application Review</span>
              <span>Interview</span>
              <span>Decision</span>
            </div>
          </div>
        )}

        {/* Interview progress */}
        {status?.status === 'interview' && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Review Progress</span>
              <span>Step 2 of 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: '66%' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span className="text-green-600">✓ Application Review</span>
              <span className="text-blue-600 font-medium">Interview</span>
              <span>Decision</span>
            </div>
          </div>
        )}

        {/* Success state */}
        {status?.status === 'accepted' && (
          <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Application Successful!</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Check your email for next steps and scholarship details.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}