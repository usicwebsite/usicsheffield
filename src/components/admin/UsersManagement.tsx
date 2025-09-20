'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WebsiteUser } from '@/lib/firebase-admin-utils';
import { getAuth } from 'firebase/auth';

interface UsersManagementProps {
  searchTerm?: string;
  filterStatus?: 'all' | 'restricted' | 'active';
}

export default function UsersManagement({ searchTerm = '', filterStatus = 'all' }: UsersManagementProps) {
  const router = useRouter();
  const [users, setUsers] = useState<WebsiteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restrictingUser, setRestrictingUser] = useState<string | null>(null);
  const [restrictionReason, setRestrictionReason] = useState('');
  const [showRestrictModal, setShowRestrictModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<WebsiteUser | null>(null);
  const [syncingUser, setSyncingUser] = useState<string | null>(null);
  const [batchSyncing, setBatchSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<{ userId: string; success: boolean; message: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.dropdown-menu')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Listen for refresh event from admin dashboard
  useEffect(() => {
    const handleRefreshUsers = () => {
      fetchUsers();
    };

    window.addEventListener('refreshUsers', handleRefreshUsers);
    return () => window.removeEventListener('refreshUsers', handleRefreshUsers);
  }, []);

  const toggleDropdown = (userId: string) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Get Firebase ID token for authentication
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRestrictUser = async (userId: string, action: 'restrict' | 'unrestrict') => {
    try {
      setRestrictingUser(userId);

      // Get Firebase ID token for authentication
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId,
          action,
          reason: action === 'restrict' ? restrictionReason : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user restriction');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh users list
        await fetchUsers();
        setShowRestrictModal(false);
        setRestrictionReason('');
        setSelectedUser(null);
      } else {
        throw new Error(data.error || 'Failed to update user restriction');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user restriction');
    } finally {
      setRestrictingUser(null);
    }
  };

  const handleSyncUserName = async (userId: string) => {
    try {
      setSyncingUser(userId);
      setSyncResults(null);

      // Get Firebase ID token for authentication
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userId,
          action: 'sync_display_name',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user name');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh users list
        await fetchUsers();
        setSyncResults({
          userId,
          success: true,
          message: data.message
        });
      } else {
        throw new Error(data.error || 'Failed to sync user name');
      }
    } catch (err) {
      setSyncResults({
        userId,
        success: false,
        message: err instanceof Error ? err.message : 'Failed to sync user name'
      });
    } finally {
      setSyncingUser(null);
    }
  };

  const handleBatchSyncNames = async () => {
    try {
      setBatchSyncing(true);
      setSyncResults(null);

      // Get Firebase ID token for authentication
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          action: 'batch_sync_display_names',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to batch sync user names');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh users list
        await fetchUsers();
        setSyncResults({
          userId: 'batch',
          success: true,
          message: data.message
        });
      } else {
        throw new Error(data.error || 'Failed to batch sync user names');
      }
    } catch (err) {
      setSyncResults({
        userId: 'batch',
        success: false,
        message: err instanceof Error ? err.message : 'Failed to batch sync user names'
      });
    } finally {
      setBatchSyncing(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.uid.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'restricted' && user.restricted) ||
                         (filterStatus === 'active' && !user.restricted);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date | string | number | undefined) => {
    if (!date) return 'Never';

    try {
      const dateObj = date instanceof Date ? date : new Date(date);

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }

      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          <span className="ml-3 text-gray-300">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-red-400 font-semibold">Error</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Batch Sync and Results */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Sync User Names with Google</h3>
            <p className="text-gray-400 text-sm">Ensure all user display names match their Google account names</p>
          </div>
          <button
            onClick={handleBatchSyncNames}
            disabled={batchSyncing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            {batchSyncing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                Syncing All...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Batch Sync All
              </>
            )}
          </button>
        </div>

        {/* Sync results message */}
        {syncResults && (
          <div className={`mt-4 p-4 rounded-lg ${syncResults.success ? 'bg-green-600/20 border border-green-500/30' : 'bg-red-600/20 border border-red-500/30'}`}>
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 ${syncResults.success ? 'text-green-400' : 'text-red-400'}`}>
                {syncResults.success ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${syncResults.success ? 'text-green-300' : 'text-red-300'}`}>
                  {syncResults.userId === 'batch' ? 'Batch Sync Results' : 'Sync Results'}
                </p>
                <p className={`text-sm ${syncResults.success ? 'text-green-200' : 'text-red-200'}`}>
                  {syncResults.message}
                </p>
              </div>
              <button
                onClick={() => setSyncResults(null)}
                className={`ml-auto p-1 rounded-full hover:bg-white/10 ${syncResults.success ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email Verified</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Sign In</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <tr
                  key={user.uid}
                  className="hover:bg-white/5 transition duration-200 cursor-pointer"
                  onClick={() => router.push(`/admin-dashboard/users/${user.uid}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.photoURL ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.photoURL} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.displayName || 'No name'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {user.uid.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.restricted ? (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Restricted
                        </span>
                        {user.restrictionReason && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={user.restrictionReason}>
                            Reason: {user.restrictionReason}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.lastSignInTime ? formatDate(user.lastSignInTime) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                    <div className="dropdown-menu">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(user.uid);
                        }}
                        className="p-2 rounded-full hover:bg-white/10 transition duration-200"
                        title="Actions"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {dropdownOpen === user.uid && (
                        <div
                          className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            {user.restricted ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRestrictUser(user.uid, 'unrestrict');
                                  setDropdownOpen(null);
                                }}
                                disabled={restrictingUser === user.uid}
                                className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {restrictingUser === user.uid ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b border-green-400"></div>
                                    Unrestricting...
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                    Unrestrict User
                                  </>
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                  setShowRestrictModal(true);
                                  setDropdownOpen(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Restrict User
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSyncUserName(user.uid);
                                setDropdownOpen(null);
                              }}
                              disabled={syncingUser === user.uid}
                              className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {syncingUser === user.uid ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b border-blue-400"></div>
                                  Syncing Name...
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                  Sync with Google
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="text-white text-lg font-medium mb-2">No users found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No users have registered yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Restriction Modal */}
      {showRestrictModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white text-xl font-semibold mb-4">Restrict User Access</h3>
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Are you sure you want to restrict access for <strong>{selectedUser.displayName || selectedUser.email}</strong>?
              </p>
              <p className="text-gray-400 text-sm">
                This will prevent the user from accessing the website until unrestricted.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for restriction (optional)
              </label>
              <textarea
                value={restrictionReason}
                onChange={(e) => setRestrictionReason(e.target.value)}
                placeholder="Enter the reason for restricting this user..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRestrictModal(false);
                  setRestrictionReason('');
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRestrictUser(selectedUser.uid, 'restrict')}
                disabled={restrictingUser === selectedUser.uid}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300 disabled:opacity-50"
              >
                {restrictingUser === selectedUser.uid ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white"></div>
                    Restricting...
                  </div>
                ) : (
                  'Restrict User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
