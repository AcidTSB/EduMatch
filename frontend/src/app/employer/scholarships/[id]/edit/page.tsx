'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Upload,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Globe,
  Target,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { toast } from 'sonner';

// Mock data for the scholarship
const mockScholarship = {
  id: '1',
  title: 'Full-Stack Development Research Grant',
  description: 'Looking for talented students to join our research team focusing on modern web technologies and distributed systems.',
  longDescription: `This research grant provides funding for exceptional students to contribute to cutting-edge research in full-stack development. 
  
  The selected candidates will work alongside our experienced research team on projects involving:
  - Modern web frameworks and technologies
  - Distributed systems architecture
  - Performance optimization
  - Security in web applications
  
  This is an excellent opportunity for students passionate about web development to gain hands-on research experience while contributing to meaningful projects that impact the broader developer community.`,
  requirements: [
    'Enrolled in Computer Science, Software Engineering, or related field',
    'Strong background in JavaScript, TypeScript, and modern web frameworks',
    'Experience with Node.js and database systems',
    'GPA of 3.5 or higher',
    'Demonstrated interest in web development research'
  ],
  benefits: [
    'Monthly stipend of $4,000',
    'Access to cutting-edge development tools and resources',
    'Mentorship from industry experts',
    'Opportunity to publish research findings',
    'Networking opportunities with tech professionals'
  ],
  eligibility: {
    minGPA: 3.5,
    academicLevel: ['undergraduate', 'masters', 'phd'],
    majors: ['Computer Science', 'Software Engineering', 'Information Technology'],
    citizenship: 'any'
  },
  application: {
    deadline: '2024-12-31',
    documentsRequired: ['cv', 'transcript', 'personal_statement', 'portfolio'],
    interviews: true,
    additionalQuestions: [
      'Describe your experience with full-stack development',
      'What interests you most about web development research?',
      'How do you stay updated with the latest web technologies?'
    ]
  },
  funding: {
    amount: 50000,
    duration: '12 months',
    renewable: true,
    currency: 'USD'
  },
  status: 'published',
  category: 'research',
  tags: ['web-development', 'full-stack', 'research', 'technology'],
  contactEmail: 'research@university.edu',
  organization: 'University Research Center',
  location: 'Remote/On-site Hybrid',
  applicationCount: 45,
  createdAt: '2024-09-01',
  updatedAt: '2024-09-15'
};

export default function EditScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  
  const [scholarship, setScholarship] = useState(mockScholarship);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state
  const [formData, setFormData] = useState({
    title: scholarship.title,
    description: scholarship.description,
    longDescription: scholarship.longDescription,
    requirements: scholarship.requirements,
    benefits: scholarship.benefits,
    deadline: scholarship.application.deadline,
    amount: scholarship.funding.amount,
    duration: scholarship.funding.duration,
    category: scholarship.category,
    tags: scholarship.tags,
    status: scholarship.status,
    contactEmail: scholarship.contactEmail,
    organization: scholarship.organization,
    location: scholarship.location,
    minGPA: scholarship.eligibility.minGPA,
    academicLevel: scholarship.eligibility.academicLevel,
    majors: scholarship.eligibility.majors,
    citizenship: scholarship.eligibility.citizenship,
    documentsRequired: scholarship.application.documentsRequired,
    interviews: scholarship.application.interviews,
    additionalQuestions: scholarship.application.additionalQuestions,
    renewable: scholarship.funding.renewable
  });

  useEffect(() => {
    // Mark as dirty when form data changes
    const hasChanges = JSON.stringify(formData) !== JSON.stringify({
      title: scholarship.title,
      description: scholarship.description,
      longDescription: scholarship.longDescription,
      requirements: scholarship.requirements,
      benefits: scholarship.benefits,
      deadline: scholarship.application.deadline,
      amount: scholarship.funding.amount,
      duration: scholarship.funding.duration,
      category: scholarship.category,
      tags: scholarship.tags,
      status: scholarship.status,
      contactEmail: scholarship.contactEmail,
      organization: scholarship.organization,
      location: scholarship.location,
      minGPA: scholarship.eligibility.minGPA,
      academicLevel: scholarship.eligibility.academicLevel,
      majors: scholarship.eligibility.majors,
      citizenship: scholarship.eligibility.citizenship,
      documentsRequired: scholarship.application.documentsRequired,
      interviews: scholarship.application.interviews,
      additionalQuestions: scholarship.application.additionalQuestions,
      renewable: scholarship.funding.renewable
    });
    setIsDirty(hasChanges);
  }, [formData, scholarship]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update scholarship with form data
      setScholarship(prev => ({
        ...prev,
        ...formData,
        updatedAt: new Date().toISOString().split('T')[0]
      }));
      
      setIsDirty(false);
      toast.success('Scholarship updated successfully!');
    } catch (error) {
      toast.error('Failed to update scholarship. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = () => {
    const newStatus = formData.status === 'published' ? 'draft' : 'published';
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      additionalQuestions: [...prev.additionalQuestions, '']
    }));
  };

  const updateQuestion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalQuestions: prev.additionalQuestions.map((q, i) => i === index ? value : q)
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalQuestions: prev.additionalQuestions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/employer/scholarships">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Scholarships
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Scholarship</h1>
                <p className="text-gray-600">
                  {formData.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Label htmlFor="publish-toggle">Published</Label>
                <Switch
                  id="publish-toggle"
                  checked={formData.status === 'published'}
                  onCheckedChange={handlePublishToggle}
                />
              </div>
              
              <Button variant="outline" asChild>
                <Link href={`/employer/scholarships/${scholarshipId}/applications`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Applications ({scholarship.applicationCount})
                </Link>
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="bg-brand-blue-600 hover:bg-brand-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Scholarship Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter scholarship title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder="Organization name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the scholarship"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Detailed Description</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                    placeholder="Detailed description of the scholarship program"
                    className="min-h-[200px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="academic">Academic Excellence</SelectItem>
                        <SelectItem value="need-based">Need-based</SelectItem>
                        <SelectItem value="merit">Merit-based</SelectItem>
                        <SelectItem value="diversity">Diversity & Inclusion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Location/Remote"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="contact@organization.edu"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Funding Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                      placeholder="50000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="12 months"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="renewable"
                    checked={formData.renewable}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, renewable: checked }))}
                  />
                  <Label htmlFor="renewable">Renewable funding</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="Enter requirement"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addRequirement}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder="Enter benefit"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addBenefit}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eligibility Tab */}
          <TabsContent value="eligibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Eligibility Criteria</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minGPA">Minimum GPA</Label>
                    <Input
                      id="minGPA"
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      value={formData.minGPA}
                      onChange={(e) => setFormData(prev => ({ ...prev, minGPA: parseFloat(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citizenship">Citizenship Requirements</Label>
                    <Select
                      value={formData.citizenship}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, citizenship: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any citizenship</SelectItem>
                        <SelectItem value="us">US Citizens only</SelectItem>
                        <SelectItem value="international">International students</SelectItem>
                        <SelectItem value="permanent">US Citizens & Permanent Residents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Academic Level</Label>
                  <div className="flex flex-wrap gap-2">
                    {['undergraduate', 'masters', 'phd'].map((level) => (
                      <Badge
                        key={level}
                        variant={formData.academicLevel.includes(level) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            academicLevel: prev.academicLevel.includes(level)
                              ? prev.academicLevel.filter(l => l !== level)
                              : [...prev.academicLevel, level]
                          }));
                        }}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Eligible Majors</Label>
                  <Textarea
                    value={formData.majors.join('\n')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      majors: e.target.value.split('\n').filter(m => m.trim())
                    }))}
                    placeholder="Enter each major on a new line"
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Application Tab */}
          <TabsContent value="application" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Application Process</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <div className="flex flex-wrap gap-2">
                    {['cv', 'transcript', 'personal_statement', 'portfolio', 'letters_of_recommendation'].map((doc) => (
                      <Badge
                        key={doc}
                        variant={formData.documentsRequired.includes(doc) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            documentsRequired: prev.documentsRequired.includes(doc)
                              ? prev.documentsRequired.filter(d => d !== doc)
                              : [...prev.documentsRequired, doc]
                          }));
                        }}
                      >
                        {doc.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="interviews"
                    checked={formData.interviews}
                    onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, interviews: checked }))}
                  />
                  <Label htmlFor="interviews">Require interviews</Label>
                </div>

                <div className="space-y-4">
                  <Label>Additional Application Questions</Label>
                  {formData.additionalQuestions.map((question, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Textarea
                        value={question}
                        onChange={(e) => updateQuestion(index, e.target.value)}
                        placeholder="Enter additional question"
                        className="flex-1 min-h-[60px]"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Unsaved Changes Warning */}
        {isDirty && (
          <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-yellow-800">You have unsaved changes</span>
              <Button size="sm" onClick={handleSave}>
                Save Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}