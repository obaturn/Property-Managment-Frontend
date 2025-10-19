import { useState, useEffect, useCallback } from 'react';
import { propertyApi } from '../services/propertyApi';
import { Property } from '../../types';
import { MOCK_PROPERTIES } from '../../constants';

interface ApiError {
  message: string;
}

// Hook return type
interface UsePropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProperty: (propertyData: Omit<Property, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProperty: (id: string, propertyData: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  uploadPropertyFiles: (propertyId: string, files: FileList) => Promise<void>;
  getPropertiesByStatus: (status: string) => Property[];
  getPropertiesByPriceRange: (minPrice: number, maxPrice: number) => Property[];
}

// Custom hook for property management
export const useProperties = (): UsePropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all properties
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('useProperties: Starting to fetch properties...');

      const response = await propertyApi.getProperties();
      console.log('useProperties: API response received:', response);

      if (response.success && response.data) {
        console.log('useProperties: Response data:', response.data);
        // Transform backend data to match frontend interface
        const transformedProperties = response.data.map(property => ({
          ...property,
          id: property._id ? parseInt(property._id.slice(-4), 16) || Math.floor(Math.random() * 1000) : Math.floor(Math.random() * 1000),
        }));
        console.log('useProperties: Transformed properties:', transformedProperties);
        setProperties(transformedProperties);
      } else {
        console.log('useProperties: Response not successful:', response);
        throw new Error(response.message || 'Failed to fetch properties');
      }
    } catch (err) {
      console.log('useProperties: Error occurred:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : 'Failed to load properties. Please check your connection.';
      setError(errorMessage);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new property
  const createProperty = useCallback(async (propertyData: Omit<Property, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);

      const response = await propertyApi.createProperty(propertyData);

      if (response.success && response.data) {
        // Transform and add to local state
        const newProperty = {
          ...response.data,
          id: response.data._id ? parseInt(response.data._id.slice(-4), 16) || Math.floor(Math.random() * 1000) : Math.floor(Math.random() * 1000),
        };
        setProperties(prevProperties => [...prevProperties, newProperty]);
      } else {
        throw new Error(response.message || 'Failed to create property');
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? `Failed to create property: ${err.message}`
        : 'Failed to create property. Please try again.';
      setError(errorMessage);
      console.error('Error creating property:', err);
      throw err;
    }
  }, []);

  // Update property
  const updateProperty = useCallback(async (id: string, propertyData: Partial<Property>) => {
    try {
      setError(null);

      // Optimistic update
      setProperties(prevProperties =>
        prevProperties.map(property =>
          property._id === id ? { ...property, ...propertyData } : property
        )
      );

      const response = await propertyApi.updateProperty(id, propertyData);

      if (!response.success) {
        // Revert optimistic update on failure
        await fetchProperties(); // Refetch all properties
        throw new Error(response.message || 'Failed to update property');
      }

      // Update with server response
      if (response.data) {
        setProperties(prevProperties =>
          prevProperties.map(property =>
            property._id === id ? { ...response.data! } : property
          )
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? `Failed to update property: ${err.message}`
        : 'Failed to update property. Please try again.';
      setError(errorMessage);
      console.error('Error updating property:', err);
      throw err;
    }
  }, [fetchProperties]);

  // Delete property
  const deleteProperty = useCallback(async (id: string) => {
    try {
      setError(null);

      // Optimistic update
      setProperties(prevProperties => prevProperties.filter(property => property._id !== id));

      const response = await propertyApi.deleteProperty(id);

      if (!response.success) {
        // Revert optimistic update on failure
        await fetchProperties(); // Refetch all properties
        throw new Error(response.message || 'Failed to delete property');
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? `Failed to delete property: ${err.message}`
        : 'Failed to delete property. Please try again.';
      setError(errorMessage);
      console.error('Error deleting property:', err);
      throw err;
    }
  }, [fetchProperties]);

  // Get properties filtered by status
  const getPropertiesByStatus = useCallback((status: string): Property[] => {
    return properties.filter(property => property.status === status);
  }, [properties]);

  // Upload files for a property
  const uploadPropertyFiles = useCallback(async (propertyId: string, files: FileList): Promise<void> => {
    try {
      setError(null);
      const response = await propertyApi.uploadPropertyFiles(propertyId, files);

      if (response.success) {
        // Refetch properties to get updated data with new files
        await fetchProperties();
      } else {
        throw new Error(response.message || 'Failed to upload files');
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? `Failed to upload files: ${err.message}`
        : 'Failed to upload files. Please try again.';
      setError(errorMessage);
      console.error('Error uploading files:', err);
      throw err;
    }
  }, [fetchProperties]);

  // Get properties filtered by price range
  const getPropertiesByPriceRange = useCallback((minPrice: number, maxPrice: number): Property[] => {
    return properties.filter(property =>
      property.price >= minPrice && property.price <= maxPrice
    );
  }, [properties]);

  // Initial data fetch
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadPropertyFiles,
    getPropertiesByStatus,
    getPropertiesByPriceRange
  };
};