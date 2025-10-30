'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Building2,
  Heart,
  Clock,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApplyButton } from '@/components/ApplyButton';
import Link from 'next/link';
import { useScholarshipsData, useSavedScholarshipsData } from '@/contexts/AppContext';
import { formatDate, getDaysUntilDeadline } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { ScholarshipCard } from '@/components/ScholarshipCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { LazyList } from '@/components/LazyList';
import { pageVariants, fadeInUpVariants } from '@/lib/animations';
import { ScholarshipFilters, type ScholarshipFilterState } from '@/components/ScholarshipFilters';

export default function ScholarshipsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [filters, setFilters] = useState<ScholarshipFilterState>({
    searchTerm: '',
    categories: [],
    amountRange: [0, 0],
    deadlineRange: 'all',
    locations: [],
    educationLevels: []
  });

  // Use API hooks
  const { scholarships, loading: scholarshipsLoading } = useScholarshipsData();
  const { isScholarshipSaved, toggle: toggleSaved } = useSavedScholarshipsData();

  // Filter and sort scholarships
  const filteredScholarships = React.useMemo(() => {
    let filtered = [...scholarships];

    // Advanced search filter (using ScholarshipFilters component)
    if (filters.searchTerm) {
      filtered = filtered.filter(scholarship => 
        scholarship.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        scholarship.providerName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        scholarship.field?.some((field: string) => field.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    // Categories filter (field of study)
    if (filters.categories.length > 0) {
      filtered = filtered.filter(scholarship => 
        scholarship.field?.some((field: string) => filters.categories.includes(field))
      );
    }

    // Amount range filter
    if (filters.amountRange[0] > 0 || filters.amountRange[1] > 0) {
      filtered = filtered.filter(scholarship => {
        const amount = scholarship.amount || scholarship.stipend || 0;
        const min = filters.amountRange[0];
        const max = filters.amountRange[1];
        
        if (min > 0 && max > 0) {
          return amount >= min && amount <= max;
        } else if (min > 0) {
          return amount >= min;
        } else if (max > 0) {
          return amount <= max;
        }
        return true;
      });
    }

    // Deadline range filter
    if (filters.deadlineRange !== 'all') {
      const now = new Date();
      let endDate = new Date();
      
      switch (filters.deadlineRange) {
        case 'week':
          endDate.setDate(now.getDate() + 7);
          break;
        case 'month':
          endDate.setMonth(now.getMonth() + 1);
          break;
        case 'quarter':
          endDate.setMonth(now.getMonth() + 3);
          break;
        case 'year':
          endDate.setFullYear(now.getFullYear() + 1);
          break;
      }
      
      filtered = filtered.filter(scholarship => {
        if (!scholarship.deadline) return false;
        const deadline = new Date(scholarship.deadline);
        return deadline >= now && deadline <= endDate;
      });
    }

    // Locations filter
    if (filters.locations.length > 0) {
      filtered = filtered.filter(scholarship => 
        filters.locations.includes(scholarship.country || '')
      );
    }

    // Education levels filter
    if (filters.educationLevels.length > 0) {
      filtered = filtered.filter(scholarship => 
        filters.educationLevels.includes(scholarship.level || '')
      );
    }

    // Old filter compatibility - Level filter (will be deprecated)
    if (levelFilter !== 'all') {
      filtered = filtered.filter(scholarship => scholarship.level === levelFilter);
    }

    // Old filter compatibility - Field filter (will be deprecated)
    if (fieldFilter !== 'all') {
      filtered = filtered.filter(scholarship => scholarship.field?.includes(fieldFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'provider':
          return (a.providerName || '').localeCompare(b.providerName || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [scholarships, filters, levelFilter, fieldFilter, sortBy]);

  // Get unique fields and levels for filters
  const uniqueFields = React.useMemo(() => 
    Array.from(new Set(scholarships.flatMap((s: any) => s.field || []))).sort(),
    [scholarships]
  );
  
  const uniqueLevels = React.useMemo(() => 
    Array.from(new Set(scholarships.map((s: any) => s.level).filter(Boolean))).sort(),
    [scholarships]
  );

  const uniqueLocations = React.useMemo(() => 
    Array.from(new Set(scholarships.map((s: any) => s.country).filter(Boolean))).sort(),
    [scholarships]
  );

  const handleToggleSaved = async (scholarshipId: string) => {
    try {
      await toggleSaved(scholarshipId);
      toast.success(isScholarshipSaved(scholarshipId) ? 'Scholarship unsaved!' : 'Scholarship saved!');
    } catch (error) {
      toast.error('Failed to update saved status');
    }
  };

  const getDeadlineBadgeVariant = (daysLeft: number) => {
    if (daysLeft < 0) return 'destructive';
    if (daysLeft <= 7) return 'destructive';
    if (daysLeft <= 30) return 'secondary';
    return 'default';
  };

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b"
        variants={fadeInUpVariants}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('scholarshipList.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('scholarshipList.hero.subtitle')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-blue-600">{scholarships.length}+</div>
              <div className="text-sm text-gray-600">{t('scholarshipList.stats.active')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$500M+</div>
              <div className="text-sm text-gray-600">{t('scholarshipList.stats.totalValue')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{uniqueFields.length}+</div>
              <div className="text-sm text-gray-600">{t('scholarshipList.stats.fields')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">95%</div>
              <div className="text-sm text-gray-600">{t('scholarshipList.stats.matchRate')}</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced Filters */}
        <ScholarshipFilters
          filters={filters}
          onFilterChange={setFilters}
          availableCategories={uniqueFields}
          availableLocations={uniqueLocations}
          availableEducationLevels={uniqueLevels}
          totalResults={filteredScholarships.length}
        />

        {/* Old Filters - Keep for backward compatibility during transition */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t('scholarshipList.search.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Level Filter */}
              <div>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
                >
                  <option value="all">{t('scholarshipList.filter.allLevels')}</option>
                  {uniqueLevels.map((level: string) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Field Filter */}
              <div>
                <select
                  value={fieldFilter}
                  onChange={(e) => setFieldFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
                >
                  <option value="all">{t('scholarshipList.filter.allFields')}</option>
                  {uniqueFields.map((field: string) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue-500 focus:border-brand-blue-500"
                >
                  <option value="deadline">{t('scholarshipList.sort.deadline')}</option>
                  <option value="title">{t('scholarshipList.sort.title')}</option>
                  <option value="provider">{t('scholarshipList.sort.provider')}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('scholarshipList.results.found').replace('{count}', filteredScholarships.length.toString())}
            </h2>
            <p className="text-gray-600 text-sm">
              {filters.searchTerm && t('scholarshipList.results.for').replace('{query}', filters.searchTerm)}
              {levelFilter !== 'all' && ` • ${t('scholarshipList.results.level').replace('{level}', levelFilter)}`}
              {fieldFilter !== 'all' && ` • ${t('scholarshipList.results.field').replace('{field}', fieldFilter)}`}
            </p>
          </div>
        </div>

        {/* Scholarships Grid */}
        {filteredScholarships.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('scholarshipList.noResults.title')}
              </h3>
              <p className="text-gray-600 text-center">
                {t('scholarshipList.noResults.subtitle')}
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setLevelFilter('all');
                  setFieldFilter('all');
                }}
                className="mt-4"
                variant="outline"
              >
                {t('scholarshipList.noResults.clearFilters')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <LazyList
            items={filteredScholarships}
            renderItem={(scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                showMatchScore={true}
                className="w-full"
              />
            )}
            itemsPerPage={12}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 grid-equal-height"
            loadingElement={
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">{t('scholarshipList.loadingMore')}</p>
              </div>
            }
          />
        )}
      </div>
    </motion.div>
  );
}
