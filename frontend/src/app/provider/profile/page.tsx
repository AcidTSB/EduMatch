'use client';

import { useState } from 'react';
import { Camera, MapPin, Globe, Mail, Phone, Building, Users, Award, Calendar, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ORGANIZATION_TYPES = [
  'University',
  'Government Agency',
  'Non-Profit Organization',
  'Private Foundation',
  'Corporate Foundation',
  'International Organization',
  'Research Institute',
  'Professional Association'
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Germany',
  'Canada',
  'Australia',
  'Singapore',
  'Netherlands',
  'Sweden',
  'Switzerland',
  'France',
  'Japan',
  'South Korea',
  'New Zealand',
  'Denmark',
  'Norway'
];

// Mock provider data
const mockProvider = {
  id: 'provider1',
  name: 'Global Education Foundation',
  type: 'Non-Profit Organization',
  description: 'We are a leading international organization dedicated to providing educational opportunities to talented students worldwide. Our mission is to break down barriers to education and create pathways for academic excellence.',
  country: 'United States',
  city: 'New York',
  address: '123 Education Avenue, New York, NY 10001',
  website: 'https://globaleducation.org',
  email: 'contact@globaleducation.org',
  phone: '+1-555-123-4567',
  founded: '2010',
  logo: '',
  cover: '',
  socialMedia: {
    linkedin: 'https://linkedin.com/company/global-education-foundation',
    twitter: 'https://twitter.com/globaleducation',
    facebook: 'https://facebook.com/globaleducationfoundation'
  },
  stats: {
    totalScholarships: 45,
    activeScholarships: 28,
    totalRecipients: 1250,
    totalFunding: '$12.5M'
  },
  achievements: [
    'Awarded over $12.5 million in scholarships',
    'Supported 1,250+ students globally',
    'Partner with 50+ universities worldwide',
    'Recognized by UNESCO for educational impact'
  ]
};

export default function ProviderProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(mockProvider);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Saving profile:', profileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(mockProvider);
    setIsEditing(false);
  };

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-brand-blue-500 to-brand-cyan-500">
        {isEditing && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4"
          >
            <Camera className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-16 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profileData.logo} />
                <AvatarFallback className="text-3xl bg-brand-blue-100 text-brand-blue-700">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground truncate">
                    {profileData.name}
                  </h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">{profileData.type}</Badge>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profileData.city}, {profileData.country}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4 sm:mt-0">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={loading}>
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-brand-blue-100 rounded-lg mr-4">
                <Award className="h-6 w-6 text-brand-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profileData.stats.totalScholarships}</p>
                <p className="text-xs text-muted-foreground">Total Scholarships</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profileData.stats.activeScholarships}</p>
                <p className="text-xs text-muted-foreground">Active Scholarships</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profileData.stats.totalRecipients}</p>
                <p className="text-xs text-muted-foreground">Students Supported</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profileData.stats.totalFunding}</p>
                <p className="text-xs text-muted-foreground">Total Funding</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <ProfileSection title="About Our Organization">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Organization Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Organization Type</Label>
                    <Select 
                      value={profileData.type} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORGANIZATION_TYPES.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={6}
                      value={profileData.description}
                      onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select 
                        value={profileData.country} 
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(country => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profileData.city}
                        onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      value={profileData.founded}
                      onChange={(e) => setProfileData(prev => ({ ...prev, founded: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {profileData.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Organization Type</h4>
                      <p className="text-sm text-muted-foreground">{profileData.type}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Founded</h4>
                      <p className="text-sm text-muted-foreground">{profileData.founded}</p>
                    </div>
                  </div>
                </div>
              )}
            </ProfileSection>
          </TabsContent>

          <TabsContent value="contact" className="space-y-8">
            <ProfileSection title="Contact Information">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Social Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={profileData.socialMedia.linkedin}
                          onChange={(e) => setProfileData(prev => ({ 
                            ...prev, 
                            socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                          }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          value={profileData.socialMedia.twitter}
                          onChange={(e) => setProfileData(prev => ({ 
                            ...prev, 
                            socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                          }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={profileData.socialMedia.facebook}
                          onChange={(e) => setProfileData(prev => ({ 
                            ...prev, 
                            socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                          }))}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Address</h4>
                        <p className="text-sm text-muted-foreground">{profileData.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Email</h4>
                        <a href={`mailto:${profileData.email}`} className="text-sm text-brand-blue-600 hover:underline">
                          {profileData.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Phone</h4>
                        <a href={`tel:${profileData.phone}`} className="text-sm text-brand-blue-600 hover:underline">
                          {profileData.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-muted-foreground mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Website</h4>
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue-600 hover:underline">
                          {profileData.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3">Social Media</h4>
                    <div className="flex space-x-4">
                      {profileData.socialMedia.linkedin && (
                        <a href={profileData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="text-brand-blue-600 hover:underline text-sm">
                          LinkedIn
                        </a>
                      )}
                      {profileData.socialMedia.twitter && (
                        <a href={profileData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-brand-blue-600 hover:underline text-sm">
                          Twitter
                        </a>
                      )}
                      {profileData.socialMedia.facebook && (
                        <a href={profileData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-brand-blue-600 hover:underline text-sm">
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </ProfileSection>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-8">
            <ProfileSection title="Our Achievements">
              <div className="space-y-4">
                {profileData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-brand-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-sm">{achievement}</p>
                  </div>
                ))}
              </div>
            </ProfileSection>

            <ProfileSection title="Impact Statistics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-brand-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-brand-blue-600 mb-2">
                    {profileData.stats.totalFunding}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Funding Provided</div>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {profileData.stats.totalRecipients}+
                  </div>
                  <div className="text-sm text-muted-foreground">Students Supported</div>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Partner Universities</div>
                </div>

                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">25+</div>
                  <div className="text-sm text-muted-foreground">Countries Reached</div>
                </div>
              </div>
            </ProfileSection>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}