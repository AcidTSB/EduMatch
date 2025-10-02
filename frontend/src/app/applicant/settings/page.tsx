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
  Settings as SettingsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth';

// Mock settings data
const initialSettings = {
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    deadlineReminders: true,
    newMatches: false,
    marketingEmails: false,
    weeklyDigest: true
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    showOnlineStatus: true
  },
  account: {
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30
  },
  preferences: {
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  }
};

export default function SettingsPage() {
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

  const updatePreferenceSetting = (key: string, value: string) => {
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
      // Simulate API call
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // Simulate API call
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
    // Mock data export
    const exportData = {
      profile: 'user profile data...',
      applications: 'application data...',
      settings: settings
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'edumatch_data_export.json';
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
              <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="space-y-8">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Checkbox
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', checked === true)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive push notifications</p>
                </div>
                <Checkbox
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateNotificationSetting('pushNotifications', checked === true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Application Updates</p>
                  <p className="text-sm text-gray-600">Get notified about application status changes</p>
                </div>
                <Checkbox
                  checked={settings.notifications.applicationUpdates}
                  onCheckedChange={(checked) => updateNotificationSetting('applicationUpdates', checked === true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Deadline Reminders</p>
                  <p className="text-sm text-gray-600">Receive reminders about upcoming deadlines</p>
                </div>
                <Checkbox
                  checked={settings.notifications.deadlineReminders}
                  onCheckedChange={(checked) => updateNotificationSetting('deadlineReminders', checked === true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Scholarship Matches</p>
                  <p className="text-sm text-gray-600">Get notified about new scholarship opportunities</p>
                </div>
                <Checkbox
                  checked={settings.notifications.newMatches}
                  onCheckedChange={(checked) => updateNotificationSetting('newMatches', checked === true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                </div>
                <Checkbox
                  checked={settings.notifications.marketingEmails}
                  onCheckedChange={(checked) => updateNotificationSetting('marketingEmails', checked === true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-gray-600">Receive weekly summary emails</p>
                </div>
                <Checkbox
                  checked={settings.notifications.weeklyDigest}
                  onCheckedChange={(checked) => updateNotificationSetting('weeklyDigest', checked === true)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-gray-600">Control who can see your profile</p>
                </div>
                <select 
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="providers_only">Providers Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Email Address</p>
                  <p className="text-sm text-gray-600">Allow others to see your email</p>
                </div>
                <Checkbox
                  checked={settings.privacy.showEmail}
                  onCheckedChange={(checked) => updatePrivacySetting('showEmail', checked === true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Phone Number</p>
                  <p className="text-sm text-gray-600">Allow others to see your phone number</p>
                </div>
                <Checkbox
                  checked={settings.privacy.showPhone}
                  onCheckedChange={(checked) => updatePrivacySetting('showPhone', checked === true)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Direct Messages</p>
                  <p className="text-sm text-gray-600">Let providers contact you directly</p>
                </div>
                <Checkbox
                  checked={settings.privacy.allowDirectMessages}
                  onCheckedChange={(checked) => updatePrivacySetting('allowDirectMessages', checked === true)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
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
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
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
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select 
                    value={settings.preferences.language}
                    onChange={(e) => updatePreferenceSetting('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select 
                    value={settings.preferences.timezone}
                    onChange={(e) => updatePreferenceSetting('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                  >
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select 
                    value={settings.preferences.dateFormat}
                    onChange={(e) => updatePreferenceSetting('dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select 
                    value={settings.preferences.currency}
                    onChange={(e) => updatePreferenceSetting('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Your Data</p>
                  <p className="text-sm text-gray-600">Download a copy of your data</p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-600">Delete Account</p>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
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

          {/* Save Settings Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isLoading} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
