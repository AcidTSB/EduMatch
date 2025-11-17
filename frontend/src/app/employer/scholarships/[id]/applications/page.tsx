  // Helper to get applicant profile by applicantId
  const getApplicantProfile = (applicantId: string) => {
    // Replace with actual lookup from USER_PROFILES context or mock data
    return {
      name: 'Unknown',
      email: 'Unknown',
      university: 'Unknown',
      major: 'Unknown',
      gpa: 'N/A',
      avatar: '',
      skills: [],
      bio: '',
      graduationYear: 'Unknown',
    };
  };
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Users,
  GraduationCap,
  Calendar,
  MapPin,
  Star,
  Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApplicationsData, useScholarshipsData, useApp } from '@/contexts/AppContext';
import { useRealTime } from '@/providers/RealTimeProvider';
import { Application, Scholarship, ApplicationStatus } from '@/types';

export default function ScholarshipApplicationsPage() {
  const params = useParams();
  const scholarshipId = params.id as string;
  
  // Use AppContext data
  const { applications: allApplications } = useApplicationsData();
  const { scholarships } = useScholarshipsData();
  const { addNotification } = useApp();
  const { sendMessage } = useRealTime();
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  // Get scholarship and its applications from AppContext
  const scholarship = useMemo(() => 
    scholarships.find(s => s.id === scholarshipId), 
    [scholarships, scholarshipId]
  );
  
  const applications = useMemo(() => 
    allApplications.filter(app => app.scholarshipId === scholarshipId),
    [allApplications, scholarshipId]
  );

  // Memoize filtered applications to prevent infinite re-renders
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((app: Application) => {
        const profile = getApplicantProfile(app.applicantId);
        return profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.university.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app: Application) => app.status === statusFilter);
    }

    return filtered;
  }, [applications, searchTerm, statusFilter]);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      // This would update the application status in real implementation
      toast.success(`Application ${newStatus} successfully!`);
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedApplication || !messageText.trim() || !messageSubject.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    try {
      // Send real-time message through socket
      sendMessage(selectedApplication.applicantId, `Subject: ${messageSubject}\n\n${messageText}`);
      
      // Also create notification for the applicant
      await addNotification({
        userId: selectedApplication.applicantId,
        type: 'INFO',
        title: `New message: ${messageSubject}`,
        message: messageText,
        read: false
      });

      toast.success('Message sent successfully via real-time!');
      setMessageText('');
      setMessageSubject('');
      setIsMessageDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'submitted':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'default'; // Green
      case 'rejected':
        return 'destructive'; // Red
      case 'under_review':
        return 'secondary'; // Yellow
      case 'submitted':
        return 'outline'; // Blue
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
      case 'submitted':
        return 'New Application';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Scholarship Not Found</h1>
          <p className="text-gray-600">The scholarship you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Applications for "{scholarship.title}"
        </h1>
        <p className="text-gray-600 mb-4">{scholarship.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {applications.length} applications
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Deadline: {scholarship?.applicationDeadline ? formatDate(scholarship.applicationDeadline) : 'TBA'}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            ${scholarship.amount?.toLocaleString() || 'TBA'}/year
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search applicants by name, email, or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">New Applications</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No applications found matching your criteria.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      {(() => {
                        const profile = getApplicantProfile(application.applicantId);
                        return <>
                          <AvatarImage src={profile.avatar} alt={profile.name} />
                          <AvatarFallback>{profile.name.split(' ').map((n: string) => n[0]).join('') || 'N/A'}</AvatarFallback>
                        </>;
                      })()}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getApplicantProfile(application.applicantId).name}
                        </h3>
                        <Badge variant={getStatusVariant(application.status)} className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{getApplicantProfile(application.applicantId).email}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {getApplicantProfile(application.applicantId).university} • {getApplicantProfile(application.applicantId).major}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          GPA: {getApplicantProfile(application.applicantId).gpa}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied: {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {getApplicantProfile(application.applicantId).skills.slice(0, 3).map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {getApplicantProfile(application.applicantId).skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{getApplicantProfile(application.applicantId).skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Applied on {application.createdAt ? formatDate(application.createdAt.toString()) : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* View Details Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Application Details - {getApplicantProfile(application.applicantId).name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Personal Info */}
                          <div>
                            <h4 className="font-semibold mb-2">Personal Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Email:</span>
                                {getApplicantProfile(application.applicantId).email}
                              </div>
                              <div>
                                <span className="text-gray-500">University:</span>
                                {getApplicantProfile(application.applicantId).university}
                              </div>
                              <div>
                                <span className="text-gray-500">Major:</span>
                                {getApplicantProfile(application.applicantId).major}
                              </div>
                              <div>
                                <span className="text-gray-500">GPA:</span>
                                {getApplicantProfile(application.applicantId).gpa}
                              </div>
                              <div>
                                <span className="text-gray-500">Graduation Year:</span>
                                {getApplicantProfile(application.applicantId).graduationYear}
                              </div>
                            </div>
                          </div>

                          {/* Skills */}
                          <div>
                            <h4 className="font-semibold mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {getApplicantProfile(application.applicantId).skills.map((skill: string) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Experience */}
                          <div>
                            <h4 className="font-semibold mb-2">Bio</h4>
                            {getApplicantProfile(application.applicantId).bio || 'No bio provided'}
                          </div>

                          {/* Cover Letter */}
                          <div>
                            <h4 className="font-semibold mb-2">Cover Letter</h4>
                            {/* coverLetter removed, not in Application type */}
                          </div>

                          {/* Additional Documents */}
                          {application.additionalDocs && application.additionalDocs.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Additional Documents</h4>
                              <div className="space-y-1">
                                {application.additionalDocs.map((doc: string, index: number) => (
                                  <p key={index} className="text-sm text-blue-600">{doc}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status Actions */}
                          <div>
                            <h4 className="font-semibold mb-2">Update Status</h4>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusUpdate(application.id, 'VIEWED')}
                                disabled={application.status === 'VIEWED'}
                              >
                                Mark Under Review
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusUpdate(application.id, 'ACCEPTED')}
                                disabled={application.status === 'ACCEPTED'}
                              >
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleStatusUpdate(application.id, 'REJECTED')}
                                disabled={application.status === 'REJECTED'}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Send Message Dialog */}
                    <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Message to {selectedApplication?.applicant?.name || 'Applicant'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Subject</label>
                            <Input
                              placeholder="Enter message subject..."
                              value={messageSubject}
                              onChange={(e) => setMessageSubject(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Message</label>
                            <Textarea
                              placeholder="Type your message here..."
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              rows={6}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSendMessage}>
                              <Send className="h-4 w-4 mr-1" />
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Quick Status Update */}
                    <Select 
                      value={application.status} 
                      onValueChange={(value) => handleStatusUpdate(application.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">New</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="accepted">Accept</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(app => app.status === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-500">New Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {/* If you want to support VIEWED status, update here */}
              {applications.filter(app => app.status === 'VIEWED').length}
            </div>
            <div className="text-sm text-gray-500">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'ACCEPTED').length}
            </div>
            <div className="text-sm text-gray-500">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {applications.filter(app => app.status === 'REJECTED').length}
            </div>
            <div className="text-sm text-gray-500">Rejected</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}