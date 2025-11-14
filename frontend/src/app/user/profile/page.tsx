'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Book,
  Award,
  Upload,
  Save,
  Edit3,
  GraduationCap,
  Briefcase,
  Globe,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

// Mock user profiles
const mockUserProfiles = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'student@demo.com',
    phone: '+1 234 567 8900',
    dateOfBirth: '1995-06-15',
    nationality: 'American',
    currentLocation: 'New York, USA',
    bio: 'Passionate computer science student with a focus on artificial intelligence and machine learning. I enjoy working on innovative projects that can make a positive impact on society.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    university: 'MIT',
    major: 'Computer Science',
    gpa: 3.8,
    graduationYear: 2024,
    currentLevel: 'Senior',
    skills: ['Python', 'JavaScript', 'React', 'Machine Learning', 'Data Analysis', 'SQL'],
    interests: ['AI Research', 'Web Development', 'Data Science', 'Robotics'],
    languages: ['English (Native)', 'Spanish (Intermediate)', 'French (Basic)'],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'MIT',
        startYear: 2020,
        endYear: 2024,
        gpa: 3.8
      },
      {
        degree: 'High School Diploma',
        institution: 'Lincoln High School',
        startYear: 2016,
        endYear: 2020,
        gpa: 4.0
      }
    ],
    experience: [
      {
        title: 'Software Engineering Intern',
        company: 'Google',
        startDate: 'June 2023',
        endDate: 'August 2023',
        description: 'Developed machine learning models for improving search algorithms'
      },
      {
        title: 'Research Assistant',
        company: 'MIT AI Lab',
        startDate: 'September 2022',
        endDate: 'Present',
        description: 'Conducting research on natural language processing and deep learning'
      }
    ],
    achievements: [
      'Dean\'s List (2021-2023)',
      'First Place - MIT Hackathon 2023',
      'Google Summer of Code Participant 2022',
      'President - Computer Science Student Association'
    ]
  }
];

export default function ProfilePage() {
  const { t } = useLanguage();
  // Mock current user - replace with actual auth
  const [profile, setProfile] = useState(mockUserProfiles[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Profile updated:', profile);
      
      toast.success('Cập nhật hồ sơ thành công!', {
        id: toastId,
        description: 'Thông tin của bạn đã được lưu'
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Cập nhật hồ sơ thất bại', {
        id: toastId,
        description: t('applicantProfile.errorMessage')
      });
      setErrors({ submit: t('applicantProfile.errorMessage') });
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
        avatar: previewUrl
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
                  <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                  <AvatarFallback className="text-lg">
                    {profile.firstName[0]}{profile.lastName[0]}
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
                    value={profile.firstName}
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
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.lastName')}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.email')}
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('applicantProfile.emailNote')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.phone')}
                  </label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.phone')}
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.dateOfBirth')}
                  </label>
                  <Input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.nationality')}
                  </label>
                  <Input
                    value={profile.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.nationality')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.currentLocation')}
                  </label>
                  <Input
                    value={profile.currentLocation}
                    onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.currentLocation')}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicantProfile.bio')}
                </label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder={t('applicantProfile.bioPlaceholder')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('applicantProfile.academicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.university')}
                  </label>
                  <Input
                    value={profile.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.university')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.major')}
                  </label>
                  <Input
                    value={profile.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.major')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.gpa')}
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={profile.gpa}
                    onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value))}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.gpa')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.graduationYear')}
                  </label>
                  <Input
                    type="number"
                    value={profile.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.graduationYear')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('applicantProfile.currentLevel')}
                  </label>
                  <Input
                    value={profile.currentLevel}
                    onChange={(e) => handleInputChange('currentLevel', e.target.value)}
                    disabled={!isEditing}
                    placeholder={t('applicantProfile.currentLevel')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Interests */}
          <Card>
            <CardHeader>
              <CardTitle>{t('applicantProfile.skillsInterests')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicantProfile.skills')}
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Input
                    placeholder={t('applicantProfile.skillsPlaceholder')}
                    value={profile.skills.join(', ')}
                    onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()))}
                  />
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicantProfile.interests')}
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Input
                    placeholder={t('applicantProfile.interestsPlaceholder')}
                    value={profile.interests.join(', ')}
                    onChange={(e) => handleInputChange('interests', e.target.value.split(',').map(s => s.trim()))}
                  />
                )}
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicantProfile.languages')}
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.languages.map((language, index) => (
                    <Badge key={index} variant="secondary">
                      {language}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Input
                    placeholder={t('applicantProfile.languagesPlaceholder')}
                    value={profile.languages.join(', ')}
                    onChange={(e) => handleInputChange('languages', e.target.value.split(',').map(s => s.trim()))}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>{t('applicantProfile.achievements')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
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

