import { useState, useEffect, useCallback } from 'react';
import { mockApi } from '@/lib/mock-data';

// Real API hooks using mockApi

export function useApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Get current user from mockApi or localStorage
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const currentUserId = userId || userData?.id || '1';
      
      const response = await mockApi.applications.getByUser(currentUserId);
      if (response.success) {
        setApplications(response.data || []);
      }
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitApplication = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      // Import scholarship service
      const { scholarshipServiceApi } = await import('@/services/scholarship.service');
      
      // Convert scholarshipId to opportunityId (BE uses opportunityId)
      const opportunityId = parseInt(data.scholarshipId || data.opportunityId);
      
      // Handle file upload - create document entry
      const documents: Array<{ documentName: string; documentUrl: string }> = [];
      if (data.cvFile) {
        // TODO: Implement actual file upload to storage service
        // For now, create a placeholder URL
        // In production, upload file to S3/MinIO and get URL
        const fileUrl = data.cvFileUrl || `placeholder://cv/${data.cvFile}`;
        documents.push({
          documentName: data.cvFile,
          documentUrl: fileUrl
        });
      }
      
      // Prepare request matching BE DTO
      const request = {
        opportunityId,
        documents: documents.length > 0 ? documents : undefined,
        applicantUserName: data.applicantUserName,
        applicantEmail: data.applicantEmail,
        phone: data.phone,
        gpa: data.gpa,
        coverLetter: data.coverLetter,
        motivation: data.motivation,
        additionalInfo: data.additionalInfo,
        portfolioUrl: data.portfolioUrl,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
      };
      
      const response = await scholarshipServiceApi.createApplication(request);
      
      // Refresh applications list
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const applicantId = userData?.id || '1';
      await fetchApplications(applicantId);
      
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications]);

  const withdrawApplication = useCallback(async (id: string) => {
    // Withdraw functionality to be implemented when backend is ready
    return true;
  }, []);

  const checkApplicationStatus = useCallback(async (scholarshipId: string) => {
    try {
      // Get my applications and check if any match this scholarship
      const { scholarshipServiceApi } = await import('@/services/scholarship.service');
      const applications = await scholarshipServiceApi.getMyApplications();
      
      const matchingApp = applications.find(
        (app: any) => app.opportunityId?.toString() === scholarshipId.toString() || 
                     app.scholarshipId?.toString() === scholarshipId.toString()
      );
      
      return matchingApp ? { hasApplied: true, application: matchingApp } : { hasApplied: false };
    } catch (err) {
      console.error('Error checking application status:', err);
      return { hasApplied: false };
    }
  }, []);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    submitApplication,
    withdrawApplication,
    checkApplicationStatus,
  };
}

export function useScholarships() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScholarships = useCallback(async (params?: any) => {
    setLoading(false);
    setScholarships([]);
  }, []);

  const fetchScholarshipById = useCallback(async (id: string) => {
    return { id, title: 'Mock Scholarship' };
  }, []);

  return {
    scholarships,
    loading,
    error,
    fetchScholarships,
    fetchScholarshipById,
  };
}

export function useSavedScholarships() {
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedScholarships = useCallback(async () => {
    setLoading(true);
    try {
      const { scholarshipServiceApi } = await import('@/services/scholarship.service');
      const bookmarks = await scholarshipServiceApi.getMyBookmarks();
      
      // Extract opportunity IDs from bookmarks
      const opportunityIds = bookmarks.map((bookmark: any) => 
        bookmark.opportunity?.id?.toString() || bookmark.opportunityId?.toString()
      ).filter(Boolean);
      
      setSavedScholarships(opportunityIds);
    } catch (err) {
      setError('Failed to fetch saved scholarships');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveScholarship = useCallback(async (scholarshipId: string) => {
    try {
      const { scholarshipServiceApi } = await import('@/services/scholarship.service');
      const response = await scholarshipServiceApi.toggleBookmark(scholarshipId);
      
      if (response.bookmarked !== undefined) {
        await fetchSavedScholarships();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      return false;
    }
  }, [fetchSavedScholarships]);

  const unsaveScholarship = useCallback(async (scholarshipId: string) => {
    return await saveScholarship(scholarshipId); // Toggle works for both
  }, [saveScholarship]);

  const isScholarshipSaved = useCallback((scholarshipId: string) => {
    return savedScholarships.includes(scholarshipId.toString());
  }, [savedScholarships]);

  const toggleSaved = useCallback(async (scholarshipId: string) => {
    return await saveScholarship(scholarshipId);
  }, [saveScholarship]);

  useEffect(() => {
    fetchSavedScholarships();
  }, [fetchSavedScholarships]);

  return {
    savedScholarships,
    loading,
    error,
    isSaved: false,
    fetchSavedScholarships,
    saveScholarship,
    unsaveScholarship,
    isScholarshipSaved,
    toggleSaved,
  };
}

export function useProviderApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async (params?: any) => {
    setLoading(false);
    setApplications([]);
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId: string, status: string) => {
    return true;
  }, []);

  const sendMessage = useCallback(async (applicationId: string, message: string) => {
    return true;
  }, []);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    updateApplicationStatus,
    sendMessage,
  };
}

export function useScholarshipApplications(scholarshipId: string) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async (params?: any) => {
    setLoading(false);
    setApplications([]);
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId: string, status: string) => {
    return true;
  }, []);

  const sendMessage = useCallback(async (applicationId: string, message: string, subject?: string) => {
    return true;
  }, []);

  useEffect(() => {
    if (scholarshipId) {
      fetchApplications();
    }
  }, [scholarshipId, fetchApplications]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    updateApplicationStatus,
    sendMessage,
  };
}