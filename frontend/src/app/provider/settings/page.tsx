'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  User, 
  Globe,
  Mail,
  Smartphone,
  Shield,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon,
  Building2,
  CreditCard,
  Award,
  Users,
  Calendar,
  Zap,
  Star,
  FileText,
  BarChart3,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';

// Mock settings data for provider
const initialSettings = {
  organization: {
    name: 'MIT Research Institute',
    type: 'university',
    website: 'https://mit.edu',
    description: 'Leading research institution focused on technology and innovation',
    contactEmail: 'scholarships@mit.edu',
    contactPhone: '+1 (617) 253-1000',
    address: {
      street: '77 Massachusetts Avenue',
      city: 'Cambridge',
      state: 'MA',
      zipCode: '02139',
      country: 'United States'
    },
    verificationStatus: 'verified',
    taxId: '04-2103594'
  },
  notifications: {
    emailNotifications: true,
    applicationAlerts: true,
    deadlineReminders: true,
    marketingEmails: false,
    weeklyReports: true,
    systemUpdates: true,
    newStudentMatches: true,
    applicantMessages: true
  },
  privacy: {
    organizationVisibility: 'public',
    showContactInfo: true,
    allowDirectApplications: true,
    requireApplicationReview: true,
    autoResponders: false,
    showResponseTime: true,
    displaySuccessRate: true
  },
  account: {
    twoFactorEnabled: true,
    loginAlerts: true,
    sessionTimeout: 60,
    ipWhitelist: [],
    apiAccess: false
  },
  preferences: {
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    defaultScholarshipDuration: '12 months',
    autoPublishScholarships: false,
    requireGPAMinimum: true,
    defaultGPAMinimum: 3.0
  },
  subscription: {
    plan: 'Enterprise',
    status: 'active',
    scholarshipsLimit: 'unlimited',
    applicationsLimit: 'unlimited',
    analyticsAccess: true,
    prioritySupport: true,
    customBranding: true,
    billingCycle: 'annual',
    nextBillingDate: '2024-12-15'
  }
};

export default function ProviderSettingsPage() {
  const { logout } = useAuth();
  const [settings, setSettings] = useState(initialSettings);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [activeTab, setActiveTab] = useState('organization');

  const updateOrganizationSetting = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      if (parent === 'address') {
        setSettings(prev => ({
          ...prev,
          organization: {
            ...prev.organization,
            address: {
              ...prev.organization.address,
              [child]: value
            }
          }
        }));
      }
    } else {
      setSettings(prev => ({
        ...prev,
        organization: {
          ...prev.organization,
          [key]: value
        }
      }));
    }
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const updateAccountSetting = (key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        [key]: value
      }
    }));
  };

  const updatePreferenceSetting = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your organization account? This action cannot be undone and will remove all your scholarships and applications.')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Account deleted successfully. You will be redirected to the home page.');
        logout();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete account' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = () => {
    const exportData = {
      organization: settings.organization,
      scholarships: 'scholarship data...',
      applications: 'application data...',
      analytics: 'analytics data...',
      settings: settings
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'provider_data_export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Provider Settings</h1>
              <p className="text-gray-600 mt-2">
                Manage your organization profile, scholarship settings, and preferences
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Badge variant={settings.organization.verificationStatus === 'verified' ? 'success' : 'secondary'}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {settings.organization.verificationStatus === 'verified' ? 'Verified Organization' : 'Pending Verification'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="organization" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Organization</span>
            </TabsTrigger>
            <TabsTrigger value="scholarships" className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Scholarships</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* Organization Settings */}
          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Organization Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Name *
                    </label>
                    <Input
                      value={settings.organization.name}
                      onChange={(e) => updateOrganizationSetting('name', e.target.value)}
                      placeholder="Enter organization name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization Type
                    </label>
                    <select 
                      value={settings.organization.type}
                      onChange={(e) => updateOrganizationSetting('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                    >
                      <option value="university">University</option>
                      <option value="research_institute">Research Institute</option>
                      <option value="foundation">Foundation</option>
                      <option value="corporation">Corporation</option>
                      <option value="government">Government Agency</option>
                      <option value="nonprofit">Non-Profit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <Input
                      type="url"
                      value={settings.organization.website}
                      onChange={(e) => updateOrganizationSetting('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax ID / EIN
                    </label>
                    <Input
                      value={settings.organization.taxId}
                      onChange={(e) => updateOrganizationSetting('taxId', e.target.value)}
                      placeholder="Enter tax identification number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <Input
                      type="email"
                      value={settings.organization.contactEmail}
                      onChange={(e) => updateOrganizationSetting('contactEmail', e.target.value)}
                      placeholder="contact@organization.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <Input
                      type="tel"
                      value={settings.organization.contactPhone}
                      onChange={(e) => updateOrganizationSetting('contactPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Description
                  </label>
                  <textarea
                    value={settings.organization.description}
                    onChange={(e) => updateOrganizationSetting('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                    rows={4}
                    placeholder="Describe your organization and its mission..."
                  />
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-medium mb-4">Organization Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <Input
                        value={settings.organization.address.street}
                        onChange={(e) => updateOrganizationSetting('address.street', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <Input
                        value={settings.organization.address.city}
                        onChange={(e) => updateOrganizationSetting('address.city', e.target.value)}
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State/Province
                      </label>
                      <Input
                        value={settings.organization.address.state}
                        onChange={(e) => updateOrganizationSetting('address.state', e.target.value)}
                        placeholder="State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP/Postal Code
                      </label>
                      <Input
                        value={settings.organization.address.zipCode}
                        onChange={(e) => updateOrganizationSetting('address.zipCode', e.target.value)}
                        placeholder="12345"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select 
                        value={settings.organization.address.country}
                        onChange={(e) => updateOrganizationSetting('address.country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scholarship Settings */}
          <TabsContent value="scholarships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Scholarship Defaults</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Scholarship Duration
                    </label>
                    <select 
                      value={settings.preferences.defaultScholarshipDuration}
                      onChange={(e) => updatePreferenceSetting('defaultScholarshipDuration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                    >
                      <option value="3 months">3 months</option>
                      <option value="6 months">6 months</option>
                      <option value="12 months">12 months</option>
                      <option value="18 months">18 months</option>
                      <option value="24 months">24 months</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Minimum GPA
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="4.0"
                      value={settings.preferences.defaultGPAMinimum}
                      onChange={(e) => updatePreferenceSetting('defaultGPAMinimum', parseFloat(e.target.value))}
                      placeholder="3.0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-publish Scholarships</p>
                      <p className="text-sm text-gray-600">Automatically publish new scholarships when created</p>
                    </div>
                    <Checkbox
                      checked={settings.preferences.autoPublishScholarships}
                      onCheckedChange={(checked) => updatePreferenceSetting('autoPublishScholarships', checked === true)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require GPA Minimum</p>
                      <p className="text-sm text-gray-600">Require minimum GPA for all scholarships by default</p>
                    </div>
                    <Checkbox
                      checked={settings.preferences.requireGPAMinimum}
                      onCheckedChange={(checked) => updatePreferenceSetting('requireGPAMinimum', checked === true)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Application Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Application Review</p>
                    <p className="text-sm text-gray-600">All applications must be manually reviewed before acceptance</p>
                  </div>
                  <Checkbox
                    checked={settings.privacy.requireApplicationReview}
                    onCheckedChange={(checked) => updatePrivacySetting('requireApplicationReview', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Auto-responders</p>
                    <p className="text-sm text-gray-600">Send automatic confirmation emails to applicants</p>
                  </div>
                  <Checkbox
                    checked={settings.privacy.autoResponders}
                    onCheckedChange={(checked) => updatePrivacySetting('autoResponders', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Response Time</p>
                    <p className="text-sm text-gray-600">Display average response time on your profile</p>
                  </div>
                  <Checkbox
                    checked={settings.privacy.showResponseTime}
                    onCheckedChange={(checked) => updatePrivacySetting('showResponseTime', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Display Success Rate</p>
                    <p className="text-sm text-gray-600">Show scholarship acceptance rate publicly</p>
                  </div>
                  <Checkbox
                    checked={settings.privacy.displaySuccessRate}
                    onCheckedChange={(checked) => updatePrivacySetting('displaySuccessRate', checked === true)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive general notifications via email</p>
                  </div>
                  <Checkbox
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Application Alerts</p>
                    <p className="text-sm text-gray-600">Get notified when students apply to your scholarships</p>
                  </div>
                  <Checkbox
                    checked={settings.notifications.applicationAlerts}
                    onCheckedChange={(checked) => updateNotificationSetting('applicationAlerts', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Deadline Reminders</p>
                    <p className="text-sm text-gray-600">Receive reminders about upcoming scholarship deadlines</p>
                  </div>
                  <Checkbox
                    checked={settings.notifications.deadlineReminders}
                    onCheckedChange={(checked) => updateNotificationSetting('deadlineReminders', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Student Matches</p>
                    <p className="text-sm text-gray-600">Get notified about students that match your scholarships</p>
                  </div>
                  <Checkbox
                    checked={settings.notifications.newStudentMatches}
                    onCheckedChange={(checked) => updateNotificationSetting('newStudentMatches', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Applicant Messages</p>
                    <p className="text-sm text-gray-600">Receive notifications for direct messages from applicants</p>
                  </div>
                  <Checkbox
                    checked={settings.notifications.applicantMessages}
                    onCheckedChange={(checked) => updateNotificationSetting('applicantMessages', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-gray-600">Receive weekly summary reports of your scholarship performance</p>
                  </div>
                  <Checkbox
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => updateNotificationSetting('weeklyReports', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-gray-600">Get notified about platform updates and new features</p>
                  </div>
                  <Checkbox
                    checked={settings.notifications.systemUpdates}
                    onCheckedChange={(checked) => updateNotificationSetting('systemUpdates', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive promotional emails and platform updates</p>
                  </div>
                  <Checkbox
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) => updateNotificationSetting('marketingEmails', checked === true)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy & Visibility</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Organization Visibility</p>
                    <p className="text-sm text-gray-600">Control who can see your organization profile</p>
                  </div>
                  <select 
                    value={settings.privacy.organizationVisibility}
                    onChange={(e) => updatePrivacySetting('organizationVisibility', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="verified_students">Verified Students Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Contact Information</p>
                    <p className="text-sm text-gray-600">Display contact details on your public profile</p>
                  </div>
                  <Checkbox
                    checked={settings.privacy.showContactInfo}
                    onCheckedChange={(checked) => updatePrivacySetting('showContactInfo', checked === true)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Direct Applications</p>
                    <p className="text-sm text-gray-600">Students can apply directly without pre-screening</p>
                  </div>
                  <Checkbox
                    checked={settings.privacy.allowDirectApplications}
                    onCheckedChange={(checked) => updatePrivacySetting('allowDirectApplications', checked === true)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div>
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          required
                          minLength={8}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={settings.account.twoFactorEnabled ? 'success' : 'secondary'}>
                        {settings.account.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateAccountSetting('twoFactorEnabled', !settings.account.twoFactorEnabled)}
                      >
                        {settings.account.twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Login Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                  </div>
                  <Checkbox
                    checked={settings.account.loginAlerts}
                    onCheckedChange={(checked) => updateAccountSetting('loginAlerts', checked === true)}
                  />
                </div>

                {/* Session Timeout */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-gray-600">Auto-logout after inactivity (minutes)</p>
                  </div>
                  <Input
                    type="number"
                    min="15"
                    max="480"
                    value={settings.account.sessionTimeout}
                    onChange={(e) => updateAccountSetting('sessionTimeout', parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Subscription & Billing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan */}
                <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>{settings.subscription.plan} Plan</span>
                      </h3>
                      <p className="text-gray-600">Full access to all features</p>
                    </div>
                    <Badge variant="success">
                      {settings.subscription.status.charAt(0).toUpperCase() + settings.subscription.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-blue-600">{settings.subscription.scholarshipsLimit}</p>
                      <p className="text-sm text-gray-600">Scholarships</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-blue-600">{settings.subscription.applicationsLimit}</p>
                      <p className="text-sm text-gray-600">Applications</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-blue-600">✓</p>
                      <p className="text-sm text-gray-600">Priority Support</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Next billing: {settings.subscription.nextBillingDate}
                    </span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        Change Plan
                      </Button>
                      <Button variant="outline" size="sm">
                        View Invoices
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium mb-4">Plan Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Unlimited scholarships</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Unlimited applications</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Advanced analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Custom branding</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>API access</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Organization Data</p>
                    <p className="text-sm text-gray-600">Download all your organization's data and settings</p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-600">Delete Organization Account</p>
                      <p className="text-sm text-gray-600">Permanently delete your organization account and all associated data</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
