'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function ScholarshipsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  // Use API hooks
  const { scholarships, loading: scholarshipsLoading } = useScholarshipsData();
  const { isScholarshipSaved, toggle: toggleSaved } = useSavedScholarshipsData();

  // Filter and sort scholarships
  const filteredScholarships = React.useMemo(() => {
    let filtered = [...scholarships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(scholarship => 
        scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.field?.some((field: string) => field.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(scholarship => scholarship.level === levelFilter);
    }

    // Field filter
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
  }, [scholarships, searchTerm, levelFilter, fieldFilter, sortBy]);

  // Get unique fields and levels for filters
  const uniqueFields = React.useMemo(() => 
    Array.from(new Set(scholarships.flatMap((s: any) => s.field || []))).sort(),
    [scholarships]
  );
  
  const uniqueLevels = React.useMemo(() => 
    Array.from(new Set(scholarships.map((s: any) => s.level).filter(Boolean))).sort(),
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Scholarship
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover scholarships tailored to your academic profile and career goals. 
              Over 2,000+ opportunities from leading institutions worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-blue-600">{scholarships.length}+</div>
              <div className="text-sm text-gray-600">Active Scholarships</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$500M+</div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{uniqueFields.length}+</div>
              <div className="text-sm text-gray-600">Study Fields</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">95%</div>
              <div className="text-sm text-gray-600">Match Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search scholarships, universities, fields..."
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
                  <option value="all">All Levels</option>
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
                  <option value="all">All Fields</option>
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
                  <option value="deadline">Sort by Deadline</option>
                  <option value="title">Sort by Title</option>
                  <option value="provider">Sort by Provider</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredScholarships.length} Scholarships Found
            </h2>
            <p className="text-gray-600 text-sm">
              {searchTerm && `Results for "${searchTerm}"`}
              {levelFilter !== 'all' && ` • ${levelFilter} level`}
              {fieldFilter !== 'all' && ` • ${fieldFilter} field`}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Scholarships Grid */}
        {filteredScholarships.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No scholarships found
              </h3>
              <p className="text-gray-600 text-center">
                Try adjusting your search terms or filters to find more results.
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
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 grid-equal-height">
            {filteredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                showMatchScore={true}
                className="w-full"
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredScholarships.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Scholarships
            </Button>
            <p className="text-gray-600 text-sm mt-2">
              Showing {filteredScholarships.length} of {scholarships.length} scholarships
            </p>
          </div>
        )}
      </div>
    </div>
  );
}