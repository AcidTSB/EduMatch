'use client';

import React, { useState } from 'react';
import { 
  Settings, Mail, Key, Shield, Bell, DollarSign, 
  Globe, Database, Save, RefreshCw, Eye, EyeOff 
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ModalConfirm from '@/components/admin/ModalConfirm';

export default function AdminSettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@edumatch.com',
    smtpPassword: '••••••••',
    fromName: 'EduMatch Platform',
    fromEmail: 'noreply@edumatch.com'
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState({
    stripePublic: 'pk_test_••••••••••••••••',
    stripeSecret: 'sk_test_••••••••••••••••',
    googleMaps: 'AIzaSy••••••••••••••••',
    sendgrid: 'SG.••••••••••••••••'
  });

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'EduMatch',
    siteUrl: 'https://edumatch.com',
    supportEmail: 'support@edumatch.com',
    maxUploadSize: '10',
    maintenanceMode: false,
    signupEnabled: true
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    applicationFee: '25',
    premiumMonthly: '29.99',
    premiumYearly: '299.99',
    currency: 'USD',
    taxRate: '0'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    systemAlerts: true
  });

  const handleSaveSettings = () => {
    console.log('Saving settings...');
    // TODO: API call to save all settings
    setShowSaveConfirm(false);
    setUnsavedChanges(false);
    toast.success('Settings Saved', {
      description: 'All configuration changes have been applied successfully',
    });
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setUnsavedChanges(true);
    
    switch(section) {
      case 'email':
        setEmailSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'api':
        setApiKeys(prev => ({ ...prev, [field]: value }));
        break;
      case 'general':
        setGeneralSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'payment':
        setPaymentSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'notification':
        setNotificationSettings(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure platform settings and integrations</p>
        </div>
        <div className="flex gap-2">
          {unsavedChanges && (
            <Badge variant="destructive" className="animate-pulse">Unsaved Changes</Badge>
          )}
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={() => setShowSaveConfirm(true)}
            disabled={!unsavedChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="w-4 h-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="payment">
            <DollarSign className="w-4 h-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
              <CardDescription>Basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Site Name</label>
                  <Input
                    value={generalSettings.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Site URL</label>
                  <Input
                    value={generalSettings.siteUrl}
                    onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Support Email</label>
                <Input
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Max Upload Size (MB)</label>
                <Input
                  type="number"
                  value={generalSettings.maxUploadSize}
                  onChange={(e) => handleInputChange('general', 'maxUploadSize', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">Temporarily disable site access</p>
                </div>
                <Button
                  variant={generalSettings.maintenanceMode ? 'destructive' : 'outline'}
                  onClick={() => handleInputChange('general', 'maintenanceMode', !generalSettings.maintenanceMode)}
                >
                  {generalSettings.maintenanceMode ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">User Signup</h4>
                  <p className="text-sm text-gray-500">Allow new user registrations</p>
                </div>
                <Button
                  variant={generalSettings.signupEnabled ? 'default' : 'outline'}
                  onClick={() => handleInputChange('general', 'signupEnabled', !generalSettings.signupEnabled)}
                >
                  {generalSettings.signupEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email server settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Host</label>
                  <Input
                    value={emailSettings.smtpHost}
                    onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Port</label>
                  <Input
                    value={emailSettings.smtpPort}
                    onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Username</label>
                <Input
                  value={emailSettings.smtpUser}
                  onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">SMTP Password</label>
                <Input
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">From Name</label>
                  <Input
                    value={emailSettings.fromName}
                    onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">From Email</label>
                  <Input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                  />
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys & Integrations</CardTitle>
              <CardDescription>Manage third-party service credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Stripe Public Key</label>
                <div className="flex gap-2">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeys.stripePublic}
                    onChange={(e) => handleInputChange('api', 'stripePublic', e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Stripe Secret Key</label>
                <div className="flex gap-2">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeys.stripeSecret}
                    onChange={(e) => handleInputChange('api', 'stripeSecret', e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Google Maps API Key</label>
                <div className="flex gap-2">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeys.googleMaps}
                    onChange={(e) => handleInputChange('api', 'googleMaps', e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">SendGrid API Key</label>
                <div className="flex gap-2">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeys.sendgrid}
                    onChange={(e) => handleInputChange('api', 'sendgrid', e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Security Warning</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Never share your API keys publicly. Store them securely in environment variables.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>Configure pricing and payment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Application Fee ($)</label>
                <Input
                  type="number"
                  value={paymentSettings.applicationFee}
                  onChange={(e) => handleInputChange('payment', 'applicationFee', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Premium Monthly ($)</label>
                  <Input
                    type="number"
                    value={paymentSettings.premiumMonthly}
                    onChange={(e) => handleInputChange('payment', 'premiumMonthly', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Premium Yearly ($)</label>
                  <Input
                    type="number"
                    value={paymentSettings.premiumYearly}
                    onChange={(e) => handleInputChange('payment', 'premiumYearly', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Currency</label>
                  <Input
                    value={paymentSettings.currency}
                    onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tax Rate (%)</label>
                  <Input
                    type="number"
                    value={paymentSettings.taxRate}
                    onChange={(e) => handleInputChange('payment', 'taxRate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure system notification channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Send notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
                { key: 'smsNotifications', label: 'SMS Notifications', description: 'Text message alerts' },
                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Send weekly analytics reports' },
                { key: 'systemAlerts', label: 'System Alerts', description: 'Critical system notifications' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.label}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Button
                    variant={notificationSettings[item.key as keyof typeof notificationSettings] ? 'default' : 'outline'}
                    onClick={() => handleInputChange('notification', item.key, !notificationSettings[item.key as keyof typeof notificationSettings])}
                  >
                    {notificationSettings[item.key as keyof typeof notificationSettings] ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Confirmation Modal */}
      <ModalConfirm
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSaveSettings}
        title="Save Settings"
        description="Are you sure you want to save all settings? This will update the system configuration immediately."
        confirmText="Save Changes"
        cancelText="Cancel"
        variant="success"
      />
    </div>
  );
}

