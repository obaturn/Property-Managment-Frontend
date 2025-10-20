import { useState, useEffect, useCallback } from 'react';
import socketService, { NotificationData } from '../services/socketService';

export interface Notification extends NotificationData {
  id: string;
  read: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  isConnected: boolean;
}

export const useNotifications = (userData: { userId: string; userType: 'agent' | 'admin' }): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to socket on mount
  useEffect(() => {
    const connectSocket = async () => {
      try {
        await socketService.connect(userData);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect to notification service:', error);
        setIsConnected(false);
      }
    };

    connectSocket();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [userData.userId, userData.userType]);

  // Listen for new notifications
  useEffect(() => {
    const handleNewLead = (data: NotificationData) => {
      addNotification(data);
    };

    const handleNewMeeting = (data: NotificationData) => {
      addNotification(data);
    };

    const handleNewBooking = (data: NotificationData) => {
      addNotification(data);
    };

    const handleMeetingReminder = (data: NotificationData) => {
      addNotification(data);
    };

    const handleLeadUpdate = (data: NotificationData) => {
      addNotification(data);
    };

    // Register listeners
    socketService.on('newLead', handleNewLead);
    socketService.on('newMeeting', handleNewMeeting);
    socketService.on('newBooking', handleNewBooking);
    socketService.on('meetingReminder', handleMeetingReminder);
    socketService.on('leadUpdate', handleLeadUpdate);

    // Cleanup listeners
    return () => {
      socketService.off('newLead', handleNewLead);
      socketService.off('newMeeting', handleNewMeeting);
      socketService.off('newBooking', handleNewBooking);
      socketService.off('meetingReminder', handleMeetingReminder);
      socketService.off('leadUpdate', handleLeadUpdate);
    };
  }, []);

  // Add new notification
  const addNotification = useCallback((data: NotificationData) => {
    const newNotification: Notification = {
      ...data,
      id: `${data.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after 1 hour for non-critical notifications
    if (data.type !== 'meeting_reminder') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 60 * 60 * 1000); // 1 hour
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );

    // Send read receipt to server
    socketService.markAsRead({ notificationId });
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Clear specific notification
  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    isConnected,
  };
};