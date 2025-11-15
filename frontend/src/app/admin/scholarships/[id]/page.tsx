'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  Edit,
  Eye,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  Users,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { RejectModal } from '@/components/ui/reject-modal';
import { RequestChangesModal } from '@/components/ui/request-changes-modal';
import { toast } from 'sonner';
import { 
  SCHOLARSHIPS, 
  APPLICATIONS, 
  USERS, 
  REPORTS,
  getUserById,
  getApplicationsByScholarship 
} from '@/lib/mock-data';
import { ScholarshipStatus, AuthUser } from '@/types';

export default function AdminScholarshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Get scholarship data from unified mock data
  const scholarship = SCHOLARSHIPS.find(s => s.id === scholarshipId);
  const applications = getApplicationsByScholarship(scholarshipId);
  const provider = scholarship ? getUserById(scholarship.providerId) : null;
  const reports = REPORTS.filter(r => r.targetId === scholarshipId && r.targetType === 'SCHOLARSHIP');

  if (!scholarship) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Scholarship not found</h2>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    console.log('Approving scholarship:', scholarshipId);
    // TODO: API call + real-time socket broadcast
    setShowApproveModal(false);
    toast.success('Scholarship Approved!', {
      description: `${scholarship.title} has been published and the provider has been notified.`,
    });
  };

  const handleReject = (reason: string) => {
    console.log('Rejecting scholarship:', scholarshipId, reason);
    // TODO: API call + email notification
    setShowRejectModal(false);
    toast.error('Scholarship Rejected', {
      description: `The provider will be notified with your reason.`,
    });
  };

  const handleRequestChanges = (data: { subject: string; message: string }) => {
    console.log('Requesting changes:', scholarshipId, data);
    // TODO: API call + send message to provider
    setShowRequestChangesModal(false);
    toast.info('Change Request Sent', {
      description: `Provider will be notified to update the scholarship.`,
    });
  };

  const handleDelete = () => {
    console.log('Deleting scholarship:', scholarshipId);
    // TODO: API call
    setShowDeleteModal(false);
    toast.success('Scholarship Deleted', {
      description: `${scholarship.title} has been permanently removed.`,
    });
    setTimeout(() => router.push('/admin/scholarships'), 1500);
  };

  const getStatusColor = (status: ScholarshipStatus) => {
    switch (status) {
      case ScholarshipStatus.PUBLISHED:
        return 'bg-green-100 text-green-700';
      case ScholarshipStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scholarship Details</h1>
            <p className="text-gray-500 mt-1">Review and moderate scholarship posting</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowRequestChangesModal(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Request Changes
          </Button>
          <Button variant="destructive" onClick={() => setShowRejectModal(true)}>
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button onClick={() => setShowApproveModal(true)}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      </div>

      {/* Scholarship Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{scholarship.title}</h2>
                <Badge className={getStatusColor(scholarship.status as ScholarshipStatus)}>
                  {scholarship.status}
                </Badge>
              </div>
              <p className="text-gray-700 mb-4">{scholarship.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-semibold">${scholarship.amount?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-semibold">
                  {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">{scholarship.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">University</p>
                <p className="font-semibold">{scholarship.university}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="provider">Provider Info</TabsTrigger>
          <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scholarship.requirements && typeof scholarship.requirements === 'object' ? (
                    <>
                      {scholarship.requirements.minGpa && (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Minimum GPA: {scholarship.requirements.minGpa}</span>
                        </li>
                      )}
                      {scholarship.requirements.englishProficiency && (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">English Proficiency: {scholarship.requirements.englishProficiency}</span>
                        </li>
                      )}
                      {scholarship.requirements.documents && Array.isArray(scholarship.requirements.documents) && (
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            Documents Required: {scholarship.requirements.documents.join(', ')}
                          </span>
                        </li>
                      )}
                    </>
                  ) : (
                    <li className="text-sm text-gray-500">No specific requirements listed</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="default">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  {scholarship.preferredSkills && scholarship.preferredSkills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Preferred Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {scholarship.preferredSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{scholarship.duration} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{scholarship.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remote</p>
                  <p className="font-medium">{scholarship.isRemote ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Minimum GPA</p>
                  <p className="font-medium">{scholarship.minGpa || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">View Count</p>
                  <p className="font-medium">{scholarship.viewCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Applications</p>
                  <p className="font-medium">{applications.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(scholarship.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications ({applications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map(app => {
                    const applicant = USERS.find((u: AuthUser) => u.id === app.applicantId);
                    return (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{applicant?.name || 'Unknown'}</h4>
                          <p className="text-sm text-gray-500">{applicant?.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            app.status === 'ACCEPTED' ? 'default' :
                            app.status === 'REJECTED' ? 'destructive' :
                            'secondary'
                          }>
                            {app.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No applications yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Provider Tab */}
        <TabsContent value="provider">
          <Card>
            <CardHeader>
              <CardTitle>Provider Information</CardTitle>
            </CardHeader>
            <CardContent>
              {provider ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                      {provider.name?.split(' ').map(n => n[0]).join('') || 'P'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-500">{provider.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant={provider.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {provider.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Subscription</p>
                      <p className="font-medium">{provider.subscriptionType}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => router.push(`/admin/users/${provider.id}`)}>
                    View Full Profile
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">Provider information not available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports ({reports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length > 0 ? (
                <div className="space-y-3">
                  {reports.map(report => (
                    <div key={report.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Flag className="w-4 h-4 text-red-600" />
                            <span className="font-semibold">{report.category}</span>
                            <Badge variant="secondary">{report.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-700">{report.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Reported by {report.reporterName} • {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No reports filed</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approve Modal */}
      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        title="Approve Scholarship"
        description={`Are you sure you want to approve "${scholarship.title}"? This will publish the scholarship and send a real-time notification to the provider.`}
        variant="success"
        confirmText="Approve & Publish"
      />

      {/* Reject Modal */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleReject}
        title="Reject Scholarship"
        placeholder="Explain why this scholarship is being rejected (minimum 10 characters)..."
      />

      {/* Request Changes Modal */}
      <RequestChangesModal
        isOpen={showRequestChangesModal}
        onClose={() => setShowRequestChangesModal(false)}
        onSubmit={handleRequestChanges}
        title="Request Changes"
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Scholarship"
        description={`Are you sure you want to permanently delete "${scholarship.title}"? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete Permanently"
      />
    </div>
  );
}
