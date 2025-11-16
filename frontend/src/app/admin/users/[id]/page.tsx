'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Award,
  FileText,
  Shield,
  Edit,
  Ban,
  UserX,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuditTrail from '@/components/admin/AuditTrail';
import ModalConfirm from '@/components/admin/ModalConfirm';
import { 
  USERS, 
  USER_PROFILES, 
  APPLICATIONS, 
  SCHOLARSHIPS,
  AUDIT_LOGS,
  getUserById,
  getUserProfile,
  getApplicationsByStudent 
} from '@/lib/mock-data';
import { UserRole } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function AdminUserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [showImpersonateModal, setShowImpersonateModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  // Get user data from unified mock data
  const user = getUserById(userId);
  const profile = getUserProfile(userId);
  const userApplications = getApplicationsByStudent(userId);
  const userAuditLogs = AUDIT_LOGS.filter(log => log.targetId === userId || log.adminId === userId).map(log => ({
    id: log.id,
    action: log.action,
    actionType: log.action.split('_')[0] || 'VIEW',
    adminName: USERS.find(u => u.id === log.adminId)?.name || 'Unknown',
    details: log.reason || '',
    entityType: log.targetType,
    entityName: USERS.find(u => u.id === log.targetId)?.name || '',
    createdAt: log.createdAt,
    success: true,
  }));

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleImpersonate = () => {
    console.log('Impersonating user:', userId);
    // TODO: Implement impersonation logic
    setShowImpersonateModal(false);
  };

  const handleBanUser = () => {
    console.log('Banning user:', userId);
    // TODO: Implement ban logic
    setShowBanModal(false);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-700';
      case UserRole.EMPLOYER:
        return 'bg-blue-100 text-blue-700';
      case UserRole.USER:
        return 'bg-green-100 text-green-700';
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
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-500 mt-1">View and manage user details</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImpersonateModal(true)}>
            <UserX className="w-4 h-4 mr-2" />
            Impersonate
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="destructive" onClick={() => setShowBanModal(true)}>
            <Ban className="w-4 h-4 mr-2" />
            Ban User
          </Button>
        </div>
      </div>

      {/* User Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <Badge className={getRoleColor(user.role)}>
                  {user.role === UserRole.ADMIN ? 'Admin' : 
                   user.role === UserRole.USER ? 'Student' : 'Provider'}
                </Badge>
                <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Subscription: {user.subscriptionType || 'FREE'}</span>
                </div>
              </div>

              {profile?.bio && (
                <p className="mt-4 text-gray-700">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="applications">Applications ({userApplications.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity & Audit Logs</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          {profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p className="font-medium">{profile.languages?.join(', ') || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">GPA</p>
                    <p className="font-medium">{profile.gpa ? `${profile.gpa}/4.0` : 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Interests */}
              {profile.interests && profile.interests.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Interests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                No profile information available
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {userApplications.length > 0 ? (
                <div className="space-y-3">
                  {userApplications.map(app => {
                    const scholarship = SCHOLARSHIPS.find(s => s.id === app.scholarshipId);
                    return (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{scholarship?.title || 'Unknown'}</h4>
                          <p className="text-sm text-gray-500">
                            Submitted {app.createdAt ? formatDistanceToNow(new Date(app.createdAt), { addSuffix: true }) : 'Unknown'}
                          </p>
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
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No applications found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity & Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditTrail logs={userAuditLogs} maxHeight="500px" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Impersonate Modal */}
      <ModalConfirm
        isOpen={showImpersonateModal}
        onClose={() => setShowImpersonateModal(false)}
        onConfirm={handleImpersonate}
        title="Impersonate User"
        description={`You are about to impersonate ${user.name}. You will see the application from their perspective. This action will be logged for security purposes.`}
        variant="warning"
        confirmText="Start Impersonation"
      />

      {/* Ban User Modal */}
      <ModalConfirm
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBanUser}
        title="Ban User"
        description={`Are you sure you want to ban ${user.name}? They will be immediately logged out and unable to access the platform. This action can be reversed later.`}
        variant="danger"
        confirmText="Ban User"
      />
    </div>
  );
}
