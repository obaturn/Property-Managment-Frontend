export enum Page {
  Dashboard = 'Dashboard',
  Meetings = 'Meetings',
  Leads = 'Leads',
  Properties = 'Properties',
  Analytics = 'Analytics',
  Settings = 'Settings',
  Admin = 'Admin',
  CreateLead = 'CreateLead',
}

export enum MeetingStatus {
    Scheduled = 'Scheduled',
    Completed = 'Completed',
    Missed = 'Missed',
}

export interface Meeting {
  id: number;
  leadName: string;
  propertyAddress: string;
  dateTime: Date;
  status: MeetingStatus;
}

export enum NotificationCategory {
    Leads = 'Leads',
    Meetings = 'Meetings',
    System = 'System',
}

export interface Notification {
    id: number;
    category: NotificationCategory;
    message: string;
    time: string;
    unread: boolean;
}

export interface Agent {
    id: number;
    name: string;
    meetings: number;
}

export enum LeadStatus {
    New = 'New',
    Contacted = 'Contacted',
    Nurturing = 'Nurturing',
    Closed = 'Closed',
}

export interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: LeadStatus;
    source: string;
    assignedTo: string;
    lastContacted: Date;
    score?: number; // AI-powered lead scoring (0-100)
    priority?: 'low' | 'medium' | 'high' | 'hot';
    engagementScore?: number; // Based on interactions
    budget?: number;
    preferredPropertyType?: string;
    timeline?: string;
    aiInsights?: string[]; // AI-generated suggestions
    notes?: string;
}

export interface PropertyFile {
    url: string;
    type: 'image' | 'video';
    filename?: string;
    size?: number;
    uploadedAt?: string;
    file?: File; // Store the original File object for upload
}

export interface Property {

    _id?: string;
    address: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: number;
    images?: PropertyFile[];
    imageUrl?: string; // Keep for backward compatibility
    description?: string;
    propertyType?: 'House' | 'Condo' | 'Townhouse' | 'Apartment' | 'Land' | 'Commercial' | 'Other';
    status?: 'Available' | 'Pending' | 'Sold' | 'Off Market';
    yearBuilt?: number;
    features?: string[];
    createdAt?: string;
    updatedAt?: string;
    pricePerSqft?: number;
    id?: number; // Frontend ID for compatibility
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
}

export interface ChatConversation {
    id: number;
    contactName: string;
    messages: ChatMessage[];
    unread: number;
}
