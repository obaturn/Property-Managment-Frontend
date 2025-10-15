import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page, type Notification, type ChatConversation } from './types';
import { NAV_ITEMS, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS } from './constants';
import { LandingPage, LoginPage, SignupPage, DashboardPage, MeetingsPage, LeadsPage, PropertiesPage, AnalyticsPage, SettingsPage, AdminPanel } from './pages/index';
import {
    IconLogo, IconDashboard, IconMeetings, IconAnalytics, IconSettings,
    IconBell, IconWallet, IconSun, IconMoon, IconChevronDown,
    IconLeads, IconProperties, IconUsers
} from './components/index';
import { NotificationPanel, WalletModal, ChatWidget } from './components/index';


// Custom hook for dark mode
const useDarkMode = (): [string, () => void] => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const colorTheme = theme === 'light' ? 'dark' : 'light';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(colorTheme);
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, colorTheme]);

  const toggleTheme = () => {
    setTheme(colorTheme);
  };

  return [theme, toggleTheme];
};

// Layout Components (defined within App.tsx to reduce file count)
interface SidebarProps {
    currentPage: Page;
    onNavClick: (page: Page) => void;
    isSidebarOpen: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavClick, isSidebarOpen }) => {
    const getIcon = (page: Page | string) => {
        switch (page) {
            case Page.Dashboard: return <IconDashboard />;
            case Page.Meetings: return <IconMeetings />;
            case Page.Leads: return <IconLeads />;
            case Page.Properties: return <IconProperties />;
            case Page.Analytics: return <IconAnalytics />;
            case Page.Settings: return <IconSettings />;
            case 'Admin': return <IconUsers />;
        }
    };
    return (
        <aside className={`absolute md:relative z-20 md:z-auto bg-white dark:bg-gray-800 md:dark:bg-gray-800/50 w-64 md:w-20 lg:w-64 h-full shadow-md md:shadow-none transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <IconLogo />
                <span className="font-bold text-xl text-blue-600 dark:text-blue-400 md:hidden lg:inline">RealtyFlow</span>
            </div>
            <nav className="p-4 space-y-2">
                {NAV_ITEMS.map(({ page, label }) => (
                    <button
                        key={page}
                        onClick={() => onNavClick(page)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                        {getIcon(page)}
                        <span className="font-semibold md:hidden lg:inline">{label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

interface HeaderProps {
    onToggleSidebar: () => void;
    onNotificationClick: () => void;
    onWalletClick: () => void;
    unreadCount: number;
    theme: string;
    toggleTheme: () => void;
    isUserDropdownOpen: boolean;
    setIsUserDropdownOpen: (open: boolean) => void;
}
const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNotificationClick, onWalletClick, unreadCount, theme, toggleTheme, isUserDropdownOpen, setIsUserDropdownOpen }) => (
    <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg sticky top-0 z-10 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <button onClick={onToggleSidebar} className="md:hidden text-gray-600 dark:text-gray-300">
             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'light' ? <IconMoon /> : <IconSun />}
            </button>
            <button onClick={onNotificationClick} className="relative text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <IconBell />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
            </button>
            <button onClick={onWalletClick} className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <IconWallet />
            </button>
            <div className="relative">
                <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                >
                    <img src="https://picsum.photos/40" alt="User" className="w-8 h-8 rounded-full" />
                    <div className="hidden md:block text-left">
                        <p className="font-semibold text-sm text-gray-800 dark:text-white">John Doe</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Agent</p>
                    </div>
                    <IconChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                    {isUserDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                        >
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                Profile Settings
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                Notifications
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                Help & Support
                            </a>
                            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                            <a href="#" className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                Sign Out
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Overlay to close dropdown */}
                {isUserDropdownOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserDropdownOpen(false)}
                    />
                )}
            </div>
        </div>
    </header>
);

type AppState = 'landing' | 'login' | 'signup' | 'dashboard';

// Main App Component
const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('landing');
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [theme, toggleTheme] = useDarkMode();

    const notifications: Notification[] = MOCK_NOTIFICATIONS;
    const conversations: ChatConversation[] = MOCK_CONVERSATIONS;
    const unreadCount = notifications.filter(n => n.unread).length;
    
    const handleLogin = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setAppState('dashboard');
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleWalletLogin = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsWalletConnected(true);
            setAppState('dashboard');
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleSignup = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setAppState('dashboard');
            setIsLoading(false);
        }, 1500);
    }, []);

    const handleWalletSignup = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsWalletConnected(true);
            setAppState('dashboard');
            setIsLoading(false);
        }, 1500);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case Page.Dashboard: return <DashboardPage />;
            case Page.Meetings: return <MeetingsPage />;
            case Page.Leads: return <LeadsPage />;
            case Page.Properties: return <PropertiesPage />;
            case Page.Analytics: return <AnalyticsPage />;
            case Page.Settings: return <SettingsPage />;
            case 'Admin': return <AdminPanel />;
            default: return <DashboardPage />;
        }
    };

    if (appState === 'landing') {
        return <LandingPage onNavigateToLogin={(page) => setAppState(page === 'signup' ? 'signup' : 'login')} />;
    }

    if (appState === 'login') {
        return <LoginPage
            onLogin={handleLogin}
            onWalletLogin={handleWalletLogin}
            isLoading={isLoading}
            onSwitchToSignup={() => setAppState('signup')}
        />;
    }

    if (appState === 'signup') {
        return <SignupPage
            onSignup={handleSignup}
            onWalletSignup={handleWalletSignup}
            isLoading={isLoading}
            onSwitchToLogin={() => setAppState('login')}
        />;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Sidebar currentPage={currentPage} onNavClick={setCurrentPage} isSidebarOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onNotificationClick={() => setIsNotifPanelOpen(true)}
                    onWalletClick={() => setIsWalletModalOpen(true)}
                    unreadCount={unreadCount}
                    theme={theme}
                    toggleTheme={toggleTheme}
                    isUserDropdownOpen={isUserDropdownOpen}
                    setIsUserDropdownOpen={setIsUserDropdownOpen}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
            <NotificationPanel notifications={notifications} isOpen={isNotifPanelOpen} onClose={() => setIsNotifPanelOpen(false)} />
            <WalletModal 
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                isConnected={isWalletConnected}
                walletAddress="0x1234...AbCd"
                onConnect={() => {setIsWalletConnected(true); setIsWalletModalOpen(false)}}
                onDisconnect={() => setIsWalletConnected(false)}
            />
            <ChatWidget
                isOpen={isChatOpen}
                onToggle={() => setIsChatOpen(prev => !prev)}
                conversations={conversations}
            />
        </div>
    );
};

export default App;
