

import React, { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import type { Meeting, Notification, Lead, Property, PropertyFile, ChatConversation } from '../types';
import { MeetingStatus, NotificationCategory } from '../types';
import { MOCK_PROPERTY_IMAGES } from '../constants';

// RealtyFlow Logo Component
export const RealtyFlowLogo = ({ className = "h-8 w-auto", showText = true }: { className?: string; showText?: boolean }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
      {/* House silhouette */}
      <path d="M8 28V16L20 8L32 16V28H24V20H16V28H8Z" fill="currentColor" opacity="0.9"/>
      {/* Flowing lines representing "flow" */}
      <path d="M12 32C12 32 16 30 20 32C24 34 28 32 28 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      <path d="M10 34C10 34 14 32 18 34C22 36 26 34 26 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Accent dot */}
      <circle cx="20" cy="14" r="2" fill="currentColor" opacity="0.8"/>
    </svg>
    {showText && (
      <span className="text-xl font-bold text-blue-600 tracking-tight">
        Realty<span className="text-red-500">Flow</span>
      </span>
    )}
  </div>
);

// Legacy IconLogo for backward compatibility
export const IconLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
export const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
export const IconMeetings = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
// Fix: Updated IconAnalytics to accept a className prop.
export const IconAnalytics = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
export const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
// Fix: Updated IconBell to accept a className prop.
export const IconBell = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
// Fix: Updated IconWallet to accept a className prop.
export const IconWallet = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
export const IconSun = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
export const IconMoon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
export const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
export const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
export const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
export const IconChevronDown = ({ className = "h-5 w-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
export const IconExternalLink = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
export const IconTrophy = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2h-2m-4 0v10m0 0a2 2 0 002 2h2a2 2 0 002-2m-6 0a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2m-6 0h6m-3-10V5m0 0a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" /></svg>;
// Fix: Updated IconCalendarCheck to accept a className prop.
export const IconCalendarCheck = ({ className = "h-8 w-8 text-blue-500" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 16l2 2 4-4" /></svg>;
// Fix: Updated IconUsers to accept a className prop.
export const IconUsers = ({ className = "h-8 w-8 text-blue-500" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a5.002 5.002 0 019 0m-4.5 5a5 5 0 100-10 5 5 0 000 10z" /></svg>;
// Fix: Updated IconBuilding to accept a className prop.
export const IconBuilding = ({ className = "h-8 w-8 text-blue-500" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-8h1m-1 4h1m-1 4h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg>;
export const IconLeads = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.184-1.268-.5-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.184-1.268.5-1.857m0 0a5.002 5.002 0 019 0m-4.5 5a5 5 0 100-10 5 5 0 000 10z" /></svg>;
export const IconProperties = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
export const IconMessageCircle = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>;
export const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
export const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
export const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
export const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
export const IconSoundOn = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
export const IconSoundOff = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2" /></svg>;


// Spinner Component
export const Spinner = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


// Reusable UI Components
interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: ReactNode;
}
export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      {change && <p className="text-xs text-green-500">{change}</p>}
    </div>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500 disabled:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
  };
  return <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>{children}</button>;
};


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                <IconClose />
              </button>
            </div>
            <div>{children}</div>
        </div>
      </motion.div>
    </div>
  );
};

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: ReactNode;
}
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300">{children}</p>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm}>Delete</Button>
                </div>
            </div>
        </Modal>
    );
};

interface ToggleSwitchProps {
    label: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${enabled ? 'translate-x-6' : ''}`}></div>
        </div>
    </label>
);

// Meeting Card Component
export const getStatusClasses = (status: MeetingStatus) => {
    switch (status) {
        case MeetingStatus.Scheduled: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case MeetingStatus.Completed: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case MeetingStatus.Missed: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

interface MeetingCardProps { meeting: Meeting; }
export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => (
    <motion.div 
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-3"
        whileHover={{ scale: 1.03, y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        transition={{ duration: 0.2 }}
        layout
    >
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{meeting.leadName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{meeting.propertyAddress}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClasses(meeting.status)}`}>
                {meeting.status}
            </span>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
            {meeting.dateTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </div>
        <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" className="text-sm py-1 px-3" onClick={() => {/* View details functionality */}}>View Details</Button>
            <Button variant="secondary" className="text-sm py-1 px-3" onClick={() => {/* Reschedule functionality */}}>Reschedule</Button>
            <Button variant="danger" className="text-sm py-1 px-3 !bg-red-100 !text-red-700 hover:!bg-red-200 dark:!bg-red-900/50 dark:!text-red-300 dark:hover:!bg-red-900" onClick={() => {/* Cancel functionality */}}>Cancel</Button>
        </div>
    </motion.div>
);


// Notification Panel
interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
}
export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications }) => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const prevUnreadCount = useRef(notifications.filter(n => n.unread).length);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const playNotificationSound = () => {
        if (!audioCtxRef.current) {
            try {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser");
                return;
            }
        }
        const audioCtx = audioCtxRef.current;
        if (!audioCtx || audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        oscillator.start(audioCtx.currentTime);
        
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.15);
        oscillator.stop(audioCtx.currentTime + 0.15);
    };
    
    useEffect(() => {
        const unreadCount = notifications.filter(n => n.unread).length;
        if (soundEnabled && unreadCount > prevUnreadCount.current) {
            playNotificationSound();
        }
        prevUnreadCount.current = unreadCount;
    }, [notifications, soundEnabled]);
    
    const getCategoryIcon = (category: NotificationCategory) => {
        switch (category) {
            case NotificationCategory.Leads: return <span className="text-lg">🔔</span>;
            case NotificationCategory.Meetings: return <span className="text-lg">📅</span>;
            case NotificationCategory.System: return <span className="text-lg">⚙️</span>;
        }
    };
    
    const notificationVariants = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    };

    return (
        <div className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-lg z-40 w-80 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <IconBell className="h-5 w-5 text-blue-500" />
                    <h3 className="font-bold text-lg dark:text-white">Notifications</h3>
                </div>
                <div className="flex items-center space-x-2">
                      <button onClick={() => setSoundEnabled(!soundEnabled)} title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        {soundEnabled ? <IconSoundOn /> : <IconSoundOff />}
                    </button>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><IconClose /></button>
                </div>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto h-[calc(100%-120px)]">
                 <AnimatePresence>
                    {notifications.map((n, i) => (
                         <motion.div
                            key={n.id}
                            variants={notificationVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            layout
                        >
                            <div className={`p-3 rounded-lg flex items-start space-x-3 ${n.unread ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                                <div className="mt-1">{getCategoryIcon(n.category)}</div>
                                <div>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{n.time}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                 </AnimatePresence>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700">
                <Button variant="secondary" className="w-full">Mark all as read</Button>
            </div>
        </div>
    );
};


// Wallet Modal
interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    isConnected: boolean;
    walletAddress: string | null;
    onConnect: () => void;
    onDisconnect: () => void;
}
export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, isConnected, walletAddress, onConnect, onDisconnect }) => {
    const shortenedAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isConnected ? "Wallet Connected" : "Connect Wallet"}>
            <div className="text-center space-y-4">
                {isConnected ? (
                    <>
                        <p className="text-gray-600 dark:text-gray-300">Your wallet is successfully connected.</p>
                        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                            <p className="font-mono text-gray-800 dark:text-gray-200">{shortenedAddress}</p>
                        </div>
                         <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Token Balance</p>
                            <p className="font-bold text-lg text-blue-600 dark:text-blue-400">12.5 REA Tokens</p>
                            <div className="mt-1 flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600 dark:text-green-400">Live on Sui Network</span>
                            </div>
                        </div>
                        <Button variant="danger" onClick={onDisconnect} className="w-full">Disconnect</Button>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 dark:text-gray-300">Connect with MetaMask or Sui Wallet to continue.</p>
                        <Button onClick={onConnect} className="w-full">
                            Connect Wallet
                        </Button>
                    </>
                )}
            </div>
        </Modal>
    );
};


// Chart Components
export const MeetingsLineChart = ({ data }: { data: any[] }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-80">
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Meetings Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fill: 'rgb(107 114 128)' }} />
                <YAxis tick={{ fill: 'rgb(107 114 128)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', color: 'white' }} />
                <Legend />
                <Line type="monotone" dataKey="meetings" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export const AgentBarChart = ({ data }: { data: any[] }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-80">
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Agent Performance</h3>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis type="number" tick={{ fill: 'rgb(107 114 128)' }}/>
                <YAxis dataKey="name" type="category" tick={{ fill: 'rgb(107 114 128)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', color: 'white' }} />
                <Bar dataKey="meetings" fill="#3b82f6" background={{ fill: '#eee' }} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const OutcomePieChart = ({ data }: { data: any[] }) => {
    const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f97316'];
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-80">
            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Meeting Outcome Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label>
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', color: 'white' }} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// LeadCard Component
interface LeadCardProps { lead: Lead; }
export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'hot': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
            case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
            case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'low': return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
            default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };

    const getScoreColor = (score?: number) => {
        if (!score) return 'text-gray-500';
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${getPriorityColor(lead.priority)}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white">{lead.name}</h3>
                {lead.score && (
                    <div className={`text-sm font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{lead.source}</p>

            {lead.priority === 'hot' && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 mb-2">
                    🔥 Hot Lead
                </div>
            )}

            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <p>Last Contact: {lead.lastContacted.toLocaleDateString()}</p>
                {lead.budget && <p>Budget: ${lead.budget.toLocaleString()}</p>}
                {lead.timeline && <p>Timeline: {lead.timeline}</p>}
            </div>

            {lead.aiInsights && lead.aiInsights.length > 0 && (
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">AI Insight:</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{lead.aiInsights[0]}</p>
                </div>
            )}

            <div className="mt-3 flex justify-between items-center">
                <img src={`https://i.pravatar.cc/24?u=${lead.email}`} alt={lead.assignedTo} className="w-6 h-6 rounded-full" title={`Assigned to ${lead.assignedTo}`} />
                <button className="text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors">
                    <IconMessageCircle />
                </button>
            </div>
        </div>
    );
};

// PropertyCard Component
interface PropertyCardProps {
     property: Property;
     onEdit: (property: Property) => void;
     onDelete: (property: Property) => void;
}
export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
     const [isPlaying, setIsPlaying] = useState(false);
     const videoRef = useRef<HTMLVideoElement>(null);

     // Get the primary image - prefer uploaded images, fallback to imageUrl
     // Only use imageUrl if no images array exists OR if images array is empty
     const primaryImage = (property.images && property.images.length > 0)
       ? property.images[0].url
       : property.imageUrl;

    const hasVideo = property.images && property.images.some(img => img.type === 'video');
    const videoFile = property.images?.find(img => img.type === 'video');

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative">
                {primaryImage ? (
                    hasVideo && videoFile ? (
                        <div className="relative w-full h-48 overflow-hidden">
                            <video
                                ref={videoRef}
                                src={videoFile.url}
                                className="w-full h-full object-cover"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={() => setIsPlaying(false)}
                                poster={primaryImage}
                                controls={isPlaying}
                                preload="metadata"
                            />
                            {!isPlaying && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/10 transition-colors"
                                    onClick={handleVideoClick}
                                >
                                    <div className="bg-black/60 rounded-full p-4 hover:bg-black/70 transition-colors">
                                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    </div>
                                </div>
                            )}
                            {isPlaying && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {/* Optional: Add custom controls overlay */}
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                Video Tour
                            </div>
                        </div>
                    ) : (
                        <img src={primaryImage} alt={property.address} className="w-full h-48 object-cover" />
                    )
                ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
                    </div>
                )}

                {/* Media count indicator */}
                {property.images && property.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        +{property.images.length - 1} more
                    </div>
                )}

                {/* Video indicator for non-video primary images */}
                {hasVideo && !videoFile && (
                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        Has Video
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">${property.price.toLocaleString()}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{property.address}</p>
                <div className="mt-2 flex space-x-4 text-sm text-gray-500 dark:text-gray-300">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.sqft} sqft</span>
                </div>
                {property.yearBuilt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Built in {property.yearBuilt}</p>
                )}
                {property.features && property.features.length > 0 && (
                    <div className="mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Features:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {property.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                                    {feature}
                                </span>
                            ))}
                            {property.features.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">+{property.features.length - 3} more</span>
                            )}
                        </div>
                    </div>
                )}
                {property.pricePerSqft && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">${property.pricePerSqft}/sqft</p>
                )}
            </div>
            <div className="px-4 pb-4 flex justify-end space-x-2">
                <Button onClick={() => onEdit(property)} variant="secondary" className="text-sm py-1 px-3"><IconEdit /> Edit</Button>
                <Button onClick={() => onDelete(property)} variant="danger" className="text-sm py-1 px-3 !bg-red-100 !text-red-700 hover:!bg-red-200 dark:!bg-red-900/50 dark:!text-red-300 dark:hover:!bg-red-900"><IconTrash /> Delete</Button>
            </div>
        </div>
    );
};

// AddEditPropertyModal Component
interface AddEditPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: Property | null;
    onSave?: (propertyData: any) => Promise<void>;
}
export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({ isOpen, onClose, property, onSave }) => {
    const [selectedImage, setSelectedImage] = useState(property?.imageUrl || MOCK_PROPERTY_IMAGES[0]);
    const [uploadedFiles, setUploadedFiles] = useState<PropertyFile[]>(property?.images || []);
    const [features, setFeatures] = useState<string[]>(property?.features || []);
    const [newFeature, setNewFeature] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedImage(property?.imageUrl || MOCK_PROPERTY_IMAGES[0]);
            setUploadedFiles(property?.images || []);
            setFeatures(property?.features || []);
            setNewFeature('');
            setUploadProgress(0);
            setIsSaving(false);
        } else {
            // Clean up blob URLs when modal closes
            uploadedFiles.forEach(file => {
                URL.revokeObjectURL(file.url);
            });
        }
    }, [isOpen, property]);

    const addFeature = () => {
        if (newFeature.trim() && !features.includes(newFeature.trim())) {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const removeFeature = (featureToRemove: string) => {
        setFeatures(features.filter(f => f !== featureToRemove));
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        try {
            // Validate file types and sizes
            const validFiles: File[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if ((file.type.startsWith('image/') || file.type.startsWith('video/')) && file.size <= 50 * 1024 * 1024) {
                    validFiles.push(file);
                } else if (file.size > 50 * 1024 * 1024) {
                    alert(`File "${file.name}" is too large. Maximum size is 50MB.`);
                } else {
                    alert(`File "${file.name}" is not a supported format. Please use images or videos.`);
                }
            }

            if (validFiles.length === 0) {
                return;
            }

            // For both new and existing properties, just add to local state with blob URLs for preview
            // The actual upload to Cloudinary will happen when the form is saved
            setUploadedFiles(prev => [...prev, ...validFiles.map(f => ({
                url: URL.createObjectURL(f),
                type: f.type.startsWith('video/') ? 'video' as const : 'image' as const,
                filename: f.name,
                size: f.size
            }))]);
        } catch (error) {
            console.error('File upload error:', error);
            alert('Failed to process uploaded files. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const removeUploadedFile = (index: number) => {
        setUploadedFiles(prev => {
            const newFiles = prev.filter((_, i) => i !== index);
            // Clean up blob URL for removed file
            const removedFile = prev[index];
            if (removedFile) {
                URL.revokeObjectURL(removedFile.url);
            }
            return newFiles;
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={property ? "Edit Property" : "Add New Property"} size="lg">
            <div className="max-h-[80vh] overflow-y-auto">
                <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);

                    // Prepare property data - ensure required fields are present
                    const address = formData.get('address') as string;
                    const priceStr = formData.get('price') as string;
                    const price = parseFloat(priceStr);

                    if (!address || !address.trim()) {
                        alert('Address is required');
                        return;
                    }

                    if (!priceStr || isNaN(price) || price <= 0) {
                        alert('Valid price is required');
                        return;
                    }

                    // Check if we have uploaded files
                    if (uploadedFiles.length > 0) {
                        // Create FormData for file upload
                        const submitFormData = new FormData();

                        // Add property data as JSON string
                        const propertyData = {
                            address: address.trim(),
                            price: price,
                            bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : undefined,
                            bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : undefined,
                            sqft: formData.get('sqft') ? parseInt(formData.get('sqft') as string) : undefined,
                            yearBuilt: formData.get('yearBuilt') ? parseInt(formData.get('yearBuilt') as string) : undefined,
                            description: formData.get('description') as string || undefined,
                            propertyType: formData.get('propertyType') as Property['propertyType'] || 'House',
                            status: 'Available' as const,
                            features: features.length > 0 ? features : undefined
                        };

                        submitFormData.append('data', JSON.stringify(propertyData));

                        // Convert blob URLs to actual files and add to FormData
                        const filePromises = uploadedFiles.map(async (file, index) => {
                            try {
                                const response = await fetch(file.url);
                                const blob = await response.blob();
                                const actualFile = new File([blob], file.filename || `file_${index}`, {
                                    type: file.type === 'video' ? 'video/mp4' : 'image/jpeg'
                                });
                                submitFormData.append('files', actualFile);
                            } catch (error) {
                                console.error(`Failed to process file ${file.filename}:`, error);
                                // Continue with other files
                            }
                        });

                        // Wait for all file conversions to complete
                        await Promise.all(filePromises);

                        try {
                            setIsSaving(true);
                            setUploadProgress(50);

                            // Save the property with files
                            if (onSave) {
                                await onSave(submitFormData);
                            }

                            setUploadProgress(100);

                            // Clean up blob URLs to free memory
                            uploadedFiles.forEach(file => {
                                URL.revokeObjectURL(file.url);
                            });

                            alert('Property saved successfully with uploaded images!');
                            onClose();
                        } catch (error) {
                            console.error('Save failed:', error);
                            alert('Failed to save property. Please try again.');
                        } finally {
                            setIsSaving(false);
                            setUploadProgress(0);
                        }
                    } else {
                        // No files uploaded, use regular JSON submission
                        const propertyData = {
                            address: address.trim(),
                            price: price,
                            bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : undefined,
                            bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : undefined,
                            sqft: formData.get('sqft') ? parseInt(formData.get('sqft') as string) : undefined,
                            yearBuilt: formData.get('yearBuilt') ? parseInt(formData.get('yearBuilt') as string) : undefined,
                            description: formData.get('description') as string || undefined,
                            images: selectedImage ? [{ url: selectedImage, type: 'image' as const }] : [],
                            propertyType: formData.get('propertyType') as Property['propertyType'] || 'House',
                            status: 'Available' as const,
                            features: features.length > 0 ? features : undefined
                        };

                        try {
                            setIsSaving(true);

                            // Save the property without files
                            if (onSave) {
                                await onSave(propertyData);
                            }

                            alert('Property saved successfully!');
                            onClose();
                        } catch (error) {
                            console.error('Save failed:', error);
                            alert('Failed to save property. Please try again.');
                        } finally {
                            setIsSaving(false);
                        }
                    }
                }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Images & Videos</label>

                        {/* Display uploaded files */}
                        {uploadedFiles.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Uploaded Files Preview:</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index} className="relative group">
                                            {file.type === 'video' ? (
                                                <div className="relative w-full h-20 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden cursor-pointer" onClick={() => {
                                                    // Create a modal or expanded view for video playback
                                                    const modal = document.createElement('div');
                                                    modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
                                                    modal.innerHTML = `
                                                        <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
                                                            <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                                                                <h3 class="text-lg font-semibold dark:text-white">${file.filename || 'Video Preview'}</h3>
                                                                <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-2xl" onclick="this.closest('.fixed').remove()">&times;</button>
                                                            </div>
                                                            <div class="p-4">
                                                                <video src="${file.url}" controls class="w-full max-h-[60vh] object-contain" style="max-height: 60vh;"></video>
                                                            </div>
                                                        </div>
                                                    `;
                                                    document.body.appendChild(modal);
                                                    modal.addEventListener('click', (e) => {
                                                        if (e.target === modal) modal.remove();
                                                    });
                                                }}>
                                                    <video
                                                        src={file.url}
                                                        className="w-full h-full object-cover"
                                                        controls={false}
                                                        muted
                                                        preload="metadata"
                                                        onLoadedData={(e) => {
                                                            const video = e.target as HTMLVideoElement;
                                                            // Simple approach: just show the video poster or first frame
                                                            video.currentTime = 0.1; // Very short time for thumbnail
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                        <div className="bg-black/60 rounded-full p-3">
                                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                        Video • Click to play
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={file.url}
                                                    alt={file.filename}
                                                    className="w-full h-20 object-cover rounded-md"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeUploadedFile(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                            {file.type === 'image' && (
                                                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                                                    {file.type}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File upload section */}
                        <div className="mb-4">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                multiple
                                accept="image/*,video/*"
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full"
                            >
                                {isUploading ? <Spinner /> : <><IconUpload /> Upload Images/Videos</>}
                            </Button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Max 20 files, 50MB each. Supported: JPG, PNG, GIF, MP4, MOV
                            </p>
                        </div>

                        {/* Fallback image selection */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Or choose from presets:</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {MOCK_PROPERTY_IMAGES.map((img, index) => (
                                    <motion.img
                                        key={index}
                                        src={img}
                                        alt={`Property option ${index + 1}`}
                                        className={`w-full h-16 object-cover rounded-md cursor-pointer hover:opacity-75 transition-all duration-200 ring-2 ring-offset-2 dark:ring-offset-gray-800 ${selectedImage === img ? 'ring-blue-500' : 'ring-transparent hover:ring-blue-400'}`}
                                        onClick={() => setSelectedImage(img)}
                                        aria-label={`Select image ${index + 1}`}
                                        role="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                        <input type="text" name="address" defaultValue={property?.address} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                            <input type="number" name="price" defaultValue={property?.price} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sqft</label>
                            <input type="number" name="sqft" defaultValue={property?.sqft} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms</label>
                            <input type="number" name="bedrooms" defaultValue={property?.bedrooms} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bathrooms</label>
                            <input type="number" name="bathrooms" defaultValue={property?.bathrooms} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year Built</label>
                            <input type="number" name="yearBuilt" defaultValue={property?.yearBuilt} min="1800" max={new Date().getFullYear() + 1} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Type</label>
                            <select name="propertyType" defaultValue={property?.propertyType || 'House'} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="House">House</option>
                                <option value="Condo">Condo</option>
                                <option value="Townhouse">Townhouse</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Land">Land</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                placeholder="Add a feature..."
                                className="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button type="button" onClick={addFeature} variant="secondary" className="px-3">Add</Button>
                        </div>
                        {features.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {features.map((feature, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm">
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(feature)}
                                            className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
                        <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Spinner className="w-4 h-4 mr-2" />
                                    {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                                </>
                            ) : (
                                'Save Property'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

// ChatWidget Component
interface ChatWidgetProps {
    isOpen: boolean;
    onToggle: () => void;
    conversations: ChatConversation[];
}
export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle, conversations }) => {
    const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(conversations[0] || null);
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = () => {
        if (messageText.trim() && activeConversation) {
            // Simulate sending message
            setIsTyping(true);
            setTimeout(() => {
                setMessageText('');
                setIsTyping(false);
                // In a real app, this would send to backend
            }, 1000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="bg-white dark:bg-gray-800 rounded-t-lg shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200 dark:border-gray-700 mb-4"
                >
                    <header className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg dark:text-white">Live Chat</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {activeConversation ? `Chatting with ${activeConversation.contactName}` : 'Select a conversation'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-500">Online</span>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto">
                        {activeConversation ? (
                              <div className="p-4 h-full flex flex-col">
                                <div className="flex-1 space-y-4">
                                    {activeConversation.messages.map(msg => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.sender === 'agent' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                                <div className="mt-4 flex">
                                    <input
                                        type="text"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!messageText.trim() || isTyping}
                                        className="!rounded-l-none"
                                    >
                                        Send
                                    </Button>
                                </div>
                              </div>
                        ) : (
                              <div className="p-4">
                                <div className="text-center py-8">
                                    <IconMessageCircle />
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">No active conversations</p>
                                    <p className="text-sm text-gray-400">Start a new conversation or select from recent chats</p>
                                </div>
                                {conversations.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Conversations</h4>
                                        {conversations.map(conv => (
                                            <motion.div
                                                key={conv.id}
                                                onClick={() => setActiveConversation(conv)}
                                                className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center mb-2"
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{conv.contactName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{conv.messages[conv.messages.length - 1].text}</p>
                                                </div>
                                                {conv.unread > 0 && (
                                                    <span className="text-xs bg-blue-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
            <motion.button
                onClick={onToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 relative"
                aria-label="Toggle Chat"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? <IconClose /> : <IconMessageCircle />}
                {!isOpen && conversations.some(c => c.unread > 0) && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversations.reduce((sum, c) => sum + c.unread, 0)}
                    </span>
                )}
            </motion.button>
        </div>
    );
};