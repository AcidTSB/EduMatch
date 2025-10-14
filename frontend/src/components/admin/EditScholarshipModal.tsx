'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScholarshipType } from '@/types';

interface ScholarshipData {
  id: string;
  title: string;
  amount: string;
  type: string;
  deadline: string;
  provider: string;
  status: string;
}

interface EditScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scholarshipData: {
    title: string;
    amount: number;
    type: ScholarshipType;
    deadline: string;
    university: string;
    location: string;
    description: string;
  }) => void;
  scholarship: ScholarshipData | null;
}

export function EditScholarshipModal({ isOpen, onClose, onSubmit, scholarship }: EditScholarshipModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: ScholarshipType.UNDERGRADUATE,
    deadline: '',
    university: '',
    location: 'United States',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when scholarship data changes
  useEffect(() => {
    if (scholarship) {
      setFormData({
        title: scholarship.title,
        amount: scholarship.amount.replace(/[$,]/g, ''),
        type: scholarship.type as ScholarshipType || ScholarshipType.UNDERGRADUATE,
        deadline: scholarship.deadline,
        university: scholarship.provider,
        location: 'United States',
        description: `Editing scholarship: ${scholarship.title}`,
      });
    }
  }, [scholarship]);

  if (!isOpen || !scholarship) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Scholarship</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {scholarship.id}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Scholarship Title *
              </label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., MIT AI Research Fellowship 2025"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Amount and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($) *
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="50000"
                  min="0"
                  step="1000"
                  className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ScholarshipType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={ScholarshipType.UNDERGRADUATE}>Undergraduate</option>
                  <option value={ScholarshipType.GRADUATE}>Graduate</option>
                  <option value={ScholarshipType.PHD}>PhD</option>
                  <option value={ScholarshipType.POSTDOC}>Postdoc</option>
                  <option value={ScholarshipType.RESEARCH}>Research</option>
                </select>
              </div>
            </div>

            {/* University and Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                  University/Provider *
                </label>
                <Input
                  id="university"
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="e.g., Massachusetts Institute of Technology"
                  className={errors.university ? 'border-red-500' : ''}
                />
                {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., United States"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline *
              </label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className={errors.deadline ? 'border-red-500' : ''}
              />
              {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter scholarship description, requirements, and details..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Changes will be saved to mock data. In production, this will update the database 
                and notify the provider about the changes.
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
