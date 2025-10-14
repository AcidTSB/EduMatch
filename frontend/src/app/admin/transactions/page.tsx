'use client';

import React, { useState } from 'react';
import { DollarSign, CreditCard, RefreshCw, TrendingUp, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable, { Column } from '@/components/admin/DataTable';
import FilterPanel, { FilterConfig } from '@/components/admin/FilterPanel';
import ModalConfirm from '@/components/admin/ModalConfirm';
import StatCard from '@/components/admin/StatCard';
import CSVExportButton from '@/components/admin/CSVExportButton';
import { TRANSACTIONS, Transaction } from '@/lib/mock-data';

export default function AdminTransactionsPage() {
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Transaction[]>([]);

  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'multi-select',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Failed', value: 'FAILED' },
        { label: 'Refunded', value: 'REFUNDED' }
      ]
    },
    {
      key: 'type',
      label: 'Type',
      type: 'multi-select',
      options: [
        { label: 'Subscription', value: 'SUBSCRIPTION' },
        { label: 'Application Fee', value: 'APPLICATION_FEE' },
        { label: 'Refund', value: 'REFUND' },
        { label: 'Credit', value: 'CREDIT' }
      ]
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { label: 'Credit Card', value: 'CARD' },
        { label: 'PayPal', value: 'PAYPAL' },
        { label: 'Bank Transfer', value: 'BANK' }
      ]
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'date-range'
    }
  ];

  const filteredTransactions = TRANSACTIONS.filter((tx: Transaction) => {
    const matchesStatus = !filterValues.status?.length || filterValues.status.includes(tx.status);
    const matchesType = !filterValues.type?.length || filterValues.type.includes(tx.type);
    const matchesPaymentMethod = !filterValues.paymentMethod || tx.paymentMethod === filterValues.paymentMethod;

    if (filterValues.dateRange?.from || filterValues.dateRange?.to) {
      const txDate = new Date(tx.createdAt);
      if (filterValues.dateRange.from && txDate < new Date(filterValues.dateRange.from)) return false;
      if (filterValues.dateRange.to && txDate > new Date(filterValues.dateRange.to)) return false;
    }

    return matchesStatus && matchesType && matchesPaymentMethod;
  });

  const stats = {
    totalRevenue: TRANSACTIONS
      .filter((t: Transaction) => t.status === 'COMPLETED' && t.type !== 'REFUND')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
    totalRefunded: TRANSACTIONS
      .filter((t: Transaction) => t.status === 'REFUNDED' || t.type === 'REFUND')
      .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0),
    pendingCount: TRANSACTIONS.filter((t: Transaction) => t.status === 'PENDING').length,
    completedCount: TRANSACTIONS.filter((t: Transaction) => t.status === 'COMPLETED').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'COMPLETED': return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'FAILED': return <Badge variant="destructive">Failed</Badge>;
      case 'REFUNDED': return <Badge variant="secondary">Refunded</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'SUBSCRIPTION': return <Badge variant="default">Subscription</Badge>;
      case 'APPLICATION_FEE': return <Badge className="bg-blue-100 text-blue-700">Application Fee</Badge>;
      case 'REFUND': return <Badge className="bg-red-100 text-red-700">Refund</Badge>;
      case 'CREDIT': return <Badge className="bg-purple-100 text-purple-700">Credit</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'id',
      label: 'Transaction ID',
      sortable: true,
      render: (tx) => <span className="font-mono text-sm">{tx.id}</span>
    },
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      render: (tx) => (
        <div>
          <div className="font-medium text-gray-900">{tx.userName}</div>
          <div className="text-sm text-gray-500">{tx.userEmail}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (tx) => getTypeBadge(tx.type)
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (tx) => (
        <span className={`font-semibold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
          ${Math.abs(tx.amount).toFixed(2)}
        </span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (tx) => {
        const icons: Record<string, string> = {
          CARD: '💳',
          PAYPAL: '🅿️',
          BANK: '🏦'
        };
        return (
          <div className="flex items-center gap-2">
            <span>{icons[tx.paymentMethod]}</span>
            <span className="text-sm">{tx.paymentMethod}</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (tx) => getStatusBadge(tx.status)
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (tx) => (
        <div className="text-sm">
          <div>{new Date(tx.createdAt).toLocaleDateString()}</div>
          <div className="text-gray-500">{new Date(tx.createdAt).toLocaleTimeString()}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (tx) => (
        <div className="flex gap-2">
          {tx.status === 'COMPLETED' && tx.type !== 'REFUND' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTransaction(tx);
                setShowRefundModal(true);
              }}
            >
              <RefreshCw className="w-4 h-4 text-orange-600" />
            </Button>
          )}
        </div>
      )
    }
  ];

  const handleRefund = () => {
    console.log('Processing refund for transaction:', selectedTransaction?.id);
    // TODO: API call to process refund
    setShowRefundModal(false);
    toast.success('Refund Initiated', {
      description: `Refund for transaction ${selectedTransaction?.id} is being processed`,
    });
    setSelectedTransaction(null);
  };

  const exportData = filteredTransactions.map((tx: Transaction) => ({
    'Transaction ID': tx.id,
    'User': tx.userName,
    'Email': tx.userEmail,
    'Type': tx.type,
    'Amount': tx.amount,
    'Payment Method': tx.paymentMethod,
    'Status': tx.status,
    'Date': new Date(tx.createdAt).toISOString(),
    'Description': tx.description || '',
    'Reference ID': tx.metadata?.referenceId || ''
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">Manage payment transactions and refunds</p>
        </div>
        <CSVExportButton
          data={exportData}
          filename="transactions"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          trend="up"
          change={12.5}
          changeLabel="vs last month"
        />
        <StatCard
          title="Total Refunded"
          value={`$${stats.totalRefunded.toFixed(2)}`}
          icon={<RefreshCw className="w-6 h-6 text-orange-600" />}
        />
        <StatCard
          title="Pending"
          value={stats.pendingCount}
          icon={<CreditCard className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Completed"
          value={stats.completedCount}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
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
        data={filteredTransactions}
        selectable
        onSelectionChange={setSelectedRows}
        pagination
        pageSize={15}
        emptyMessage="No transactions found"
      />

      {/* Refund Modal */}
      <ModalConfirm
        isOpen={showRefundModal}
        onClose={() => {
          setShowRefundModal(false);
          setSelectedTransaction(null);
        }}
        onConfirm={handleRefund}
        title="Process Refund"
        description={`Are you sure you want to refund $${selectedTransaction?.amount.toFixed(2)} to ${selectedTransaction?.userName}? This action cannot be undone.`}
        confirmText="Process Refund"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
}
