import { useState, useEffect, useCallback } from 'react';
import { leadApi, Lead as ApiLead, ApiError } from '../services/api';
import type { Lead, LeadStatus } from '../../types';

// Hook return type
interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateLeadStatus: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  createLead: (leadData: Omit<Lead, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteLead: (leadId: string) => Promise<void>;
  getLeadsByStatus: (status: LeadStatus) => Lead[];
}

// Custom hook for lead management
export const useLeads = (): UseLeadsReturn => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all leads
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await leadApi.getLeads();
      if (response.success && response.data) {
        // Transform backend data to match frontend interface
        const transformedLeads: Lead[] = response.data.map(lead => ({
          ...lead,
          id: parseInt(lead._id.slice(-4), 16) || Math.floor(Math.random() * 1000), // Simple ID transformation
          lastContacted: new Date(lead.lastContacted || lead.createdAt || Date.now()),
          status: lead.status as LeadStatus
        }));
        setLeads(transformedLeads);
      } else {
        throw new Error(response.message || 'Failed to fetch leads');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : 'Failed to load leads. Please check your connection.';
      setError(errorMessage);
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update lead status (for drag-and-drop)
  const updateLeadStatus = useCallback(async (leadId: string, newStatus: LeadStatus) => {
    try {
      setError(null);

      // Optimistic update
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          (lead as any)._id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      const response = await leadApi.updateLeadStatus(leadId, newStatus);

      if (!response.success) {
        // Revert optimistic update on failure
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            (lead as any)._id === leadId ? { ...lead, status: lead.status } : lead
          )
        );
        throw new Error(response.message || 'Failed to update lead status');
      }

      // Update with server response
      if (response.data) {
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            (lead as any)._id === leadId ? { ...response.data!, id: lead.id, lastContacted: new Date(response.data!.lastContacted || Date.now()), status: response.data!.status as LeadStatus } : lead
          )
        );
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? `Failed to update lead status: ${err.message}`
        : 'Failed to update lead status. Please try again.';
      setError(errorMessage);
      console.error('Error updating lead status:', err);
      throw err; // Re-throw for component handling
    }
  }, []);

  // Create new lead
  const createLead = useCallback(async (leadData: Omit<Lead, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);

      const apiLeadData = {
        ...leadData,
        lastContacted: leadData.lastContacted.toISOString()
      };

      const response = await leadApi.createLead(apiLeadData as any);

      if (response.success && response.data) {
        // Transform and add to local state
        const newLead: Lead = {
          ...response.data,
          id: parseInt(response.data._id.slice(-4), 16) || Math.floor(Math.random() * 1000),
          lastContacted: new Date(response.data.lastContacted || response.data.createdAt || Date.now()),
          status: response.data.status as LeadStatus
        };
        setLeads(prevLeads => [...prevLeads, newLead]);
      } else {
        throw new Error(response.message || 'Failed to create lead');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? `Failed to create lead: ${err.message}`
        : 'Failed to create lead. Please try again.';
      setError(errorMessage);
      console.error('Error creating lead:', err);
      throw err;
    }
  }, []);

  // Delete lead
  const deleteLead = useCallback(async (leadId: string) => {
    try {
      setError(null);

      // Optimistic update
      setLeads(prevLeads => prevLeads.filter(lead => (lead as any)._id !== leadId));

      const response = await leadApi.deleteLead(leadId);

      if (!response.success) {
        // Revert optimistic update on failure
        await fetchLeads(); // Refetch all leads
        throw new Error(response.message || 'Failed to delete lead');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? `Failed to delete lead: ${err.message}`
        : 'Failed to delete lead. Please try again.';
      setError(errorMessage);
      console.error('Error deleting lead:', err);
      throw err;
    }
  }, [fetchLeads]);

  // Get leads filtered by status
  const getLeadsByStatus = useCallback((status: LeadStatus): Lead[] => {
    return leads.filter(lead => lead.status === status);
  }, [leads]);

  // Initial data fetch
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    refetch: fetchLeads,
    updateLeadStatus,
    createLead,
    deleteLead,
    getLeadsByStatus
  };
};