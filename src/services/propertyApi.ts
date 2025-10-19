import { Property } from '../../types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

interface PropertyFilters {
  status?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class PropertyApiService {
  private baseUrl = 'http://localhost:5000/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('PropertyApiService: Making request to:', url);
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };
      console.log('PropertyApiService: Request config:', config);

      const response = await fetch(url, config);
      console.log('PropertyApiService: Response status:', response.status);
      console.log('PropertyApiService: Response ok:', response.ok);

      if (!response.ok) {
        console.log('PropertyApiService: Response not ok, throwing error');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      console.log('PropertyApiService: Response data:', data);
      return data;
    } catch (error) {
      console.error('PropertyApiService: API request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // Get all properties with optional filters
  async getProperties(filters: PropertyFilters = {}): Promise<ApiResponse<Property[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/properties${queryString ? `?${queryString}` : ''}`;

    return this.request<Property[]>(endpoint);
  }

  // Get single property by ID
  async getProperty(id: string): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/properties/${id}`);
  }

  // Create new property
  async createProperty(propertyData: Omit<Property, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Property>> {
    return this.request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  // Update property
  async updateProperty(id: string, propertyData: Partial<Property>): Promise<ApiResponse<Property>> {
    return this.request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  // Delete property
  async deleteProperty(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Get properties by status
  async getPropertiesByStatus(status: string): Promise<ApiResponse<Property[]>> {
    return this.request<Property[]>(`/properties?status=${status}`);
  }

  // Get properties by price range
  async getPropertiesByPriceRange(minPrice: number, maxPrice: number): Promise<ApiResponse<Property[]>> {
    return this.request<Property[]>(`/properties?minPrice=${minPrice}&maxPrice=${maxPrice}`);
  }

  // Upload files for a property
  async uploadPropertyFiles(propertyId: string, files: FileList): Promise<ApiResponse<any>> {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    return this.request<any>(`/properties/${propertyId}/upload`, {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set content-type for FormData
    });
  }
}

// Export singleton instance
export const propertyApi = new PropertyApiService();
export default propertyApi;