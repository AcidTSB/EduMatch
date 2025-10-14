'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Edit, 
  Trash2,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/lib/mock-data';
import { UserRole } from '@/types';
import { AddUserModal } from '@/components/admin/AddUserModal';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export default function UsersManagement() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({
    isOpen: false,
    userId: '',
    userName: ''
  });
  const itemsPerPage = 10;

  // Handlers
  const handleAddNewUser = (userData: any) => {
    toast.success('User Created Successfully', {
      description: `${userData.name} has been added as ${userData.role}`,
    });
    console.log('New user created:', userData);
  };

  const handleEditUser = (userId: string, userName: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleSendEmail = (userEmail: string, userName: string) => {
    // In production, this would open an email modal
    toast.success('Email Sent', {
      description: `Email sent to ${userName} (${userEmail})`,
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const confirmDeleteUser = () => {
    toast.success('User Deleted', {
      description: `User "${deleteModal.userName}" has been permanently deleted.`,
    });
    console.log('Deleting user:', deleteModal.userId);
    setDeleteModal({ isOpen: false, userId: '', userName: '' });
  };

  // Use real mock users
  const users = mockUsers.map(user => {
    const initials = (user.name || 'U')
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    return {
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      role: user.role === UserRole.ADMIN ? 'Admin' : user.role === UserRole.STUDENT ? 'Student' : 'Provider',
      status: user.status || 'Active',
      joinDate: new Date(user.createdAt).toISOString().split('T')[0],
      applications: user.role === UserRole.STUDENT ? 5 : undefined,
      scholarships: user.role === UserRole.PROVIDER ? 10 : undefined,
      avatar: initials
    };
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700';
      case 'Provider':
        return 'bg-blue-100 text-blue-700';
      case 'Student':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-gray-100 text-gray-700';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all users, roles, and permissions</p>
        </div>
        <Button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-minimal">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{users.length}</h3>
          </CardContent>
        </Card>
        <Card className="card-minimal">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Students</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {users.filter(u => u.role === 'Student').length}
            </h3>
          </CardContent>
        </Card>
        <Card className="card-minimal">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Providers</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {users.filter(u => u.role === 'Provider').length}
            </h3>
          </CardContent>
        </Card>
        <Card className="card-minimal">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Active Users</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {users.filter(u => String(u.status).includes('ACTIVE') || String(u.status).includes('Active')).length}
            </h3>
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
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="Student">Student</option>
              <option value="Provider">Provider</option>
              <option value="Admin">Admin</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="card-minimal">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {user.avatar}
                        </div>
                        <div className="ml-4">
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.applications && `${user.applications} applications`}
                      {user.scholarships && `${user.scholarships} scholarships`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user.id, user.name)}
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSendEmail(user.email, user.name)}
                          title="Send email"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
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
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddNewUser}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: '', userName: '' })}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete User"
      />
    </div>
  );
}
