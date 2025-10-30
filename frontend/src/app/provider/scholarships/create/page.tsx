'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'react-hot-toast';

const STUDY_FIELDS = [
  'Computer Science',
  'Engineering',
  'Business Administration',
  'Medicine',
  'Law',
  'Education',
  'Arts & Humanities',
  'Social Sciences',
  'Natural Sciences',
  'Mathematics',
  'Psychology',
  'Economics',
  'Architecture',
  'Design',
  'Environmental Studies'
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

const EDUCATION_LEVELS = [
  'High School',
  'Undergraduate',
  'Graduate',
  'Masters',
  'PhD',
  'Postdoctoral'
];

export default function CreateScholarshipPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: '',
    field: [] as string[],
    level: 'Undergraduate',
    deadline: '',
    studyMode: 'Full-time' as 'Full-time' | 'Part-time' | 'Remote',
    stipend: '',
    requirements: [''],
    benefits: [''],
    applicationProcess: '',
    contactEmail: '',
    website: '',
    isPublished: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would make an API call here
      console.log('Creating scholarship:', formData);
      
      toast.success(t('createScholarship.success'));
      router.push('/provider/scholarships');
    } catch (error) {
      toast.error(t('createScholarship.error'));
      console.error('Error creating scholarship:', error);
    } finally {
      setLoading(false);
    }
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

  const addField = (field: string) => {
    if (!formData.field.includes(field)) {
      setFormData(prev => ({
        ...prev,
        field: [...prev.field, field]
      }));
    }
  };

  const removeField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      field: prev.field.filter(f => f !== field)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/provider/scholarships')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('createScholarship.backButton')}
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{t('createScholarship.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('createScholarship.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createScholarship.basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">{t('createScholarship.scholarshipTitle')} *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t('createScholarship.titlePlaceholder')}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">{t('createScholarship.description')} *</Label>
                <Textarea
                  id="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('createScholarship.descriptionPlaceholder')}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="country">{t('createScholarship.country')} *</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={t('createScholarship.selectCountry')} />
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
                  <Label htmlFor="level">{t('createScholarship.educationLevel')} *</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={t('createScholarship.selectLevel')} />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>{t('createScholarship.fieldsOfStudy')}</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.field.map((field, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {field}
                        <button
                          type="button"
                          onClick={() => removeField(field)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={addField}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('createScholarship.addField')} />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDY_FIELDS.filter(field => !formData.field.includes(field)).map(field => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="studyMode">{t('createScholarship.studyMode')} *</Label>
                  <Select value={formData.studyMode} onValueChange={(value: 'Full-time' | 'Part-time' | 'Remote') => setFormData(prev => ({ ...prev, studyMode: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={t('createScholarship.selectStudyMode')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">{t('createScholarship.fullTime')}</SelectItem>
                      <SelectItem value="Part-time">{t('createScholarship.partTime')}</SelectItem>
                      <SelectItem value="Remote">{t('createScholarship.remote')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deadline">{t('createScholarship.deadline')} *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stipend">{t('createScholarship.stipend')}</Label>
                <Input
                  id="stipend"
                  value={formData.stipend}
                  onChange={(e) => setFormData(prev => ({ ...prev, stipend: e.target.value }))}
                  placeholder={t('createScholarship.stipendPlaceholder')}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createScholarship.requirements')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    required
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={t('createScholarship.requirementPlaceholder')}
                    className="flex-1"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addRequirement}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('createScholarship.addRequirement')}
              </Button>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createScholarship.benefits')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    required
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder={t('createScholarship.benefitPlaceholder')}
                    className="flex-1"
                  />
                  {formData.benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addBenefit}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('createScholarship.addBenefit')}
              </Button>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createScholarship.additionalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="applicationProcess">{t('createScholarship.applicationProcess')}</Label>
                <Textarea
                  id="applicationProcess"
                  rows={4}
                  value={formData.applicationProcess}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicationProcess: e.target.value }))}
                  placeholder={t('createScholarship.processPlaceholder')}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactEmail">{t('createScholarship.contactEmail')}</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder={t('createScholarship.emailPlaceholder')}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="website">{t('createScholarship.website')}</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder={t('createScholarship.websitePlaceholder')}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>{t('createScholarship.publishingOptions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked as boolean }))}
                />
                <Label htmlFor="isPublished">
                  {t('createScholarship.publishImmediately')}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/provider/scholarships')}
              className="flex-1"
            >
              {t('createScholarship.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? t('createScholarship.creating') : formData.isPublished ? t('createScholarship.createAndPublish') : t('createScholarship.saveAsDraft')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}