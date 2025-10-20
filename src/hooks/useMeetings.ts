import { useState, useEffect, useCallback } from 'react';
import { Meeting, MeetingStatus } from '../../types';
import { meetingApi, MeetingFilters, CreateMeetingData, UpdateMeetingData } from '../services/meetingApi';

interface UseMeetingsReturn {
  // State
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;

  // Actions
  fetchMeetings: (filters?: MeetingFilters) => Promise<void>;
  createMeeting: (data: CreateMeetingData) => Promise<Meeting | null>;
  updateMeeting: (id: string, data: UpdateMeetingData) => Promise<Meeting | null>;
  deleteMeeting: (id: string) => Promise<boolean>;
  updateMeetingStatus: (id: string, status: MeetingStatus) => Promise<Meeting | null>;
  getUpcomingMeetings: (hours?: number) => Promise<Meeting[]>;

  // Bulk operations
  bulkUpdateStatus: (ids: string[], status: MeetingStatus) => Promise<{ updated: number; data: Meeting[] }>;

  // Utility functions
  refreshMeetings: () => Promise<void>;
  clearError: () => void;
}

export const useMeetings = (initialFilters?: MeetingFilters): UseMeetingsReturn => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<MeetingFilters | undefined>(initialFilters);

  // Fetch meetings with optional filters
  const fetchMeetings = useCallback(async (filters?: MeetingFilters) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentFilters(filters);

      const response = await meetingApi.getMeetings(filters);

      if (response.success) {
        // Convert dateTime strings to Date objects
        const meetingsWithDates = response.data.map(meeting => ({
          ...meeting,
          dateTime: new Date(meeting.dateTime)
        }));
        setMeetings(meetingsWithDates);
        setTotalCount(response.total);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      } else {
        throw new Error('Failed to fetch meetings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch meetings';
      setError(errorMessage);
      console.error('Error fetching meetings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new meeting
  const createMeeting = useCallback(async (data: CreateMeetingData): Promise<Meeting | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await meetingApi.createMeeting(data);

      if (response.success) {
        // Refresh meetings list to include the new meeting
        await fetchMeetings(currentFilters);
        return response.data;
      } else {
        throw new Error('Failed to create meeting');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create meeting';
      setError(errorMessage);
      console.error('Error creating meeting:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchMeetings, currentFilters]);

  // Update meeting
  const updateMeeting = useCallback(async (id: string, data: UpdateMeetingData): Promise<Meeting | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await meetingApi.updateMeeting(id, data);

      if (response.success) {
        // Update the meeting in local state
        setMeetings(prev => prev.map(meeting =>
          meeting.id === parseInt(id) ? { ...response.data, dateTime: new Date(response.data.dateTime) } : meeting
        ));
        return response.data;
      } else {
        throw new Error('Failed to update meeting');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update meeting';
      setError(errorMessage);
      console.error('Error updating meeting:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete meeting
  const deleteMeeting = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await meetingApi.deleteMeeting(id);

      // Remove from local state
      setMeetings(prev => prev.filter(meeting => meeting.id !== parseInt(id)));
      setTotalCount(prev => prev - 1);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete meeting';
      setError(errorMessage);
      console.error('Error deleting meeting:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update meeting status
  const updateMeetingStatus = useCallback(async (id: string, status: MeetingStatus): Promise<Meeting | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await meetingApi.updateMeetingStatus(id, status);

      if (response.success) {
        // Update the meeting in local state
        setMeetings(prev => prev.map(meeting =>
          meeting.id === parseInt(id) ? { ...response.data, dateTime: new Date(response.data.dateTime) } : meeting
        ));
        return response.data;
      } else {
        throw new Error('Failed to update meeting status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update meeting status';
      setError(errorMessage);
      console.error('Error updating meeting status:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get upcoming meetings
  const getUpcomingMeetings = useCallback(async (hours: number = 24): Promise<Meeting[]> => {
    try {
      const response = await meetingApi.getUpcomingMeetings(hours);

      if (response.success) {
        return response.data.map(meeting => ({
          ...meeting,
          dateTime: new Date(meeting.dateTime)
        }));
      } else {
        throw new Error('Failed to fetch upcoming meetings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upcoming meetings';
      setError(errorMessage);
      console.error('Error fetching upcoming meetings:', err);
      return [];
    }
  }, []);

  // Bulk update status
  const bulkUpdateStatus = useCallback(async (ids: string[], status: MeetingStatus) => {
    try {
      setLoading(true);
      setError(null);

      const result = await meetingApi.bulkUpdateStatus(ids, status);

      // Refresh meetings to get updated data
      await fetchMeetings(currentFilters);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk update meetings';
      setError(errorMessage);
      console.error('Error bulk updating meetings:', err);
      return { updated: 0, data: [] };
    } finally {
      setLoading(false);
    }
  }, [fetchMeetings, currentFilters]);

  // Refresh meetings
  const refreshMeetings = useCallback(async () => {
    await fetchMeetings(currentFilters);
  }, [fetchMeetings, currentFilters]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (initialFilters) {
      fetchMeetings(initialFilters);
    }
  }, [fetchMeetings, initialFilters]);

  return {
    // State
    meetings,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,

    // Actions
    fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    updateMeetingStatus,
    getUpcomingMeetings,

    // Bulk operations
    bulkUpdateStatus,

    // Utility functions
    refreshMeetings,
    clearError,
  };
};