'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// MOCK DATA REMOVED - TODO: Integrate with real backend API
import { ScholarshipStatus } from '@/types';
import { CreateScholarshipModal } from '@/components/admin/CreateScholarshipModal';
import { EditScholarshipModal } from '@/components/admin/EditScholarshipModal';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ScholarshipsManagement() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; scholarship: any | null }>({
    isOpen: false,
    scholarship: null
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; scholarshipId: string; scholarshipTitle: string }>({
    isOpen: false,
    scholarshipId: '',
    scholarshipTitle: ''
  });
  const itemsPerPage = 8;

  // Handlers
  const handleCreateScholarship = (scholarshipData: any) => {
    toast.success(t('adminScholarships.scholarshipCreated'), {
      description: t('adminScholarships.scholarshipCreatedDesc').replace('{title}', scholarshipData.title),
    });
    console.log('New scholarship created:', scholarshipData);
  };

  const handleViewScholarship = (scholarshipId: string) => {
    router.push(`/admin/scholarships/${scholarshipId}`);
  };

  const handleEditScholarship = (scholarshipId: string, scholarshipTitle: string) => {
    // Find the scholarship data
    const scholarship = scholarships.find(s => s.id === scholarshipId);
    if (scholarship) {
      setEditModal({ isOpen: true, scholarship });
    }
  };

  const confirmEditScholarship = (scholarshipData: any) => {
    toast.success(t('adminScholarships.scholarshipUpdated'), {
      description: t('adminScholarships.scholarshipUpdatedDesc').replace('{title}', scholarshipData.title),
    });
    console.log('Updating scholarship:', editModal.scholarship?.id, scholarshipData);
    setEditModal({ isOpen: false, scholarship: null });
  };

  const handleDeleteScholarship = (scholarshipId: string, scholarshipTitle: string) => {
    setDeleteModal({ isOpen: true, scholarshipId, scholarshipTitle });
  };

  const confirmDeleteScholarship = () => {
    toast.success(t('adminScholarships.scholarshipDeleted'), {
      description: t('adminScholarships.scholarshipDeletedDesc').replace('{title}', deleteModal.scholarshipTitle),
    });
    console.log('Deleting scholarship:', deleteModal.scholarshipId);
    setDeleteModal({ isOpen: false, scholarshipId: '', scholarshipTitle: '' });
  };

  // Use real mock scholarships with application counts
  const scholarships = mockScholarships.map(scholarship => {
    const applicants = mockApplications.filter(app => app.scholarshipId === scholarship.id).length;
    const approved = mockApplications.filter(app => app.scholarshipId === scholarship.id && app.status === 'ACCEPTED').length;
    
    return {
      id: scholarship.id,
      title: scholarship.title,
      provider: scholarship.providerName || scholarship.university || 'Unknown Provider',
      amount: `$${(scholarship.amount || 0).toLocaleString()}`,
      type: scholarship.type || 'General',
      deadline: scholarship.applicationDeadline ? new Date(scholarship.applicationDeadline).toISOString().split('T')[0] : '2024-12-31',
      applicants,
      status: scholarship.status === ScholarshipStatus.PUBLISHED ? 'Active' : scholarship.status === ScholarshipStatus.DRAFT ? 'Pending' : 'Expired',
      approved
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Expired':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Active':
        return t('adminScholarships.statusActive');
      case 'Pending':
        return t('adminScholarships.statusPending');
      case 'Expired':
        return t('adminScholarships.statusExpired');
      default:
        return status;
    }
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = 
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || scholarship.status === selectedStatus;
    const matchesType = selectedType === 'all' || scholarship.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScholarships = filteredScholarships.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: scholarships.length,
    active: scholarships.filter(s => s.status === 'Active').length,
    pending: scholarships.filter(s => s.status === 'Pending').length,
    totalApplicants: scholarships.reduce((sum, s) => sum + s.applicants, 0)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('adminScholarships.title')}</h1>
          <p className="text-gray-500 mt-1">{t('adminScholarships.subtitle')}</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('adminScholarships.createScholarship')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-minimal">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('adminScholarships.totalScholarships')}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
          </CardContent>
        </Card>
        <Card className="card-minimal">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('adminScholarships.active')}</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">{stats.active}</h3>
          </CardContent>
        </Card>
        <Card className="card-minimal">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('adminScholarships.pendingReview')}</p>
            <h3 className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</h3>
          </CardContent>
        </Card>
        <Card className="card-minimal">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('adminScholarships.totalApplicants')}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalApplicants}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-minimal">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('adminScholarships.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('adminScholarships.allStatus')}</option>
              <option value="Active">{t('adminScholarships.statusActive')}</option>
              <option value="Pending">{t('adminScholarships.statusPending')}</option>
              <option value="Expired">{t('adminScholarships.statusExpired')}</option>
            </select>

          </div>
        </CardContent>
      </Card>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedScholarships.map((scholarship) => (
          <Card key={scholarship.id} className="card-minimal card-hover">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {scholarship.title}
                  </h3>
                  <p className="text-sm text-gray-600">{scholarship.provider}</p>
                </div>
                <Badge className={`${getStatusColor(scholarship.status)} flex items-center gap-1`}>
                  {getStatusIcon(scholarship.status)}
                  {getStatusLabel(scholarship.status)}
                </Badge>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-gray-900">{scholarship.amount}</span>
                  <span className="mx-2">•</span>
                  <Badge variant="secondary">{scholarship.type}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('adminScholarships.deadline')}: {new Date(scholarship.deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {t('adminScholarships.applicantsCount').replace('{count}', scholarship.applicants.toString())}
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t('adminScholarships.approvedCount').replace('{count}', scholarship.approved.toString())}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewScholarship(scholarship.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('adminScholarships.view')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditScholarship(scholarship.id, scholarship.title)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('adminScholarships.edit')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteScholarship(scholarship.id, scholarship.title)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Card className="card-minimal">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {t('adminScholarships.showingResults')
                .replace('{start}', (startIndex + 1).toString())
                .replace('{end}', Math.min(startIndex + itemsPerPage, filteredScholarships.length).toString())
                .replace('{total}', filteredScholarships.length.toString())}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                {t('adminScholarships.previous')}
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                {t('adminScholarships.next')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Scholarship Modal */}
      <CreateScholarshipModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateScholarship}
      />

      {/* Edit Scholarship Modal */}
      <EditScholarshipModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, scholarship: null })}
        onSubmit={confirmEditScholarship}
        scholarship={editModal.scholarship}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, scholarshipId: '', scholarshipTitle: '' })}
        onConfirm={confirmDeleteScholarship}
        title={t('adminScholarships.confirmDelete')}
        description={t('adminScholarships.confirmDeleteDesc').replace('{title}', deleteModal.scholarshipTitle)}
        variant="danger"
        confirmText={t('adminScholarships.confirmDeleteBtn')}
      />
    </div>
  );
}
