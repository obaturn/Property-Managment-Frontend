import { io, Socket } from 'socket.io-client';

export interface NotificationData {
  type: 'new_lead' | 'new_meeting' | 'new_booking' | 'meeting_reminder' | 'lead_update';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
}

export interface UserData {
  userId: string;
  userType: 'agent' | 'admin';
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event listeners
  private listeners: { [event: string]: ((data: any) => void)[] } = {};

  // Initialize socket connection
  connect(userData: UserData): Promise<void> {
    return new Promise((resolve, reject) => {
      const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

      this.socket = io(API_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      // Connection event
      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        this.reconnectAttempts = 0;

        // Join with user data
        this.socket?.emit('join', userData);
        resolve();
      });

      // Connection error
      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.handleReconnect();
        reject(error);
      });

      // Disconnection
      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from WebSocket server:', reason);
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.handleReconnect();
        }
      });

      // Listen for notifications
      this.socket.on('newLead', (data: NotificationData) => {
        this.emit('newLead', data);
      });

      this.socket.on('newMeeting', (data: NotificationData) => {
        this.emit('newMeeting', data);
      });

      this.socket.on('newBooking', (data: NotificationData) => {
        this.emit('newBooking', data);
      });

      this.socket.on('meetingReminder', (data: NotificationData) => {
        this.emit('meetingReminder', data);
      });

      this.socket.on('leadUpdate', (data: NotificationData) => {
        this.emit('leadUpdate', data);
      });

      // Handle typing indicators
      this.socket.on('userTyping', (data) => {
        this.emit('userTyping', data);
      });

      // Handle read receipts
      this.socket.on('messageRead', (data) => {
        this.emit('messageRead', data);
      });
    });
  }

  // Handle reconnection logic
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.socket?.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached', {});
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Send typing indicator
  sendTyping(data: any) {
    this.socket?.emit('typing', data);
  }

  // Mark message as read
  markAsRead(data: any) {
    this.socket?.emit('markAsRead', data);
  }

  // Event system for components to listen to notifications
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback?: (data: any) => void) {
    if (!this.listeners[event]) return;

    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      delete this.listeners[event];
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;