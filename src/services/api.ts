// API Service for RealtyFlow Frontend
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

// Generic API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

export interface Lead {
  _id: string;
  id: number; // For compatibility with existing code
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Nurturing' | 'Closed';
  source: string;
  assignedTo: string;
  lastContacted: string;
  score?: number;
  priority?: 'low' | 'medium' | 'high' | 'hot';
  engagementScore?: number;
  budget?: number;
  preferredPropertyType?: string;
  timeline?: string;
  aiInsights?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.errors
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

// Lead API functions
export const leadApi = {
  // Get all leads with pagination and filtering
  async getLeads(params: {
    status?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<ApiResponse<Lead[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/leads${queryString ? `?${queryString}` : ''}`;

    return apiRequest<ApiResponse<Lead[]>>(endpoint);
  },

  // Get leads by status (for Kanban board)
  async getLeadsByStatus(status: string): Promise<ApiResponse<Lead[]>> {
    return apiRequest<ApiResponse<Lead[]>>(`/leads/status/${status}`);
  },

  // Get single lead
  async getLead(id: string): Promise<ApiResponse<Lead>> {
    return apiRequest<ApiResponse<Lead>>(`/leads/${id}`);
  },

  // Create new lead
  async createLead(leadData: Omit<Lead, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Lead>> {
    return apiRequest<ApiResponse<Lead>>('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  // Update lead
  async updateLead(id: string, leadData: Partial<Lead>): Promise<ApiResponse<Lead>> {
    return apiRequest<ApiResponse<Lead>>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },

  // Update lead status (for drag-and-drop)
  async updateLeadStatus(id: string, status: Lead['status']): Promise<ApiResponse<Lead>> {
    return apiRequest<ApiResponse<Lead>>(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete lead
  async deleteLead(id: string): Promise<ApiResponse<null>> {
    return apiRequest<ApiResponse<null>>(`/leads/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthApi = {
  async checkHealth(): Promise<{ status: string; message: string; timestamp: string }> {
    return apiRequest('/health');
  },
};