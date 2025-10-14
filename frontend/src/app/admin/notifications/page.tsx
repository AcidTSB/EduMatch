'use client';

import React, { useState } from 'react';
import { Bell, Send, Users, User, Megaphone, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModalForm, { FormField } from '@/components/admin/ModalForm';
import StatCard from '@/components/admin/StatCard';

interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  type: 'SYSTEM' | 'ANNOUNCEMENT' | 'ALERT' | 'UPDATE';
}

const templates: NotificationTemplate[] = [
  { id: 'maintenance', name: 'System Maintenance', description: 'Scheduled maintenance notification', type: 'SYSTEM' },
  { id: 'new-feature', name: 'New Feature', description: 'Announce new platform features', type: 'ANNOUNCEMENT' },
  { id: 'security-alert', name: 'Security Alert', description: 'Important security updates', type: 'ALERT' },
  { id: 'policy-update', name: 'Policy Update', description: 'Platform policy changes', type: 'UPDATE' }
];

export default function AdminNotificationsPage() {
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [stats] = useState({
    totalSent: 1284,
    delivered: 1203,
    pending: 45,
    failed: 36
  });

  const sendFields: FormField[] = [
    {
      name: 'targetAudience',
      label: 'Target Audience',
      type: 'select',
      required: true,
      options: [
        { label: 'All Users', value: 'ALL_USERS' },
        { label: 'Applicants Only', value: 'APPLICANTS' },
        { label: 'Providers Only', value: 'PROVIDERS' },
        { label: 'Premium Users', value: 'PREMIUM' },
        { label: 'Specific User (by email)', value: 'SPECIFIC' }
      ]
    },
    {
      name: 'specificEmail',
      label: 'User Email (if specific)',
      type: 'email',
      required: false,
      placeholder: 'user@example.com'
    },
    {
      name: 'type',
      label: 'Notification Type',
      type: 'select',
      required: true,
      options: [
        { label: 'System', value: 'SYSTEM' },
        { label: 'Announcement', value: 'ANNOUNCEMENT' },
        { label: 'Alert', value: 'ALERT' },
        { label: 'Update', value: 'UPDATE' }
      ]
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      required: true,
      options: [
        { label: 'Low', value: 'LOW' },
        { label: 'Normal', value: 'NORMAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Urgent', value: 'URGENT' }
      ]
    },
    {
      name: 'title',
      label: 'Notification Title',
      type: 'text',
      required: true,
      placeholder: 'Enter notification title...'
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      required: true,
      placeholder: 'Enter notification message...',
      rows: 6
    },
    {
      name: 'actionUrl',
      label: 'Action URL (optional)',
      type: 'text',
      required: false,
      placeholder: '/dashboard'
    },
    {
      name: 'actionLabel',
      label: 'Action Button Label (optional)',
      type: 'text',
      required: false,
      placeholder: 'View Details'
    },
    {
      name: 'sendEmail',
      label: 'Also Send Email',
      type: 'select',
      required: true,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
      ]
    }
  ];

  const handleSendNotification = (data: Record<string, any>) => {
    console.log('Sending notification:', data);
    // TODO: API call to send notification
    // - If targetAudience === 'SPECIFIC', send to specificEmail
    // - Otherwise, send to all matching users
    // - If sendEmail === 'yes', trigger email notifications
    // - Broadcast via WebSocket for real-time delivery
    setShowSendModal(false);
    setSelectedTemplate(null);
    toast.success('Notification Sent', {
      description: `"${data.title}" sent to ${data.targetAudience}. ${data.sendEmail === 'yes' ? 'Email notifications also sent.' : ''}`,
    });
  };

  const useTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setShowSendModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
          <p className="text-gray-500 mt-1">Send system-wide notifications to users</p>
        </div>
        <Button onClick={() => setShowSendModal(true)} className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          Send New Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Sent"
          value={stats.totalSent}
          icon={<Send className="w-6 h-6 text-blue-600" />}
          trend="up"
          change={8.5}
          changeLabel="vs last month"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={<Bell className="w-6 h-6 text-green-600" />}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<AlertCircle className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Failed"
          value={stats.failed}
          icon={<AlertCircle className="w-6 h-6 text-red-600" />}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="send" className="w-full">
        <TabsList>
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Send Tab */}
        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Send</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => setShowSendModal(true)}
                >
                  <Users className="w-8 h-8 text-blue-600" />
                  <span>Send to All Users</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => setShowSendModal(true)}
                >
                  <User className="w-8 h-8 text-green-600" />
                  <span>Send to Applicants</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => setShowSendModal(true)}
                >
                  <Megaphone className="w-8 h-8 text-purple-600" />
                  <span>Send to Providers</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'System Maintenance', time: '2 hours ago', audience: 'All Users', status: 'Delivered' },
                  { title: 'New Scholarship Posted', time: '5 hours ago', audience: 'Applicants', status: 'Delivered' },
                  { title: 'Profile Verification Reminder', time: '1 day ago', audience: 'Providers', status: 'Delivered' }
                ].map((notif, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{notif.title}</div>
                        <div className="text-sm text-gray-500">{notif.time} • {notif.audience}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">{notif.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    </div>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => useTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: 'notif-1', title: 'System Maintenance Scheduled', sent: '2024-01-15 14:30', recipients: 1284, delivered: 1203, failed: 36 },
                  { id: 'notif-2', title: 'New Feature: Advanced Filters', sent: '2024-01-14 10:00', recipients: 856, delivered: 850, failed: 6 },
                  { id: 'notif-3', title: 'Security Update Required', sent: '2024-01-13 09:15', recipients: 1284, delivered: 1270, failed: 14 },
                  { id: 'notif-4', title: 'Monthly Newsletter', sent: '2024-01-10 08:00', recipients: 1284, delivered: 1256, failed: 28 }
                ].map((notif) => (
                  <div key={notif.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{notif.title}</div>
                      <Badge className="bg-gray-100 text-gray-700">{notif.sent}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Recipients: </span>
                        <span className="font-medium">{notif.recipients}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Delivered: </span>
                        <span className="font-medium text-green-600">{notif.delivered}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Failed: </span>
                        <span className="font-medium text-red-600">{notif.failed}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send Modal */}
      <ModalForm
        isOpen={showSendModal}
        onClose={() => {
          setShowSendModal(false);
          setSelectedTemplate(null);
        }}
        onSubmit={handleSendNotification}
        title={selectedTemplate ? `Send ${selectedTemplate.name}` : 'Send Notification'}
        fields={sendFields}
        submitText="Send Notification"
        cancelText="Cancel"
        initialValues={selectedTemplate ? {
          type: selectedTemplate.type,
          title: selectedTemplate.name,
          message: selectedTemplate.description
        } : undefined}
      />
    </div>
  );
}
