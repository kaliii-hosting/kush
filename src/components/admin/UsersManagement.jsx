import { useState, useEffect } from 'react';
import { Users, Search, Circle, Shield, User as UserIcon, Mail, Calendar, Clock, ChevronDown } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load users from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading users:', error);
        if (error.code === 'permission-denied') {
          setError(`PERMISSION DENIED - Apply these Firebase Firestore Rules:

Go to Firebase Console > Firestore Database > Rules and paste:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}

Then click PUBLISH.`);
        } else {
          setError('Failed to load users: ' + error.message);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Status filter
    if (filterStatus === 'online') {
      filtered = filtered.filter(user => user.isOnline);
    } else if (filterStatus === 'offline') {
      filtered = filtered.filter(user => !user.isOnline);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, filterStatus, users]);

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      setSuccess('User role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update user role');
      setTimeout(() => setError(''), 3000);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const stats = {
    total: users.length,
    online: users.filter(u => u.isOnline).length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'customer').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Monitor and manage user accounts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-spotify-light-gray rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Users</p>
        </div>
        
        <div className="bg-spotify-light-gray rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Circle className="h-8 w-8 text-green-500 fill-current" />
            <span className="text-2xl font-bold text-white">{stats.online}</span>
          </div>
          <p className="text-gray-400 text-sm">Online Now</p>
        </div>
        
        <div className="bg-spotify-light-gray rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold text-white">{stats.admins}</span>
          </div>
          <p className="text-gray-400 text-sm">Admins</p>
        </div>
        
        <div className="bg-spotify-light-gray rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <UserIcon className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">{stats.customers}</span>
          </div>
          <p className="text-gray-400 text-sm">Customers</p>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-600/50 rounded-lg text-green-400">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
          <div className="text-red-400 font-bold mb-2">❌ ERROR:</div>
          <pre className="text-red-300 text-xs whitespace-pre-wrap overflow-x-auto">
            {error}
          </pre>
        </div>
      )}

      {/* Filters */}
      <div className="bg-spotify-light-gray rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full bg-spotify-gray text-white pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="customer">Customers</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-spotify-gray text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-spotify-light-gray rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-spotify-gray border-b border-spotify-card-hover">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">User</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Role</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Joined</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-spotify-card-hover">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-spotify-card-hover transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-spotify-gray rounded-full overflow-hidden flex-shrink-0">
                          {user.photoURL ? (
                            <img 
                              src={user.photoURL} 
                              alt={user.displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user.displayName || 'Anonymous'}</p>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role || 'customer'}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin' 
                            ? 'bg-yellow-500/20 text-yellow-500' 
                            : 'bg-blue-500/20 text-blue-500'
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Circle className={`h-3 w-3 ${user.isOnline ? 'text-green-500 fill-current' : 'text-gray-500'}`} />
                        <span className={`text-sm ${user.isOnline ? 'text-green-500' : 'text-gray-500'}`}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Clock className="h-3 w-3" />
                        {user.isOnline ? 'Now' : getTimeSince(user.lastSeenAt || user.lastLoginAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;