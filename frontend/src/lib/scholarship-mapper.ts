/**
 * Utility functions to map backend DTOs to frontend types
 */

import { Scholarship } from '@/types';

/**
 * Map backend OpportunityDto to frontend Scholarship type
 */
export function mapOpportunityDtoToScholarship(opportunity: any): Scholarship {
  return {
    id: opportunity.id?.toString() || '',
    providerId: opportunity.organizationId?.toString() || opportunity.creatorUserId?.toString() || '',
    providerName: opportunity.organizationName || 'Unknown Provider',
    title: opportunity.title || '',
    description: opportunity.description || opportunity.fullDescription || opportunity.title || '',
    amount: opportunity.scholarshipAmount ? Number(opportunity.scholarshipAmount) : 0,
    scholarshipAmount: opportunity.scholarshipAmount ? Number(opportunity.scholarshipAmount) : undefined,
    type: opportunity.level || 'UNDERGRADUATE',
    level: opportunity.level || 'UNDERGRADUATE',
    status: opportunity.moderationStatus === 'APPROVED' ? 'PUBLISHED' : 
            opportunity.moderationStatus === 'PENDING' ? 'PENDING' : 
            opportunity.moderationStatus === 'REJECTED' ? 'REJECTED' : 'PUBLISHED',
    moderationStatus: opportunity.moderationStatus || 'PENDING',
    applicationDeadline: opportunity.applicationDeadline || '',
    startDate: opportunity.startDate || undefined,
    endDate: opportunity.endDate || undefined,
    location: opportunity.location || '',
    university: opportunity.university || opportunity.organizationName || '',
    department: opportunity.department || '',
    duration: 0, // Will be calculated from startDate and endDate if available
    isRemote: opportunity.studyMode === 'ONLINE' || opportunity.studyMode === 'HYBRID',
    studyMode: opportunity.studyMode || 'FULL_TIME',
    minGpa: opportunity.minGpa ? Number(opportunity.minGpa) : 0,
    requirements: {
      minGpa: opportunity.minGpa ? Number(opportunity.minGpa) : undefined,
      englishProficiency: undefined,
      documents: []
    },
    requiredSkills: opportunity.requiredSkills || [],
    preferredSkills: [],
    viewCount: opportunity.viewsCnt || 0,
    createdAt: new Date(),
    tags: opportunity.tags || [],
    website: opportunity.website || undefined,
    contactEmail: opportunity.contactEmail || undefined,
    isPublic: opportunity.isPublic !== undefined ? opportunity.isPublic : true,
    matchScore: opportunity.matchScore ? Number(opportunity.matchScore) : undefined,
    currency: 'USD'
  };
}

/**
 * Map paginated response from backend
 */
export function mapPaginatedOpportunities(response: any): {
  scholarships: Scholarship[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
} {
  const content = response.content || response.data || [];
  const scholarships = Array.isArray(content) 
    ? content.map(mapOpportunityDtoToScholarship)
    : [];

  return {
    scholarships,
    totalElements: response.totalElements || scholarships.length,
    totalPages: response.totalPages || 1,
    currentPage: response.number !== undefined ? response.number + 1 : response.page || 1,
    size: response.size || response.limit || 20
  };
}

/**
 * Map OpportunityDetailDto to Scholarship with matchScore
 */
export function mapOpportunityDetailToScholarship(detail: any): {
  scholarship: Scholarship;
  matchScore?: number;
} {
  const opportunity = detail.opportunity || detail;
  const scholarship = mapOpportunityDtoToScholarship(opportunity);
  
  return {
    scholarship,
    matchScore: detail.matchScore ? Number(detail.matchScore) : undefined
  };
}

