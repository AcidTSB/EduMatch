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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Profile updated:', profile);
      setIsEditing(false);
      
      // Show success message (you could add a toast notification here)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfile(prev => ({
        ...prev,
        avatar: previewUrl
      }));
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">
                Manage your personal information and academic details
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? 'outline' : 'default'}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
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
              <CardTitle>Basic Information</CardTitle>
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
                          Change Photo
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
                    First Name
                  </label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
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
                    Nationality
                  </label>
                  <Input
                    value={profile.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your nationality"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Location
                  </label>
                  <Input
                    value={profile.currentLocation}
                    onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your current location"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University
                  </label>
                  <Input
                    value={profile.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your university"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Major
                  </label>
                  <Input
                    value={profile.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your major"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={profile.gpa}
                    onChange={(e) => handleInputChange('gpa', parseFloat(e.target.value))}
                    disabled={!isEditing}
                    placeholder="Enter your GPA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  <Input
                    type="number"
                    value={profile.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', parseInt(e.target.value))}
                    disabled={!isEditing}
                    placeholder="Enter graduation year"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Level
                  </label>
                  <Input
                    value={profile.currentLevel}
                    onChange={(e) => handleInputChange('currentLevel', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Senior, Graduate"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Interests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
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
                    placeholder="Add skills separated by commas"
                    value={profile.skills.join(', ')}
                    onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()))}
                  />
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
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
                    placeholder="Add interests separated by commas"
                    value={profile.interests.join(', ')}
                    onChange={(e) => handleInputChange('interests', e.target.value.split(',').map(s => s.trim()))}
                  />
                )}
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
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
                    placeholder="Add languages with proficiency separated by commas"
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
              <CardTitle>Achievements</CardTitle>
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
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
