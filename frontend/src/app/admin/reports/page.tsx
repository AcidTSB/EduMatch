'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flag, Eye, CheckCircle, XCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '@/components/admin/DataTable';
import FilterPanel, { FilterConfig } from '@/components/admin/FilterPanel';
import ModalForm, { FormField } from '@/components/admin/ModalForm';
import StatCard from '@/components/admin/StatCard';
import { REPORTS, Report } from '@/lib/mock-data';

export default function AdminReportsPage() {
  const router = useRouter();
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);

  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'multi-select',
      options: [
        { label: 'New', value: 'NEW' },
        { label: 'In Review', value: 'IN_REVIEW' },
        { label: 'Resolved', value: 'RESOLVED' },
        { label: 'Dismissed', value: 'DISMISSED' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'multi-select',
      options: [
        { label: 'Low', value: 'LOW' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'High', value: 'HIGH' },
        { label: 'Urgent', value: 'URGENT' }
      ]
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'Spam', value: 'SPAM' },
        { label: 'Harassment', value: 'HARASSMENT' },
        { label: 'Fake Info', value: 'FAKE_INFO' },
        { label: 'Inappropriate', value: 'INAPPROPRIATE' },
        { label: 'Other', value: 'OTHER' }
      ]
    },
    {
      key: 'targetType',
      label: 'Target Type',
      type: 'select',
      options: [
        { label: 'User', value: 'USER' },
        { label: 'Scholarship', value: 'SCHOLARSHIP' }
      ]
    }
  ];

  const filteredReports = REPORTS.filter((report: Report) => {
    const matchesStatus = !filterValues.status?.length || filterValues.status.includes(report.status);
    const matchesPriority = !filterValues.priority?.length || filterValues.priority.includes(report.priority);
    const matchesCategory = !filterValues.category || report.category === filterValues.category;
    const matchesTargetType = !filterValues.targetType || report.targetType === filterValues.targetType;

    return matchesStatus && matchesPriority && matchesCategory && matchesTargetType;
  });

  const stats = {
    total: REPORTS.length,
    new: REPORTS.filter((r: Report) => r.status === 'NEW').length,
    inReview: REPORTS.filter((r: Report) => r.status === 'IN_REVIEW').length,
    resolved: REPORTS.filter((r: Report) => r.status === 'RESOLVED').length
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW': return <Badge variant="default">New</Badge>;
      case 'IN_REVIEW': return <Badge className="bg-blue-100 text-blue-700">In Review</Badge>;
      case 'RESOLVED': return <Badge className="bg-green-100 text-green-700">Resolved</Badge>;
      case 'DISMISSED': return <Badge variant="secondary">Dismissed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const resolveFields: FormField[] = [
    {
      name: 'action',
      label: 'Action Taken',
      type: 'select',
      required: true,
      options: [
        { label: 'Resolved - Content removed', value: 'removed' },
        { label: 'Resolved - User warned', value: 'warned' },
        { label: 'Resolved - User banned', value: 'banned' },
        { label: 'Dismissed - Not a violation', value: 'dismissed' },
        { label: 'Dismissed - Insufficient evidence', value: 'insufficient' }
      ]
    },
    {
      name: 'note',
      label: 'Admin Note',
      type: 'textarea',
      required: true,
      placeholder: 'Add notes about resolution...',
      rows: 4
    }
  ];

  const columns: Column<Report>[] = [
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (report) => (
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-5 h-5 ${getPriorityColor(report.priority)}`} />
          <span className={`font-medium ${getPriorityColor(report.priority)}`}>
            {report.priority}
          </span>
        </div>
      )
    },
    {
      key: 'reporter',
      label: 'Reporter',
      sortable: true,
      render: (report) => (
        <div>
          <div className="font-medium text-gray-900">{report.reporterName}</div>
          <div className="text-sm text-gray-500">{report.reporterEmail}</div>
        </div>
      )
    },
    {
      key: 'target',
      label: 'Target',
      render: (report) => (
        <div>
          <Badge variant="outline" className="mb-1">{report.targetType}</Badge>
          <div className="text-sm text-gray-900">{report.targetTitle}</div>
        </div>
      )
    },
    {
      key: 'reason',
      label: 'Reason',
      sortable: true,
      render: (report) => (
        <div>
          <div className="font-medium text-gray-900">{report.category}</div>
          <div className="text-sm text-gray-500">{report.description}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (report) => getStatusBadge(report.status)
    },
    {
      key: 'createdAt',
      label: 'Reported',
      sortable: true,
      render: (report) => new Date(report.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (report) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedReport(report);
              // Show detail modal or navigate
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {report.status !== 'RESOLVED' && report.status !== 'DISMISSED' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedReport(report);
                setShowResolveModal(true);
              }}
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const handleResolve = (data: Record<string, any>) => {
    console.log('Resolving report:', selectedReport?.id, data);
    // TODO: API call
    setShowResolveModal(false);
    setSelectedReport(null);
    toast.success('Report Resolved', {
      description: `Report ${data.action}: ${data.note}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Queue</h1>
          <p className="text-gray-500 mt-1">Review and resolve user reports</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={stats.total}
          icon={<Flag className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="New Reports"
          value={stats.new}
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          trend="up"
          change={3}
        />
        <StatCard
          title="In Review"
          value={stats.inReview}
          icon={<Eye className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <FilterPanel
            filters={filters}
            values={filterValues}
            onChange={(key, value) => setFilterValues(prev => ({ ...prev, [key]: value }))}
            onClear={() => setFilterValues({})}
          />
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredReports}
        pagination
        pageSize={10}
        emptyMessage="No reports found"
      />

      {/* Resolve Modal */}
      <ModalForm
        isOpen={showResolveModal}
        onClose={() => {
          setShowResolveModal(false);
          setSelectedReport(null);
        }}
        onSubmit={handleResolve}
        title={`Resolve Report: ${selectedReport?.category}`}
        fields={resolveFields}
        submitText="Resolve"
        cancelText="Cancel"
      />
    </div>
  );
}
