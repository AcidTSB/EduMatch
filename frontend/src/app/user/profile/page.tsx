'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { 
  Edit3,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile from API
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from /api/user/me endpoint (backend UserController)
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
        const token = localStorage.getItem('auth_token');
        
        const response = await fetch(`${API_BASE_URL}/api/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        
        // Debug: Log avatar URL
        console.log('Fetched user data:', userData);
        console.log('Avatar URL:', userData.avatarUrl);
        
        // Map backend response to profile format - only essential fields
        setProfile({
          id: userData.id?.toString() || '',
          username: userData.username || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          sex: userData.sex || '',
          phone: userData.phone || '',
          dateOfBirth: userData.dateOfBirth || '',
          bio: userData.bio || '',
          avatarUrl: userData.avatarUrl || '',
          enabled: userData.enabled || false,
          status: userData.status || 'ACTIVE',
          subscriptionType: userData.subscriptionType || 'FREE',
          roles: userData.roles || [],
          createdAt: userData.createdAt || null,
          updatedAt: userData.updatedAt || null,
          organizationId: userData.organizationId || null,
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Không thể tải thông tin hồ sơ', {
          description: error instanceof Error ? error.message : 'Vui lòng thử lại sau'
        });
        // Fallback to empty profile
        setProfile({
          id: '',
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          sex: '',
          phone: '',
          dateOfBirth: '',
          bio: '',
          avatarUrl: '',
          enabled: false,
          status: 'ACTIVE',
          subscriptionType: 'FREE',
          roles: [],
          createdAt: null,
          updatedAt: null,
          organizationId: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string | string[] | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading('Đang cập nhật hồ sơ...');

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';
      const token = localStorage.getItem('auth_token');
      
      let finalAvatarUrl = profile.avatarUrl;
      
      // Nếu có file mới được chọn, upload lên server trước
      if (photoFile) {
        try {
          toast.loading('Đang tải ảnh lên...', { id: toastId });
          
          // Upload avatar file
          const formData = new FormData();
          formData.append('avatar', photoFile);
          
          const uploadResponse = await fetch(`${API_BASE_URL}/api/users/avatar`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              // Don't set Content-Type for FormData - browser will set it automatically
            },
            credentials: 'include',
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            finalAvatarUrl = uploadData.avatarUrl; // URL thực sự từ server
            
            // Cleanup blob URL
            if (profile.avatarUrl?.startsWith('blob:')) {
              URL.revokeObjectURL(profile.avatarUrl);
            }
            
            setPhotoFile(null); // Clear file sau khi upload
          } else {
            const errorData = await uploadResponse.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(errorData.message || 'Failed to upload avatar');
          }
        } catch (uploadError) {
          console.error('Avatar upload error:', uploadError);
          throw new Error(uploadError instanceof Error ? uploadError.message : 'Failed to upload avatar');
        }
      }
      
      // Prepare update data - chỉ gửi URL thực sự, không gửi blob URL
      const updateData: any = {
        firstName: profile.firstName || undefined,
        lastName: profile.lastName || undefined,
        sex: profile.sex || undefined,
        phone: profile.phone || undefined,
        dateOfBirth: profile.dateOfBirth || undefined,
        bio: profile.bio || undefined,
      };
      
      // Chỉ thêm avatarUrl nếu không phải blob URL
      if (finalAvatarUrl && !finalAvatarUrl.startsWith('blob:')) {
        updateData.avatarUrl = finalAvatarUrl;
      }
      
      toast.loading('Đang cập nhật hồ sơ...', { id: toastId });
      
      // Update profile via PUT /api/user/me
      const response = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update profile' }));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update profile`);
      }
      
      // Get updated user data from response
      const updatedData = await response.json();
      
      // Update profile state with backend response
      setProfile(prev => ({
        ...prev,
        id: updatedData.id?.toString() || prev.id,
        username: updatedData.username || prev.username,
        firstName: updatedData.firstName || prev.firstName,
        lastName: updatedData.lastName || prev.lastName,
        email: updatedData.email || prev.email,
        sex: updatedData.sex || prev.sex,
        phone: updatedData.phone || prev.phone,
        dateOfBirth: updatedData.dateOfBirth || prev.dateOfBirth,
        bio: updatedData.bio || prev.bio,
        avatarUrl: updatedData.avatarUrl || prev.avatarUrl,
        enabled: updatedData.enabled !== undefined ? updatedData.enabled : prev.enabled,
        status: updatedData.status || prev.status,
        subscriptionType: updatedData.subscriptionType || prev.subscriptionType,
        roles: updatedData.roles || prev.roles,
        createdAt: updatedData.createdAt || prev.createdAt,
        updatedAt: updatedData.updatedAt || prev.updatedAt,
        organizationId: updatedData.organizationId || prev.organizationId,
      }));
      
      toast.success('Cập nhật hồ sơ thành công!', {
        id: toastId,
        description: 'Thông tin của bạn đã được lưu'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Cập nhật hồ sơ thất bại', {
        id: toastId,
        description: error instanceof Error ? error.message : t('applicantProfile.errorMessage')
      });
      setErrors({ submit: error instanceof Error ? error.message : t('applicantProfile.errorMessage') });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ảnh quá lớn', {
          description: 'Vui lòng chọn ảnh có kích thước nhỏ hơn 5MB'
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('File không hợp lệ', {
          description: 'Vui lòng chọn file ảnh'
        });
        return;
      }
      
      setPhotoFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfile(prev => ({
        ...prev,
        avatarUrl: previewUrl
      }));
      
      toast.success('Đã chọn ảnh mới', {
        description: 'Nhớ lưu hồ sơ để cập nhật ảnh đại diện'
      });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('applicantProfile.loadingProfile')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{t('applicantProfile.title')}</h1>
              <p className="text-gray-600 mt-2">
                {t('applicantProfile.subtitle')}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? 'outline' : 'default'}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? t('applicantProfile.cancel') : t('applicantProfile.editProfile')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('applicantProfile.basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={profile.avatarUrl || ''} 
                    alt={`${profile.firstName || ''} ${profile.lastName || ''}`}
                    useNextImage={false}
                  />
                  <AvatarFallback className="text-lg">
                    {(profile.firstName?.[0] || '')}{(profile.lastName?.[0] || '') || (profile.username?.[0]?.toUpperCase() || 'U')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div>
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Camera className="h-4 w-4 mr-2" />
                          {t('applicantProfile.changePhoto')}
                        </span>
                      </Button>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.firstName')}
                  </label>
                  <Input
                    value={profile.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.firstName')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.lastName')}
                  </label>
                  <Input
                    value={profile.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.lastName')}
                  />
                </div>
              </div>

              {/* Username and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <Input
                    value={profile.username || ''}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.email')}
                  </label>
                  <Input
                    type="email"
                    value={profile.email || ''}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('applicantProfile.emailNote')}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.phone')}
                  </label>
                  <Input
                    value={profile.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.phone')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={profile.sex || ''}
                    onChange={(e) => handleInputChange('sex', e.target.value)}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select...</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Account Status Info (from backend) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">
                    Account Status
                  </label>
                  <Badge variant={profile.enabled ? "default" : "secondary"}>
                    {profile.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">
                    Status
                  </label>
                  <Badge variant="outline">
                    {profile.status || 'ACTIVE'}
                  </Badge>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">
                    Subscription
                  </label>
                  <Badge variant="outline">
                    {profile.subscriptionType || 'FREE'}
                  </Badge>
                </div>
              </div>

              {/* Roles (from backend) */}
              {profile.roles && profile.roles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.roles.map((role: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {role.replace('ROLE_', '')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicantProfile.dateOfBirth')}
                </label>
                <Input
                  type="date"
                  value={profile.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicantProfile.bio')}
                </label>
                <Textarea
                  value={profile.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder={t('applicantProfile.bioPlaceholder')}
                />
              </div>

              {/* Timestamps (from backend) */}
              {(profile.createdAt || profile.updatedAt) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500 pt-2 border-t">
                  {profile.createdAt && (
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {typeof profile.createdAt === 'string' 
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : profile.createdAt instanceof Date
                        ? profile.createdAt.toLocaleDateString()
                        : 'N/A'}
                    </div>
                  )}
                  {profile.updatedAt && (
                    <div>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {typeof profile.updatedAt === 'string'
                        ? new Date(profile.updatedAt).toLocaleDateString()
                        : profile.updatedAt instanceof Date
                        ? profile.updatedAt.toLocaleDateString()
                        : 'N/A'}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                {t('applicantProfile.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? t('applicantProfile.saving') : t('applicantProfile.saveChanges')}
              </Button>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

