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
      // Get current user ID
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const applicantId = userData?.id || '1';
      
      const response = await mockApi.applications.submit({
        ...data,
        applicantId
      });
      
      if (response.success) {
        // Refresh applications list
        await fetchApplications(applicantId);
        return response;
      } else {
        throw new Error(response.error || 'Failed to submit application');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
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
      // Get current user ID
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const userId = userData?.id || '1';
      
      const response = await mockApi.applications.checkApplicationStatus(scholarshipId, userId);
      return response.data?.application || null;
    } catch (err) {
      return null;
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
      // Get current user ID
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const userId = userData?.id || '1';
      
      const response = await mockApi.savedScholarships.getByUser(userId);
      if (response.success) {
        setSavedScholarships(response.data || []);
      }
    } catch (err) {
      setError('Failed to fetch saved scholarships');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveScholarship = useCallback(async (scholarshipId: string) => {
    try {
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const userId = userData?.id || '1';
      
      const response = await mockApi.savedScholarships.toggle(userId, scholarshipId);
      if (response.success) {
        await fetchSavedScholarships();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, [fetchSavedScholarships]);

  const unsaveScholarship = useCallback(async (scholarshipId: string) => {
    return await saveScholarship(scholarshipId); // Toggle works for both
  }, [saveScholarship]);

  const isScholarshipSaved = useCallback((scholarshipId: string) => {
    return savedScholarships.includes(scholarshipId);
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