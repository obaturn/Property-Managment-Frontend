import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Spinner } from './index';

interface GoogleCalendarConnectProps {
  agentId: string;
  isConnected: boolean;
  onConnectionChange?: (connected: boolean) => void;
}

const GoogleCalendarConnect: React.FC<GoogleCalendarConnectProps> = ({
  agentId,
  isConnected,
  onConnectionChange
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for OAuth callback messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'GOOGLE_CALENDAR_CONNECTED' && event.data.agentId === agentId) {
        setIsConnecting(false);
        onConnectionChange?.(true);
        setError(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [agentId, onConnectionChange]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch(
        `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'}/api/auth/google?agentId=${agentId}`
      );

      const data = await response.json();

      if (data.success && data.authUrl) {
        // Open OAuth URL in popup
        const popup = window.open(
          data.authUrl,
          'google-calendar-oauth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Check if popup was blocked
        if (!popup) {
          setError('Popup was blocked. Please allow popups and try again.');
          setIsConnecting(false);
          return;
        }

        // Monitor popup closure
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            setIsConnecting(false);
            // Check connection status after popup closes
            checkConnectionStatus();
          }
        }, 1000);

      } else {
        throw new Error(data.message || 'Failed to get authorization URL');
      }
    } catch (err) {
      console.error('Error connecting to Google Calendar:', err);
      setError('Failed to connect to Google Calendar. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await fetch(
        `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agentId })
        }
      );

      const data = await response.json();

      if (data.success) {
        onConnectionChange?.(false);
      } else {
        throw new Error(data.message || 'Failed to disconnect');
      }
    } catch (err) {
      console.error('Error disconnecting Google Calendar:', err);
      setError('Failed to disconnect Google Calendar. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(
        `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'}/api/auth/google/status?agentId=${agentId}`
      );

      const data = await response.json();
      if (data.success) {
        onConnectionChange?.(data.isConnected);
      }
    } catch (err) {
      console.error('Error checking connection status:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Google Calendar Integration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isConnected
                ? 'Connected - Your calendar is being used for scheduling'
                : 'Not connected - Manual scheduling only'
              }
            </p>
          </div>
        </div>

        <Button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          variant={isConnected ? 'danger' : 'primary'}
          className="flex items-center space-x-2"
        >
          {isConnecting ? (
            <>
              <Spinner className="w-4 h-4" />
              <span>{isConnected ? 'Disconnecting...' : 'Connecting...'}</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                {isConnected ? (
                  // Disconnect icon
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                ) : (
                  // Google Calendar icon
                  <path d="M17 3H7C5.9 3 5 3.9 5 5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V5C19 3.9 18.1 3 17 3ZM17 19H7V5H17V19ZM12 17L16 13H13V9H11V13H8L12 17Z"/>
                )}
              </svg>
              <span>{isConnected ? 'Disconnect' : 'Connect'}</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {!isConnected && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Why connect Google Calendar?
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Automatic availability checking</li>
            <li>• Instant meeting booking</li>
            <li>• Calendar event creation</li>
            <li>• Conflict prevention</li>
          </ul>
        </div>
      )}

      {isConnected && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
            Calendar Connected Successfully!
          </h4>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <li>• Your availability is automatically checked</li>
            <li>• Meetings are booked instantly</li>
            <li>• Calendar events are created automatically</li>
            <li>• Clients receive calendar invites</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarConnect;