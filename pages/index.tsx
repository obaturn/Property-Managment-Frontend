import React, { useState, useEffect, useRef } from 'react';
// Fix: Import Variants type from framer-motion to resolve type error.
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { Meeting, Lead, Property } from '../types';
import { Page, MeetingStatus, LeadStatus, Agent } from '../types';
import { MOCK_MEETINGS, MOCK_ANALYTICS_DATA, MOCK_LEADS, MOCK_PROPERTIES, MOCK_CONVERSATIONS, MOCK_AGENTS } from '../constants';
import {
    StatCard,
    MeetingsLineChart,
    AgentBarChart,
    OutcomePieChart,
    MeetingCard,
    ToggleSwitch,
    Button,
    Modal,
    ConfirmationModal,
    getStatusClasses,
    IconCalendar,
    IconList,
    IconTrophy,
    IconExternalLink,
    IconMeetings,
    IconDashboard,
    IconAnalytics,
    RealtyFlowLogo,
    IconLogo,
    Spinner,
    IconCalendarCheck,
    IconUsers,
    IconBuilding,
    LeadCard,
    PropertyCard,
    AddEditPropertyModal,
    IconPlus,
    IconUpload,
    IconBell,
    IconWallet,
    IconSettings
} from '../components/index';

// Landing Page
interface LandingPageProps {
    onNavigateToLogin: (page?: string) => void;
}
export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
    
    // Fix: Add explicit Variants type to ensure correct type inference for the 'ease' property.
    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };
    
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    const backgroundImages = [
        'https://images.unsplash.com/photo-1582417768959-22aebc905b2a?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop'
    ];
    
    const heroContent = [
        { title: "Streamline Your Real Estate Business", subtitle: "Manage properties, leads, and schedule meetings effortlessly. Boost your productivity and close more deals." },
        { title: "Intelligent Lead Management", subtitle: "Capture, nurture, and convert leads with our powerful, automated tools. Never miss an opportunity." },
        { title: "Effortless Meeting Scheduling", subtitle: "Sync your calendar and let clients book meetings in seconds. Say goodbye to back-and-forth emails." },
        { title: "Data-Driven Insights & Analytics", subtitle: "Track your performance, understand market trends, and make smarter decisions with our comprehensive analytics dashboard." }
    ];

    const colorPalette = ['#0f172a', '#1e1b4b', '#164e63', '#4b5563'];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bgColor, setBgColor] = useState(colorPalette[0]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [backgroundImages.length, isHovered]);

    // Update upcoming reminders - this will be in the MeetingsPage component

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
    };


    return (
        <div className="bg-white font-sans text-gray-800">
            {/* Header */}
            <header className="container mx-auto px-6 py-4 flex justify-between items-center bg-white border-b border-gray-200">
                <RealtyFlowLogo className="text-red-500" />
                <button onClick={onNavigateToLogin} className="text-blue-600 font-semibold hover:text-blue-800 transition">Sign In</button>
            </header>

            {/* Hero Section */}
            <section className="relative text-white py-32 px-6 overflow-hidden" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        className="absolute inset-0 bg-cover bg-center cursor-pointer"
                        style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setCurrentImageIndex((currentImageIndex + 1) % backgroundImages.length)}
                    />
                </AnimatePresence>

                {/* Interactive Overlay Elements */}
                <motion.div
                    className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-32 right-16 w-16 h-16 bg-purple-500/20 rounded-full blur-lg"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div
                    className="absolute top-1/2 right-1/4 w-12 h-12 bg-green-500/20 rounded-full blur-md"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
                
                <motion.div 
                    className="absolute inset-0"
                    animate={{ backgroundColor: bgColor }}
                    transition={{ duration: 1.0, ease: 'easeInOut' }}
                    style={{ opacity: 0.6 }}
                />
                
                <div className="relative container mx-auto text-center max-w-4xl h-48 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={`title-${currentImageIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            className="text-4xl md:text-6xl font-extrabold leading-tight mb-4"
                        >
                            {heroContent[currentImageIndex].title}
                        </motion.h1>
                    </AnimatePresence>
                     <AnimatePresence mode="wait">
                        <motion.p 
                            key={`subtitle-${currentImageIndex}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: 'easeInOut' }}
                            className="text-lg md:text-xl text-gray-200 mb-8">
                            {heroContent[currentImageIndex].subtitle}
                        </motion.p>
                    </AnimatePresence>
                </div>
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative text-center mt-8"
                >
                    <Button onClick={() => onNavigateToLogin('signup')} className="!text-lg !py-3 !px-8 transform hover:scale-105">
                        Get Started
                    </Button>
                </motion.div>

                {/* Interactive Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-6 p-4 bg-black/20 rounded-full backdrop-blur-sm">
                    {/* Background Color Picker */}
                    <div className="flex space-x-3">
                        {colorPalette.map(color => (
                            <motion.div
                                key={color}
                                onClick={() => setBgColor(color)}
                                style={{ backgroundColor: color }}
                                className="w-6 h-6 rounded-full cursor-pointer border-2 border-white/50"
                                whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
                                animate={{ scale: bgColor === color ? 1.25 : 1, boxShadow: bgColor === color ? '0 0 0 2px rgba(255, 255, 255, 0.9)' : '0 0 0 0px rgba(255, 255, 255, 0)' }}
                            />
                        ))}
                    </div>

                    {/* Separator */}
                    <div className="w-px h-8 bg-white/30"></div>

                    {/* Auto-play Toggle */}
                    <motion.button
                        onClick={() => setIsHovered(!isHovered)}
                        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isHovered ? (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Resume Auto</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Pause Auto</span>
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Enhanced Image Navigation */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center space-x-4 p-3 bg-black/10 rounded-full backdrop-blur-sm">
                    {/* Previous Button */}
                    <motion.button
                        onClick={() => setCurrentImageIndex((currentImageIndex - 1 + backgroundImages.length) % backgroundImages.length)}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>

                    {/* Image Dots */}
                    <div className="flex space-x-2">
                        {backgroundImages.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => handleImageClick(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                animate={{
                                    scale: currentImageIndex === index ? 1.2 : 1,
                                    backgroundColor: currentImageIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'
                                }}
                            />
                        ))}
                    </div>

                    {/* Next Button */}
                    <motion.button
                        onClick={() => setCurrentImageIndex((currentImageIndex + 1) % backgroundImages.length)}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </div>
            </section>

            {/* Key Features Section */}
            <motion.section
                className="py-20 bg-gray-50"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container mx-auto px-6 text-center">
                    <motion.h2
                        className="text-3xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Key Features
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        RealtyFlow offers a comprehensive suite of tools designed to simplify your workflow and enhance your efficiency.
                    </motion.p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                        <motion.div
                            variants={cardVariants}
                            className="bg-white p-8 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentImageIndex(2)} // Navigate to property-related image
                        >
                              <div className="bg-blue-100 text-blue-500 rounded-lg inline-flex p-3 mb-4">
                                 <IconBuilding />
                             </div>
                             <h3 className="text-xl font-bold mb-2">Property Management</h3>
                             <p className="text-gray-600">Easily list and manage your properties with detailed information and high-quality images.</p>
                         </motion.div>
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentImageIndex(1)} // Navigate to lead-related image
                        >
                              <div className="bg-blue-100 text-blue-500 rounded-lg inline-flex p-3 mb-4">
                                 <IconUsers />
                             </div>
                             <h3 className="text-xl font-bold mb-2">Lead Management</h3>
                             <p className="text-gray-600">Track and nurture your leads with automated follow-ups and personalized communication.</p>
                         </motion.div>
                         <motion.div
                             variants={cardVariants}
                             initial="hidden"
                             whileInView="visible"
                             viewport={{ once: true, amount: 0.5 }}
                             transition={{ delay: 0.4 }}
                             className="bg-white p-8 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                             whileHover={{ scale: 1.05, y: -10 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => setCurrentImageIndex(3)} // Navigate to meeting-related image
                         >
                             <div className="bg-blue-100 text-blue-500 rounded-lg inline-flex p-3 mb-4">
                                <IconCalendarCheck />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Meeting Scheduling</h3>
                            <p className="text-gray-600">Schedule and manage client meetings with integrated calendar and automated reminders.</p>
                         </motion.div>
                         <motion.div
                             variants={cardVariants}
                             initial="hidden"
                             whileInView="visible"
                             viewport={{ once: true, amount: 0.5 }}
                             transition={{ delay: 0.1 }}
                             className="bg-white p-8 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                             whileHover={{ scale: 1.05, y: -10 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => setCurrentImageIndex(0)} // Navigate to analytics-related image
                         >
                             <div className="bg-blue-100 text-blue-500 rounded-lg inline-flex p-3 mb-4">
                                <IconAnalytics className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                            <p className="text-gray-600">Gain data-driven insights to track performance and make smarter business decisions.</p>
                         </motion.div>
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-8 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentImageIndex(1)} // Navigate to notification-related image
                        >
                              <div className="bg-blue-100 text-blue-500 rounded-lg inline-flex p-3 mb-4">
                                 <IconBell className="h-8 w-8" />
                             </div>
                             <h3 className="text-xl font-bold mb-2">Real-time Notifications</h3>
                             <p className="text-gray-600">Stay instantly updated on new leads, meeting changes, and system alerts.</p>
                         </motion.div>
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white p-8 rounded-lg shadow-md border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentImageIndex(3)} // Navigate to web3-related image
                        >
                              <div className="bg-blue-100 text-blue-500 rounded-lg inline-flex p-3 mb-4">
                                 <IconWallet className="h-8 w-8" />
                             </div>
                             <h3 className="text-xl font-bold mb-2">Web3 Integration</h3>
                             <p className="text-gray-600">Optionally connect a crypto wallet for secure identity or tokenized rewards.</p>
                         </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {/* Animated Background Elements */}
                <motion.div
                    className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />

                <div className="container mx-auto px-6 text-center relative z-10">
                      <motion.h2
                          className="text-3xl font-bold mb-4 text-gray-800"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6 }}
                      >
                        Ready to Transform Your Real Estate Business?
                      </motion.h2>
                      <motion.p
                          className="text-gray-600 max-w-2xl mx-auto mb-8"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        Join RealtyFlow today and experience the future of real estate management.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Button onClick={onNavigateToLogin} className="!text-lg !py-3 !px-8 transform hover:scale-105 !bg-blue-600 hover:!bg-blue-700">
                            Sign Up Now
                        </Button>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                    <motion.div
                        className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                <div className="container mx-auto px-6 py-12 text-center relative z-10">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <RealtyFlowLogo className="justify-center mb-4" />
                        <p className="text-gray-400 max-w-md mx-auto">
                            Streamlining real estate workflows with intelligent automation and seamless collaboration.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex justify-center space-x-8 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
                    </motion.div>

                    <motion.div
                        className="border-t border-gray-800 pt-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <p className="text-gray-300">&copy; {new Date().getFullYear()} RealtyFlow. All rights reserved.</p>
                        <div className="flex justify-center space-x-6 mt-4">
                            <motion.a
                                href="#"
                                className="text-gray-500 hover:text-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#"
                                className="text-gray-500 hover:text-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#"
                                className="text-gray-500 hover:text-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
};


// Login Page
interface LoginPageProps {
    onLogin: () => void;
    onWalletLogin: () => void;
    isLoading: boolean;
    onSwitchToSignup?: () => void;
}
export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onWalletLogin, isLoading, onSwitchToSignup }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-[length:200%_200%] animate-gradient-pan">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-8 text-white">
                <div className="text-center mb-8">
                    <RealtyFlowLogo className="justify-center mb-4" />
                    <p className="text-gray-300">Book Smart. Close Faster.</p>
                </div>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" defaultValue="john.doe@realty.com" className="mt-1 block w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"/>
                    </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input type="password" defaultValue="••••••••" className="mt-1 block w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    </div>
                    <Button onClick={onLogin} type="button" className="w-full" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Login'}
                    </Button>
                </form>

                {/* Google Sign In Button */}
                <div className="mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full !bg-white !text-gray-800 hover:!bg-gray-50 flex items-center justify-center space-x-2"
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Continue with Google</span>
                    </Button>
                </div>

                <div className="my-6 flex items-center justify-center">
                    <span className="h-px bg-white/20 flex-1"></span>
                    <span className="px-4 text-sm text-gray-300">OR</span>
                    <span className="h-px bg-white/20 flex-1"></span>
                </div>
                <Button onClick={onWalletLogin} type="button" variant="secondary" className="w-full !bg-white/80 !text-gray-800 hover:!bg-white" disabled={isLoading}>Login with Wallet</Button>

                {/* Switch to Signup */}
                <div className="mt-6 text-center">
                    <p className="text-gray-300 text-sm">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignup}
                            className="text-blue-400 hover:text-blue-300 font-medium underline"
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Sign Up Page
interface SignupPageProps {
    onSignup: () => void;
    onWalletSignup: () => void;
    isLoading: boolean;
    onSwitchToLogin?: () => void;
}
export const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onWalletSignup, isLoading, onSwitchToLogin }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-[length:200%_200%] animate-gradient-pan">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-8 text-white">
                <div className="text-center mb-8">
                    <RealtyFlowLogo className="justify-center mb-4" />
                    <p className="text-gray-300">Join RealtyFlow Today</p>
                </div>
                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">First Name</label>
                            <input type="text" defaultValue="John" className="mt-1 block w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Last Name</label>
                            <input type="text" defaultValue="Doe" className="mt-1 block w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" defaultValue="john.doe@realty.com" className="mt-1 block w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Phone</label>
                        <input type="tel" defaultValue="+1 (555) 123-4567" className="mt-1 block w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input type="password" defaultValue="••••••••" className="mt-1 block w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                        <input type="password" defaultValue="••••••••" className="mt-1 block w-full bg-white/20 border border-white/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    </div>
                    <Button onClick={onSignup} type="button" className="w-full" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Create Account'}
                    </Button>
                </form>

                {/* Google Sign Up Button */}
                <div className="mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full !bg-white !text-gray-800 hover:!bg-gray-50 flex items-center justify-center space-x-2"
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Sign up with Google</span>
                    </Button>
                </div>

                <div className="my-6 flex items-center justify-center">
                    <span className="h-px bg-white/20 flex-1"></span>
                    <span className="px-4 text-sm text-gray-300">OR</span>
                    <span className="h-px bg-white/20 flex-1"></span>
                </div>
                <Button onClick={onWalletSignup} type="button" variant="secondary" className="w-full !bg-white/80 !text-gray-800 hover:!bg-white" disabled={isLoading}>Sign up with Wallet</Button>

                {/* Switch to Login */}
                <div className="mt-6 text-center">
                    <p className="text-gray-300 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-blue-400 hover:text-blue-300 font-medium underline"
                        >
                            Log in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Dashboard Page
export const DashboardPage: React.FC = () => {
    const upcomingMeetings = MOCK_MEETINGS.filter(m => new Date(m.dateTime) > new Date()).length;
    return (
        <div className="p-4 md:p-8 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Good afternoon, John 👋</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 <StatCard title="Total Meetings Today" value="5" change="+2 from yesterday" icon={<IconMeetings />} />
                 <StatCard title="Upcoming Meetings" value={`${upcomingMeetings}`} icon={<IconCalendar />} />
                 <StatCard title="New Leads This Week" value="12" change="+5.4%" icon={<IconDashboard />} />
                 <motion.div
                     className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
                     whileHover={{ scale: 1.02 }}
                     onClick={() => {/* Could open a detailed rewards modal */}}
                 >
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-2 md:p-3 rounded-full shadow-lg">
                       <IconTrophy className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Web3 Rewards Earned</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">32 REA Tokens</p>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-1">
                            <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded-full w-fit">
                                +5 this week
                            </span>
                            <motion.a
                                href="#"
                                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 flex items-center space-x-1"
                                whileHover={{ x: 2 }}
                            >
                                <span>View on Blockchain</span>
                                <IconExternalLink className="h-3 w-3" />
                            </motion.a>
                        </div>
                    </div>
                    <motion.div
                        className="text-right hidden sm:block"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="text-xs text-gray-400">Level</div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">Gold</div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <MeetingsLineChart data={MOCK_ANALYTICS_DATA.meetingsOverTime.slice(0,4)} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Recent Messages</h3>
                    <div className="space-y-4">
                        {MOCK_CONVERSATIONS.slice(0, 4).map(conv => (
                            <div key={conv.id} className="flex justify-between items-center text-sm p-2 -m-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer">
                                <div>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">{conv.contactName}</p>
                                    <p className="text-gray-500 dark:text-gray-400 truncate w-48">{conv.messages[conv.messages.length - 1].text}</p>
                                </div>
                                {conv.unread > 0 && <span className="text-xs bg-blue-500 text-white font-bold rounded-full h-5 w-5 flex items-center justify-center">{conv.unread}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Upcoming Meetings</h3>
                <div className="space-y-4">
                    {MOCK_MEETINGS.filter(m => new Date(m.dateTime) > new Date()).slice(0, 4).map(meeting => (
                         <div key={meeting.id} className="flex justify-between items-center text-sm">
                             <div>
                                 <p className="font-semibold text-gray-700 dark:text-gray-300">{meeting.leadName}</p>
                                 <p className="text-gray-500 dark:text-gray-400">{meeting.propertyAddress.substring(0,30)}...</p>
                             </div>
                             <p className="text-gray-600 dark:text-gray-300">{meeting.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    );
};

// Meetings Page
type FilterStatus = 'All' | MeetingStatus;

const getStatusDotColor = (status: MeetingStatus) => {
    switch (status) {
        case MeetingStatus.Scheduled: return 'bg-blue-500';
        case MeetingStatus.Completed: return 'bg-green-500';
        case MeetingStatus.Missed: return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};

export const MeetingsPage: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
    const [view, setView] = useState<'list' | 'calendar' | 'week'>('list');
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [filter, setFilter] = useState<FilterStatus>('All');
    const [draggedMeetingId, setDraggedMeetingId] = useState<number | null>(null);
    const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [meetingToReschedule, setMeetingToReschedule] = useState<Meeting | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [upcomingReminders, setUpcomingReminders] = useState<Meeting[]>([]);

    const filters: FilterStatus[] = ['All', MeetingStatus.Scheduled, MeetingStatus.Completed, MeetingStatus.Missed];

    const filteredMeetings = meetings.filter(meeting => {
        if (filter === 'All') return true;
        return meeting.status === filter;
    });

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, meetingId: number) => {
        e.dataTransfer.setData('meetingId', meetingId.toString());
        setDraggedMeetingId(meetingId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, date: Date) => {
        e.preventDefault();
        setDragOverDate(date);
    };

    const handleDragLeave = () => {
        setDragOverDate(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newDate: Date) => {
        e.preventDefault();
        const meetingId = parseInt(e.dataTransfer.getData('meetingId'), 10);
        
        setMeetings(prevMeetings =>
            prevMeetings.map(m => {
                if (m.id === meetingId) {
                    // Preserve original time, change the date
                    const newDateTime = new Date(newDate);
                    newDateTime.setHours(m.dateTime.getHours());
                    newDateTime.setMinutes(m.dateTime.getMinutes());
                    return { ...m, dateTime: newDateTime };
                }
                return m;
            })
        );
        setDraggedMeetingId(null);
        setDragOverDate(null);
    };
    
    // Enhanced calendar generation logic
    const generateCalendarDays = (month: Date) => {
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        const startDate = new Date(startOfMonth);
        startDate.setDate(startDate.getDate() - startOfMonth.getDay());
        const days = [];
        for (let i = 0; i < 42; i++) {
            days.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
        return days;
    };

    const days = generateCalendarDays(currentMonth);
    const today = new Date();

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    const generateWeekDays = (month: Date) => {
        const startOfWeek = new Date(month);
        startOfWeek.setDate(month.getDate() - month.getDay());
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(new Date(startOfWeek));
            startOfWeek.setDate(startOfWeek.getDate() + 1);
        }
        return days;
    };

    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];

    const navigateWeek = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newWeek = new Date(prev);
            newWeek.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
            return newWeek;
        });
    };

    const handleViewDetails = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
    };

    const handleReschedule = (meeting: Meeting) => {
        setMeetingToReschedule(meeting);
        setIsRescheduleModalOpen(true);
    };

    const handleCancel = (meeting: Meeting) => {
        if (window.confirm(`Are you sure you want to cancel the meeting with ${meeting.leadName}?`)) {
            setMeetings(prev => prev.map(m =>
                m.id === meeting.id
                    ? { ...m, status: MeetingStatus.Missed }
                    : m
            ));
        }
    };

    const handleStatusUpdate = (meetingId: number, newStatus: MeetingStatus) => {
        setMeetings(prev => prev.map(m =>
            m.id === meetingId ? { ...m, status: newStatus } : m
        ));
    };

    const handleCreateMeeting = (newMeetingData: Partial<Meeting>) => {
        const newMeeting: Meeting = {
            id: Math.max(...meetings.map(m => m.id)) + 1,
            leadName: newMeetingData.leadName || 'New Lead',
            propertyAddress: newMeetingData.propertyAddress || 'TBD',
            dateTime: newMeetingData.dateTime || new Date(),
            status: MeetingStatus.Scheduled
        };
        setMeetings(prev => [...prev, newMeeting]);
        setIsCreateModalOpen(false);
    };

    // Update upcoming reminders
    useEffect(() => {
        const now = new Date();
        const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const upcoming = meetings.filter(meeting =>
            meeting.status === MeetingStatus.Scheduled &&
            meeting.dateTime > now &&
            meeting.dateTime <= next24Hours
        );
        // For now, we'll just log reminders - could show notifications later
        if (upcoming.length > 0) {
            console.log('Upcoming meetings in next 24 hours:', upcoming);
        }
    }, [meetings]);
    
    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meetings</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage and view all scheduled meetings.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
                        <IconPlus className="h-4 w-4" />
                        New Meeting
                    </Button>
                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                        <button onClick={() => setView('list')} className={`px-3 py-1 text-sm font-semibold rounded-md transition flex items-center gap-2 ${view === 'list' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}><IconList/></button>
                        <button onClick={() => setView('calendar')} className={`px-3 py-1 text-sm font-semibold rounded-md transition flex items-center gap-2 ${view === 'calendar' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}><IconCalendar /></button>
                        <button onClick={() => setView('week')} className={`px-3 py-1 text-sm font-semibold rounded-md transition flex items-center gap-2 ${view === 'week' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>Week</button>
                    </div>
                </div>
            </div>

            {/* Meeting Creation Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Schedule New Meeting">
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleCreateMeeting({
                        leadName: formData.get('leadName') as string,
                        propertyAddress: formData.get('propertyAddress') as string,
                        dateTime: new Date(`${formData.get('date')}T${formData.get('time')}`)
                    });
                }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lead Name</label>
                        <select name="leadName" className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            <option value="">Select a lead...</option>
                            {MOCK_LEADS.map(lead => (
                                <option key={lead.id} value={lead.name}>{lead.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property</label>
                        <select name="propertyAddress" className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            <option value="">Select a property...</option>
                            {MOCK_PROPERTIES.map(property => (
                                <option key={property.id} value={property.address}>{property.address}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                            <input type="date" name="date" className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                            <input type="time" name="time" className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Schedule Meeting</Button>
                    </div>
                </form>
            </Modal>

            {/* Reschedule Meeting Modal */}
            <Modal isOpen={isRescheduleModalOpen} onClose={() => setIsRescheduleModalOpen(false)} title="Reschedule Meeting">
                {meetingToReschedule && (
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        const newDateTime = new Date(`${formData.get('date')}T${formData.get('time')}`);

                        setMeetings(prev => prev.map(m =>
                            m.id === meetingToReschedule.id
                                ? { ...m, dateTime: newDateTime }
                                : m
                        ));

                        setIsRescheduleModalOpen(false);
                        setMeetingToReschedule(null);
                    }}>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Lead:</strong> {meetingToReschedule.leadName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Property:</strong> {meetingToReschedule.propertyAddress}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Current:</strong> {meetingToReschedule.dateTime.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue={meetingToReschedule.dateTime.toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue={meetingToReschedule.dateTime.toTimeString().slice(0, 5)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-2">
                            <Button type="button" variant="secondary" onClick={() => setIsRescheduleModalOpen(false)}>Cancel</Button>
                            <Button type="submit">Reschedule Meeting</Button>
                        </div>
                    </form>
                )}
            </Modal>

            {view === 'list' && (
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                    {filters.map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-sm font-semibold rounded-md transition ${filter === f ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}

            {view === 'list' ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <AnimatePresence>
                         {filteredMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)}
                     </AnimatePresence>
                 </motion.div>
             ) : view === 'week' ? (
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                     <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-4">
                             <button onClick={() => navigateWeek('prev')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                 </svg>
                             </button>
                             <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                                 Week of {generateWeekDays(currentMonth)[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {generateWeekDays(currentMonth)[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                             </h2>
                             <button onClick={() => navigateWeek('next')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                 </svg>
                             </button>
                         </div>
                         <Button variant="secondary" onClick={goToToday} className="text-sm">This Week</Button>
                     </div>

                     <div className="grid grid-cols-8 gap-1">
                         {/* Time column header */}
                         <div className="p-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-sm">Time</div>
                         {/* Day headers */}
                         {generateWeekDays(currentMonth).map((day, index) => (
                             <div key={index} className={`p-2 text-center font-semibold text-sm ${
                                 day.toDateString() === new Date().toDateString()
                                     ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                     : 'text-gray-600 dark:text-gray-300'
                             }`}>
                                 <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                 <div className="text-xs">{day.getDate()}</div>
                             </div>
                         ))}

                         {/* Time slots */}
                         {timeSlots.map((time, timeIndex) => (
                             <React.Fragment key={time}>
                                 <div className="p-2 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                                     {time}
                                 </div>
                                 {generateWeekDays(currentMonth).map((day, dayIndex) => {
                                     const meetingsOnDayTime = meetings.filter(m =>
                                         m.dateTime.toDateString() === day.toDateString() &&
                                         m.dateTime.getHours() === (timeIndex + 9) // 9 AM = 9, 10 AM = 10, etc.
                                     );

                                     return (
                                         <div
                                             key={`${dayIndex}-${timeIndex}`}
                                             className="min-h-[60px] p-1 border-t border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                         >
                                             {meetingsOnDayTime.map(meeting => (
                                                 <motion.div
                                                     key={meeting.id}
                                                     className={`p-1 mb-1 rounded text-xs cursor-pointer ${
                                                         meeting.status === MeetingStatus.Scheduled
                                                             ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                                                             : meeting.status === MeetingStatus.Completed
                                                             ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                                                             : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                                                     }`}
                                                     whileHover={{ scale: 1.05 }}
                                                     onClick={() => setSelectedMeeting(meeting)}
                                                 >
                                                     <div className="font-semibold truncate">{meeting.leadName}</div>
                                                     <div className="text-xs opacity-75">{meeting.propertyAddress.substring(0, 20)}...</div>
                                                 </motion.div>
                                             ))}
                                         </div>
                                     );
                                 })}
                             </React.Fragment>
                         ))}
                     </div>
                 </div>
             ) : (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-4">
                             <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                 </svg>
                             </button>
                             <h2 className="font-bold text-lg text-gray-800 dark:text-white">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                             <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                 </svg>
                             </button>
                         </div>
                         <Button variant="secondary" onClick={goToToday} className="text-sm">Today</Button>
                     </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 mt-2">
                        {days.map((day, index) => {
                            const meetingsOnDay = meetings.filter(m => m.dateTime.toDateString() === day.toDateString());
                            const isDragOver = dragOverDate?.toDateString() === day.toDateString();
                            return (
                                <div 
                                    key={index}
                                    onDragOver={(e) => handleDragOver(e, day)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, day)}
                                    className={`h-28 rounded p-2 border overflow-y-auto transition-colors duration-200 ${day.getMonth() !== today.getMonth() ? 'bg-gray-50 dark:bg-gray-800/50' : ''} ${day.toDateString() === new Date().toDateString() ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'} ${isDragOver ? 'bg-blue-100 dark:bg-gray-700 ring-2 ring-blue-500' : ''}`}
                                >
                                    <span className={`font-semibold ${day.getMonth() !== today.getMonth() ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{day.getDate()}</span>
                                    <div className="mt-1 space-y-1">
                                        {meetingsOnDay.map(m => (
                                            <div
                                                key={m.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, m.id)}
                                                onClick={() => setSelectedMeeting(m)} 
                                                className={`text-xs p-1 rounded cursor-grab active:cursor-grabbing hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity ${draggedMeetingId === m.id ? 'opacity-50' : 'opacity-100'}`}
                                                title={`${m.leadName} - ${m.status}`}
                                            >
                                                <div className="flex items-center space-x-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusDotColor(m.status)}`}></span>
                                                    <span className="truncate font-medium text-gray-700 dark:text-gray-300">{m.leadName}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <Modal isOpen={!!selectedMeeting} onClose={() => setSelectedMeeting(null)} title="Meeting Details">
                {selectedMeeting && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead Name</p>
                            <p className="text-lg text-gray-900 dark:text-white">{selectedMeeting.leadName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Property Address</p>
                            <p className="text-lg text-gray-900 dark:text-white">{selectedMeeting.propertyAddress}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</p>
                            <p className="text-lg text-gray-900 dark:text-white">{selectedMeeting.dateTime.toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
                        </div>
                        <div>
                             <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                             <div className="flex items-center space-x-2">
                                 <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${getStatusClasses(selectedMeeting.status)}`}>
                                     {selectedMeeting.status}
                                 </span>
                                 <select
                                     value={selectedMeeting.status}
                                     onChange={(e) => handleStatusUpdate(selectedMeeting.id, e.target.value as MeetingStatus)}
                                     className="text-sm bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 >
                                     <option value={MeetingStatus.Scheduled}>Scheduled</option>
                                     <option value={MeetingStatus.Completed}>Completed</option>
                                     <option value={MeetingStatus.Missed}>Missed</option>
                                 </select>
                             </div>
                         </div>
                        <div className="pt-4 flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setSelectedMeeting(null)}>Close</Button>
                            <Button variant="danger" onClick={() => {
                                handleCancel(selectedMeeting);
                                setSelectedMeeting(null);
                            }}>Cancel Meeting</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// Leads Page
export const LeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
    const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);
    const [sortBy, setSortBy] = useState<'score' | 'date' | 'name'>('score');
    const [filterPriority, setFilterPriority] = useState<string>('all');

    const leadColumns = Object.values(LeadStatus);

    // Sort and filter leads
    const processedLeads = leads
        .filter(lead => filterPriority === 'all' || lead.priority === filterPriority)
        .sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return (b.score || 0) - (a.score || 0);
                case 'date':
                    return b.lastContacted.getTime() - a.lastContacted.getTime();
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lead: Lead) => {
        setDraggedLead(lead);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: LeadStatus) => {
        e.preventDefault();
        setDragOverColumn(status);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: LeadStatus) => {
        e.preventDefault();
        if (draggedLead && draggedLead.status !== newStatus) {
            setLeads(prevLeads =>
                prevLeads.map(lead =>
                    lead.id === draggedLead.id
                        ? { ...lead, status: newStatus }
                        : lead
                )
            );
        }
        setDraggedLead(null);
        setDragOverColumn(null);
    };

    const handleDragEnd = () => {
        setDraggedLead(null);
        setDragOverColumn(null);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI-Powered Lead Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track and nurture your leads with intelligent scoring and insights.</p>
                </div>

                {/* Filters and Sorting */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'score' | 'date' | 'name')}
                            className="text-sm bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="score">AI Score</option>
                            <option value="date">Last Contact</option>
                            <option value="name">Name</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</label>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="text-sm bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="hot">🔥 Hot Leads</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* AI Insights Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">Hot Leads</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {leads.filter(l => l.priority === 'hot').length}
                            </p>
                        </div>
                        <div className="text-red-500">🔥</div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Avg Score</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length)}
                            </p>
                        </div>
                        <div className="text-blue-500">🎯</div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-300">Conversion Rate</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {Math.round((leads.filter(l => l.status === LeadStatus.Closed).length / leads.length) * 100)}%
                            </p>
                        </div>
                        <div className="text-green-500">📈</div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Active Leads</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {leads.filter(l => l.status !== LeadStatus.Closed).length}
                            </p>
                        </div>
                        <div className="text-purple-500">⚡</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-x-auto space-x-4 p-2 -m-2">
                {leadColumns.map(status => (
                    <motion.div
                        key={status}
                        className={`bg-gray-100 dark:bg-gray-800/50 rounded-lg w-80 flex-shrink-0 flex flex-col transition-all duration-200 ${
                            dragOverColumn === status ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onDragOver={(e) => handleDragOver(e, status)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, status)}
                        animate={{ scale: dragOverColumn === status ? 1.02 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="font-bold p-4 text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                            {status} ({processedLeads.filter(l => l.status === status).length})
                        </h3>
                        <div className="p-2 space-y-2 overflow-y-auto min-h-0 flex-1">
                            <AnimatePresence>
                                {processedLeads.filter(lead => lead.status === status).map(lead => (
                                    <motion.div
                                        key={lead.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lead)}
                                        onDragEnd={handleDragEnd}
                                        className={`cursor-grab active:cursor-grabbing transition-opacity ${
                                            draggedLead?.id === lead.id ? 'opacity-50' : 'opacity-100'
                                        }`}
                                    >
                                        <LeadCard lead={lead} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Properties Page
export const PropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

    const handleEditProperty = (property: Property) => {
        setSelectedProperty(property);
        setIsModalOpen(true);
    };
    
    const handleAddNewProperty = () => {
        setSelectedProperty(null);
        setIsModalOpen(true);
    };
    
    const handleDeleteProperty = (property: Property) => {
        setPropertyToDelete(property);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteProperty = () => {
        if (propertyToDelete) {
            setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
        }
        setIsDeleteModalOpen(false);
        setPropertyToDelete(null);
    };


    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Properties</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your property listings.</p>
                </div>
                <Button onClick={handleAddNewProperty}><IconPlus /> Add New Property</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(prop => (
                    <PropertyCard 
                        key={prop.id} 
                        property={prop} 
                        onEdit={handleEditProperty}
                        onDelete={handleDeleteProperty}
                    />
                ))}
            </div>
            <AddEditPropertyModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                property={selectedProperty}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteProperty}
                title="Confirm Deletion"
            >
                Are you sure you want to delete the property at "{propertyToDelete?.address}"? This action cannot be undone.
            </ConfirmationModal>
        </div>
    );
};

// Analytics Page
export const AnalyticsPage: React.FC = () => {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400">Insights into your performance and system trends.</p>
                </div>
                <Button variant="secondary">Export CSV</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Meetings (Month)" value="81" change="+12% from last month" icon={<IconMeetings />} />
                <StatCard title="Conversion Rate" value="72%" change="+5.2% this quarter" icon={<IconDashboard />} />
                <StatCard title="Avg. Response Time" value="2.1h" change="-0.3h improvement" icon={<IconAnalytics />} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <MeetingsLineChart data={MOCK_ANALYTICS_DATA.meetingsOverTime} />
                </div>
                <div className="lg:col-span-2">
                    <AgentBarChart data={MOCK_ANALYTICS_DATA.agentPerformance} />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OutcomePieChart data={MOCK_ANALYTICS_DATA.meetingOutcomes} />
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Performance Insights</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Best Performing Day</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">Wednesday</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Peak Hours</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">2-4 PM</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Top Lead Source</span>
                            <span className="font-semibold text-purple-600 dark:text-purple-400">Zillow</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Admin Panel (Optional)
export const AdminPanel: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
    const [filter, setFilter] = useState<'all' | 'active' | 'top'>('all');

    const filteredAgents = agents.filter(agent => {
        if (filter === 'top') return agent.meetings >= 60;
        return true;
    });

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage agents and view system performance.</p>
                </div>
                <div className="flex space-x-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2"
                    >
                        <option value="all">All Agents</option>
                        <option value="active">Active Agents</option>
                        <option value="top">Top Performers</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Agents" value={agents.length.toString()} icon={<IconUsers />} />
                <StatCard title="Active Agents" value={agents.filter(a => a.meetings > 0).length.toString()} icon={<IconUsers />} />
                <StatCard title="Top Performer" value={agents.reduce((prev, current) => (prev.meetings > current.meetings) ? prev : current).name} icon={<IconTrophy />} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agent Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Meetings</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Performance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredAgents.map(agent => (
                                <tr key={agent.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                {agent.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{agent.meetings}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            agent.meetings >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            agent.meetings >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                            {agent.meetings >= 70 ? 'Excellent' : agent.meetings >= 50 ? 'Good' : 'Needs Improvement'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <Button variant="secondary" className="text-xs py-1 px-2">Edit</Button>
                                        <Button variant="danger" className="text-xs py-1 px-2">Remove</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Settings Page
export const SettingsPage: React.FC = () => {
    const [notifications, setNotifications] = useState({ email: true, sms: false, inApp: true });
    const [isNotifSettingsModalOpen, setIsNotifSettingsModalOpen] = useState(false);
    const [notifCategorySettings, setNotifCategorySettings] = useState({ 
        leads: true, 
        meetings: true, 
        system: true 
    });
    const [profileImage, setProfileImage] = useState('https://picsum.photos/128');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Personalize notifications and calendar preferences.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile</h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Upload new picture"
                        >
                            <IconUpload />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 w-full">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" defaultValue="John Doe" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Agency</label>
                            <input type="text" defaultValue="Prestige Realty" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                            <select className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Pacific Standard Time</option>
                                <option>Eastern Standard Time</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
                    <Button variant="secondary" className="text-sm py-1 px-3" onClick={() => setIsNotifSettingsModalOpen(true)}>Manage Categories</Button>
                </div>
                <ToggleSwitch label="Email Notifications" enabled={notifications.email} onChange={e => setNotifications(p => ({ ...p, email: e }))} />
                <ToggleSwitch label="SMS Notifications" enabled={notifications.sms} onChange={e => setNotifications(p => ({ ...p, sms: e }))} />
                <ToggleSwitch label="In-App Notifications" enabled={notifications.inApp} onChange={e => setNotifications(p => ({ ...p, inApp: e }))} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Integrations</h2>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <Button variant="secondary" className="w-full">Connect Google Calendar</Button>
                    <Button variant="secondary" className="w-full">Connect Outlook Calendar</Button>
                    <Button variant="secondary" className="w-full">Connect Wallet</Button>
                </div>
            </div>
             <div className="text-right">
                <Button>Save Changes</Button>
            </div>
            
            <Modal isOpen={isNotifSettingsModalOpen} onClose={() => setIsNotifSettingsModalOpen(false)} title="Notification Category Settings">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose which types of notifications you want to receive in-app.</p>
                    <ToggleSwitch 
                        label="Leads Notifications" 
                        enabled={notifCategorySettings.leads} 
                        onChange={e => setNotifCategorySettings(p => ({ ...p, leads: e }))} 
                    />
                    <ToggleSwitch 
                        label="Meetings Notifications" 
                        enabled={notifCategorySettings.meetings} 
                        onChange={e => setNotifCategorySettings(p => ({ ...p, meetings: e }))} 
                    />
                    <ToggleSwitch 
                        label="System Notifications" 
                        enabled={notifCategorySettings.system} 
                        onChange={e => setNotifCategorySettings(p => ({ ...p, system: e }))} 
                    />
                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => setIsNotifSettingsModalOpen(false)}>Done</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};