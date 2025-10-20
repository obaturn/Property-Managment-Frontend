import { Page, MeetingStatus, type Meeting, type Notification, NotificationCategory, type Agent, type Lead, LeadStatus, type Property, type ChatConversation } from './types';

export const NAV_ITEMS = [
  { page: Page.Dashboard, label: 'Dashboard' },
  { page: Page.Meetings, label: 'Meetings' },
  { page: Page.Leads, label: 'Leads' },
  { page: Page.Properties, label: 'Properties' },
  { page: Page.Analytics, label: 'Analytics' },
  { page: Page.Settings, label: 'Settings' },
  { page: Page.Admin, label: 'Admin' },
];

export const MOCK_MEETINGS: Meeting[] = [
  { id: 1, leadName: 'John Doe', propertyAddress: '123 Main St, Anytown, USA', dateTime: new Date(new Date().setDate(new Date().getDate() + 1)), status: MeetingStatus.Scheduled },
  { id: 2, leadName: 'Jane Smith', propertyAddress: '456 Oak Ave, Anytown, USA', dateTime: new Date(new Date().setDate(new Date().getDate() + 2)), status: MeetingStatus.Scheduled },
  { id: 3, leadName: 'Peter Jones', propertyAddress: '789 Pine Ln, Anytown, USA', dateTime: new Date(new Date().setDate(new Date().getDate() - 1)), status: MeetingStatus.Completed },
  { id: 4, leadName: 'Mary Johnson', propertyAddress: '101 Maple Dr, Anytown, USA', dateTime: new Date(new Date().setDate(new Date().getDate() - 2)), status: MeetingStatus.Completed },
  { id: 5, leadName: 'David Williams', propertyAddress: '212 Birch Rd, Anytown, USA', dateTime: new Date(new Date().setDate(new Date().getDate() - 3)), status: MeetingStatus.Missed },
  { id: 6, leadName: 'Sarah Brown', propertyAddress: '333 Elm Ct, Anytown, USA', dateTime: new Date(new Date().setDate(new Date().getDate() + 3)), status: MeetingStatus.Scheduled },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, category: NotificationCategory.Leads, message: 'New lead assigned to you from Zillow', time: '2 mins ago', unread: true },
    { id: 2, category: NotificationCategory.Meetings, message: 'Meeting with Sarah Brown rescheduled', time: '1 hour ago', unread: true },
    { id: 3, category: NotificationCategory.System, message: 'Your weekly performance report is ready', time: '4 hours ago', unread: false },
    { id: 4, category: NotificationCategory.Meetings, message: 'Meeting with John Doe confirmed for tomorrow', time: '1 day ago', unread: false },
];

export const MOCK_ANALYTICS_DATA = {
    meetingsOverTime: [
        { name: 'Jan', meetings: 65 }, { name: 'Feb', meetings: 59 }, { name: 'Mar', meetings: 80 },
        { name: 'Apr', meetings: 81 }, { name: 'May', meetings: 56 }, { name: 'Jun', meetings: 55 },
        { name: 'Jul', meetings: 40 },
    ],
    agentPerformance: [
        { name: 'You', meetings: 80 }, { name: 'Alex G', meetings: 72 }, { name: 'Maria K', meetings: 65 },
        { name: 'David L', meetings: 58 }, { name: 'Team Avg', meetings: 68 },
    ],
    meetingOutcomes: [
        { name: 'Completed', value: 400 }, { name: 'Scheduled', value: 300 },
        { name: 'Missed', value: 80 }, { name: 'Canceled', value: 50 },
    ],
};

export const MOCK_LEADS: Lead[] = [
    {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-0101',
        status: LeadStatus.New,
        source: 'Zillow',
        assignedTo: 'John Doe',
        lastContacted: new Date('2024-07-20T10:00:00Z'),
        score: 85,
        priority: 'hot',
        engagementScore: 92,
        budget: 500000,
        preferredPropertyType: 'Single Family Home',
        timeline: '3 months',
        aiInsights: ['High engagement with luxury listings', 'Responds quickly to messages', 'Budget matches market trends']
    },
    {
        id: 2,
        name: 'Bob Williams',
        email: 'bob@example.com',
        phone: '555-0102',
        status: LeadStatus.Contacted,
        source: 'Realtor.com',
        assignedTo: 'John Doe',
        lastContacted: new Date('2024-07-19T14:30:00Z'),
        score: 72,
        priority: 'high',
        engagementScore: 78,
        budget: 350000,
        preferredPropertyType: 'Condo',
        timeline: '6 months',
        aiInsights: ['Interested in downtown locations', 'Price-sensitive buyer', 'Schedule follow-up call']
    },
    {
        id: 3,
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        phone: '555-0103',
        status: LeadStatus.Nurturing,
        source: 'Organic',
        assignedTo: 'John Doe',
        lastContacted: new Date('2024-07-18T11:00:00Z'),
        score: 45,
        priority: 'medium',
        engagementScore: 35,
        budget: 250000,
        preferredPropertyType: 'Townhouse',
        timeline: '1 year',
        aiInsights: ['Low engagement - send market update', 'Consider email nurturing campaign', 'Budget below market average']
    },
    {
        id: 4,
        name: 'Diana Prince',
        email: 'diana@example.com',
        phone: '555-0104',
        status: LeadStatus.Closed,
        source: 'Referral',
        assignedTo: 'John Doe',
        lastContacted: new Date('2024-07-15T16:00:00Z'),
        score: 95,
        priority: 'hot',
        engagementScore: 98,
        budget: 750000,
        preferredPropertyType: 'Luxury Home',
        timeline: 'Immediate',
        aiInsights: ['VIP client - priority handling', 'Referral source - excellent lead quality', 'High conversion probability']
    },
    {
        id: 5,
        name: 'Ethan Hunt',
        email: 'ethan@example.com',
        phone: '555-0105',
        status: LeadStatus.New,
        source: 'Website',
        assignedTo: 'John Doe',
        lastContacted: new Date('2024-07-21T09:00:00Z'),
        score: 68,
        priority: 'medium',
        engagementScore: 65,
        budget: 400000,
        preferredPropertyType: 'Single Family',
        timeline: '4 months',
        aiInsights: ['First-time homebuyer', 'Needs pre-approval info', 'Send neighborhood guides']
    },
    {
        id: 6,
        name: 'Fiona Glenanne',
        email: 'fiona@example.com',
        phone: '555-0106',
        status: LeadStatus.Contacted,
        source: 'Zillow',
        assignedTo: 'John Doe',
        lastContacted: new Date('2024-07-20T15:00:00Z'),
        score: 88,
        priority: 'high',
        engagementScore: 85,
        budget: 600000,
        preferredPropertyType: 'Executive Home',
        timeline: '2 months',
        aiInsights: ['Highly engaged - schedule showing ASAP', 'Matches hot market segment', 'Consider priority listing alerts']
    },
];

export const MOCK_PROPERTIES: Property[] = [
    { _id: '507f1f77bcf86cd799439011', address: '123 Main St, Anytown, USA', price: 450000, bedrooms: 3, bathrooms: 2, sqft: 1800, imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop', description: 'A beautiful family home in a quiet neighborhood.', propertyType: 'House', status: 'Available', yearBuilt: 2015, features: ['Hardwood floors', 'Updated kitchen', 'Fenced yard'], createdAt: '2024-01-15T10:30:00.000Z', updatedAt: '2024-01-15T10:30:00.000Z' },
    { _id: '507f191e810c19729de860ea', address: '456 Oak Ave, Anytown, USA', price: 650000, bedrooms: 4, bathrooms: 3, sqft: 2500, imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop', description: 'Spacious modern house with a large backyard.', propertyType: 'House', status: 'Available', yearBuilt: 2018, features: ['Open floor plan', 'Granite countertops', 'Two-car garage'], createdAt: '2024-01-20T14:45:00.000Z', updatedAt: '2024-01-20T14:45:00.000Z' },
    { _id: '507f1f77bcf86cd799439012', address: '789 Pine Ln, Anytown, USA', price: 320000, bedrooms: 2, bathrooms: 2, sqft: 1200, imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop', description: 'Cozy cottage perfect for a first-time buyer.', propertyType: 'House', status: 'Available', yearBuilt: 1995, features: ['Fireplace', 'Garden', 'Charming details'], createdAt: '2024-02-01T09:15:00.000Z', updatedAt: '2024-02-01T09:15:00.000Z' },
];

export const MOCK_PROPERTY_IMAGES: string[] = [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop',
];

export const MOCK_CONVERSATIONS: ChatConversation[] = [
    {
        id: 1,
        contactName: 'Alice Johnson (Lead)',
        unread: 2,
        messages: [
            { id: 1, sender: 'agent', text: 'Hi Alice, thanks for your interest in 123 Main St. Are you free for a quick chat tomorrow?', timestamp: '10:30 AM' },
            { id: 2, sender: 'user', text: 'Hi! Yes, tomorrow afternoon works for me.', timestamp: '10:35 AM' },
            { id: 3, sender: 'user', text: 'Does 2 PM work?', timestamp: '10:35 AM' },
        ],
    },
    {
        id: 2,
        contactName: 'Jane Smith (Agent)',
        unread: 0,
        messages: [
            { id: 1, sender: 'agent', text: 'Hey Jane, did you get the documents for the Oak Ave property?', timestamp: 'Yesterday' },
            { id: 2, sender: 'user', text: 'Yep, got them. Reviewing now.', timestamp: 'Yesterday' },
        ],
    },
];

export const MOCK_AGENTS: Agent[] = [
    { id: 1, name: 'John Doe', meetings: 80 },
    { id: 2, name: 'Alex Garcia', meetings: 72 },
    { id: 3, name: 'Maria Kim', meetings: 65 },
    { id: 4, name: 'David Lee', meetings: 58 },
    { id: 5, name: 'Sarah Johnson', meetings: 45 },
    { id: 6, name: 'Mike Chen', meetings: 38 },
];