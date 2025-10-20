import { Meeting, MeetingStatus } from '../../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface MeetingFilters {
  status?: MeetingStatus;
  assignedTo?: string;
  leadName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateMeetingData {
  leadName: string;
  propertyAddress: string;
  dateTime: string;
  status?: MeetingStatus;
  notes?: string;
  assignedTo: string;
}

export interface UpdateMeetingData {
  leadName?: string;
  propertyAddress?: string;
  dateTime?: string;
  status?: MeetingStatus;
  notes?: string;
  assignedTo?: string;
}

class MeetingApiService {
  private async request<T>(
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
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Get all meetings with optional filters
  async getMeetings(filters: MeetingFilters = {}): Promise<{
    success: boolean;
    count: number;
    total: number;
    totalPages: number;
    currentPage: number;
    data: Meeting[];
  }> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/meetings${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint);
  }

  // Get single meeting by ID
  async getMeeting(id: string): Promise<{
    success: boolean;
    data: Meeting;
  }> {
    return this.request(`/meetings/${id}`);
  }

  // Create new meeting
  async createMeeting(meetingData: CreateMeetingData): Promise<{
    success: boolean;
    data: Meeting;
  }> {
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  }

  // Update meeting
  async updateMeeting(id: string, meetingData: UpdateMeetingData): Promise<{
    success: boolean;
    data: Meeting;
  }> {
    return this.request(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meetingData),
    });
  }

  // Delete meeting
  async deleteMeeting(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/meetings/${id}`, {
      method: 'DELETE',
    });
  }

  // Get upcoming meetings
  async getUpcomingMeetings(hours: number = 24): Promise<{
    success: boolean;
    count: number;
    data: Meeting[];
  }> {
    return this.request(`/meetings/upcoming?hours=${hours}`);
  }

  // Update meeting status
  async updateMeetingStatus(id: string, status: MeetingStatus): Promise<{
    success: boolean;
    data: Meeting;
  }> {
    return this.request(`/meetings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Bulk operations
  async bulkUpdateStatus(ids: string[], status: MeetingStatus): Promise<{
    success: boolean;
    updated: number;
    data: Meeting[];
  }> {
    const promises = ids.map(id => this.updateMeetingStatus(id, status));
    const results = await Promise.allSettled(promises);

    const successful = results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<any>).value.data);

    return {
      success: successful.length > 0,
      updated: successful.length,
      data: successful,
    };
  }

  // Get meetings by date range
  async getMeetingsByDateRange(startDate: Date, endDate: Date): Promise<{
    success: boolean;
    count: number;
    data: Meeting[];
  }> {
    const filters: MeetingFilters = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    return this.getMeetings(filters);
  }

  // Get meetings by status
  async getMeetingsByStatus(status: MeetingStatus): Promise<{
    success: boolean;
    count: number;
    data: Meeting[];
  }> {
    return this.getMeetings({ status });
  }

  // Get meetings assigned to agent
  async getMeetingsByAgent(assignedTo: string): Promise<{
    success: boolean;
    count: number;
    data: Meeting[];
  }> {
    return this.getMeetings({ assignedTo });
  }
}

export const meetingApi = new MeetingApiService();
export default meetingApi;