'use client';

import React from 'react';
import { X, User, GraduationCap, DollarSign, Calendar, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ApplicationData {
  id: string;
  studentName: string;
  studentEmail: string;
  scholarship: string;
  provider: string;
  amount: string;
  status: string;
  submittedDate: string;
  gpa: number;
  documents: number;
}

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationData | null;
}

export function ViewApplicationModal({
  isOpen,
  onClose,
  application,
}: ViewApplicationModalProps) {
  if (!isOpen || !application) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Under Review':
        return 'bg-blue-100 text-blue-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {application.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(application.status)}>
              {application.status}
            </Badge>
            <span className="text-sm text-gray-500">
              Submitted: {application.submittedDate}
            </span>
          </div>

          {/* Student Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Student Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{application.studentName}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {application.studentEmail}
                </p>
              </div>
              <div>
                <p className="text-gray-500">GPA</p>
                <p className="font-medium text-gray-900">{application.gpa.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Documents Submitted</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {application.documents} files
                </p>
              </div>
            </div>
          </div>

          {/* Scholarship Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              Scholarship Information
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Scholarship Title</p>
                <p className="font-medium text-gray-900">{application.scholarship}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Provider</p>
                  <p className="font-medium text-gray-900">{application.provider}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {application.amount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Timeline
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Application Submitted</p>
                  <p className="text-gray-500">{application.submittedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-1 border-l-2 border-gray-300 pl-2 py-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Current Status</p>
                  <p className="text-gray-500">{application.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a preview of the application. Full detail page with documents, 
              essays, and review history will be implemented in future updates.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
