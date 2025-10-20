import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Modal, Spinner } from './index';
import { Property } from '../types';

interface PropertyVisitFormProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

interface TimeSlot {
  start: Date;
  end: Date;
  agent: {
    id: string;
    name: string;
    email: string;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  preferredDateTime: string;
  timezone: string;
  budget: string;
  preferredPropertyType: string;
  timeline: string;
  notes: string;
}

const PropertyVisitForm: React.FC<PropertyVisitFormProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    preferredDateTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    budget: '',
    preferredPropertyType: property.propertyType || 'House',
    timeline: '',
    notes: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedSlot(null);
      setAvailableSlots([]);
      setError(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDateTime: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        budget: '',
        preferredPropertyType: property.propertyType || 'House',
        timeline: '',
        notes: ''
      });
    }
  }, [isOpen, property]);

  // Fetch available time slots when user provides preferred date
  const fetchAvailableSlots = async (date: string) => {
    if (!date) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'}/api/booking/available-slots?propertyId=${property._id}&date=${date}`
      );

      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.data);
      } else {
        setError(data.message || 'Failed to fetch available slots');
      }
    } catch (err) {
      setError('Failed to load available time slots');
      console.error('Error fetching slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-fetch slots when date changes
    if (field === 'preferredDateTime' && value) {
      fetchAvailableSlots(value);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setFormData(prev => ({
      ...prev,
      preferredDateTime: slot.start.toISOString()
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        ...formData,
        propertyId: property._id,
        preferredDateTime: selectedSlot.start.toISOString()
      };

      const response = await fetch(
        `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'}/api/booking/request-visit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData)
        }
      );

      const data = await response.json();

      if (data.success) {
        onSuccess?.(data);
        onClose();
      } else {
        setError(data.message || 'Failed to submit booking request');
      }
    } catch (err) {
      setError('Failed to submit booking request');
      console.error('Error submitting booking:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.email)) {
      setError('Please fill in your name and email');
      return;
    }
    setCurrentStep(prev => prev + 1);
    setError(null);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError(null);
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    return slot.start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Property Visit" size="lg">
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Property Info */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {property.address}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>${property.price?.toLocaleString()}</span>
            <span>•</span>
            <span>{property.bedrooms} bed, {property.bathrooms} bath</span>
            <span>•</span>
            <span>{property.sqft?.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            >
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tell us about yourself
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Preferences & Scheduling */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your preferences & availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timeline</option>
                  <option value="Immediate">Immediate</option>
                  <option value="1 month">Within 1 month</option>
                  <option value="3 months">Within 3 months</option>
                  <option value="6 months">Within 6 months</option>
                  <option value="1 year">Within 1 year</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Date (Optional)
              </label>
              <input
                type="date"
                value={formData.preferredDateTime.split('T')[0] || ''}
                onChange={(e) => handleInputChange('preferredDateTime', e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Available Time Slots */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Spinner className="w-5 h-5 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">Loading available times...</span>
              </div>
            )}

            {availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlots.slice(0, 6).map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-3 text-sm rounded-lg border transition-all ${
                        selectedSlot?.start.getTime() === slot.start.getTime()
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {formatTimeSlot(slot)}
                      <div className="text-xs opacity-75 mt-1">
                        with {slot.agent.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any specific questions or requirements..."
              />
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm your booking
            </h3>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Property:</span>
                <span className="font-medium text-gray-900 dark:text-white">{property.address}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedSlot ? selectedSlot.start.toLocaleString() : 'To be scheduled'}
                </span>
              </div>

              {selectedSlot && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Agent:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedSlot.agent.name}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Your Name:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formData.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formData.email}</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                ✅ You'll receive email confirmation with calendar invite<br/>
                ✅ SMS reminder 30 minutes before the meeting<br/>
                ✅ Agent will contact you if needed
              </p>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            variant="secondary"
            onClick={currentStep === 1 ? onClose : prevStep}
            disabled={isSubmitting}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex space-x-2">
            {currentStep < 3 ? (
              <Button onClick={nextStep} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !selectedSlot}>
                {isSubmitting ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PropertyVisitForm;