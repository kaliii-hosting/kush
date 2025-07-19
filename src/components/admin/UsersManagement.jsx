import { useState, useEffect } from 'react';
import { Users, Search, Circle, Shield, User as UserIcon, Mail, Calendar, Clock, ChevronDown, Briefcase, Plus, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const UsersManagement = () => {
  const { user: currentUser, userData: currentUserData } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Add user form state
  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Edit user form state
  const [editUserData, setEditUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: ''
  });

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
    // Check if current user is admin by email
    if (!currentUser || currentUser.email?.toLowerCase() !== 'admin@kushie.com') {
      setError('Only admin@kushie.com can update user roles');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      setSuccess('User role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating user role:', error);
      if (error.code === 'permission-denied') {
        setError(`PERMISSION DENIED - You need to update your Firebase Firestore Rules.

Go to Firebase Console > Firestore Database > Rules and replace with:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || 
         request.auth.token.email == 'admin@kushie.com');
    }
  }
}

Then click PUBLISH.`);
      } else {
        setError(`Failed to update user role: ${error.message}`);
      }
      setTimeout(() => setError(''), 10000);
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validation
    if (newUserData.password !== newUserData.confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    if (newUserData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    setAddUserLoading(true);
    
    try {
      // Use Cloud Function to create user with role
      const createUserFunction = httpsCallable(functions, 'createUserWithRole');
      const result = await createUserFunction({
        email: newUserData.email,
        password: newUserData.password,
        displayName: newUserData.fullName,
        role: 'customer'
      });
      
      if (result.data.success) {
        setSuccess('User created successfully');
        setTimeout(() => setSuccess(''), 3000);
        
        // Reset form
        setNewUserData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setShowAddUserForm(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Handle specific Cloud Function errors
      if (error.code === 'functions/unauthenticated') {
        setError('You must be logged in to create users.');
      } else if (error.code === 'functions/permission-denied') {
        setError('You must be an admin to create users.');
      } else if (error.code === 'functions/already-exists') {
        setError(`This email is already registered. If you need to recreate this user:
1. Use the delete button to remove the existing user
2. Then create the user again`);
        setTimeout(() => setError(''), 10000);
      } else if (error.code === 'functions/invalid-argument') {
        setError(error.message || 'Invalid user data provided.');
      } else {
        setError(`Failed to create user: ${error.message}`);
      }
      setTimeout(() => setError(''), 5000);
    } finally {
      setAddUserLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditUserData({
      fullName: user.displayName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      licenseNumber: user.licenseNumber || ''
    });
    setShowEditForm(true);
    setShowAddUserForm(false);
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    setAddUserLoading(true);
    
    try {
      // Update user document in Firestore
      await updateDoc(doc(db, 'users', editingUser.id), {
        displayName: editUserData.fullName,
        email: editUserData.email,
        phone: editUserData.phone,
        address: editUserData.address,
        licenseNumber: editUserData.licenseNumber,
        updatedAt: new Date().toISOString()
      });
      
      setSuccess('User updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      
      // Reset form
      setEditingUser(null);
      setEditUserData({ fullName: '', email: '', phone: '', address: '', licenseNumber: '' });
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError(`Failed to update user: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setAddUserLoading(false);
    }
  };

  // Handle delete user (soft delete - mark as inactive)
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.displayName || user.email}?\n\nThis will mark the user as deleted and prevent them from signing in.`)) {
      return;
    }
    
    setDeleteLoading(true);
    
    try {
      // Update user document to mark as deleted
      await updateDoc(doc(db, 'users', user.id), {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser.email
      });
      
      setSuccess('User marked as deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(`Failed to delete user: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle restore user
  const handleRestoreUser = async (user) => {
    if (!window.confirm(`Are you sure you want to restore ${user.displayName || user.email}?\n\nThis will allow the user to sign in again.`)) {
      return;
    }
    
    setDeleteLoading(true);
    
    try {
      // Update user document to remove deleted status
      await updateDoc(doc(db, 'users', user.id), {
        isDeleted: false,
        restoredAt: new Date().toISOString(),
        restoredBy: currentUser.email
      });
      
      setSuccess('User restored successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error restoring user:', error);
      setError(`Failed to restore user: ${error.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setDeleteLoading(false);
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
    customers: users.filter(u => u.role === 'customer').length,
    salesReps: users.filter(u => u.role === 'sales').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Monitor and manage user accounts</p>
          <p className="text-xs text-yellow-500 mt-1">Note: User deletion is permanent and removes both authentication and data.</p>
        </div>
        {currentUser?.email?.toLowerCase() === 'admin@kushie.com' && (
          <button
            onClick={() => {
              setShowAddUserForm(!showAddUserForm);
            }}
            className="flex items-center gap-2 bg-spotify-green hover:bg-spotify-green-hover text-black px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={20} className={`transition-transform ${showAddUserForm ? 'rotate-45' : ''}`} />
            {showAddUserForm ? 'Cancel' : 'Add User'}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
        
        <div className="bg-spotify-light-gray rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold text-white">{stats.salesReps}</span>
          </div>
          <p className="text-gray-400 text-sm">Sales Reps</p>
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

      {/* Add User Form Dropdown */}
      {showAddUserForm && (
        <div className="mb-8 bg-spotify-light-gray rounded-xl p-6 border border-spotify-card-hover">
          <h2 className="text-xl font-bold text-white mb-6">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={newUserData.fullName}
                onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green"
                placeholder="Enter user's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green pr-10"
                  placeholder="Enter password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={newUserData.confirmPassword}
                  onChange={(e) => setNewUserData({ ...newUserData, confirmPassword: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green pr-10"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={addUserLoading}
                className="flex-1 bg-spotify-green hover:bg-spotify-green-hover text-black py-2 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addUserLoading ? 'Creating User...' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddUserForm(false);
                  setNewUserData({ fullName: '', email: '', password: '', confirmPassword: '' });
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Form Dropdown */}
      {showEditForm && editingUser && (
        <div className="mb-8 bg-spotify-light-gray rounded-xl p-6 border border-spotify-card-hover">
          <h2 className="text-xl font-bold text-white mb-6">Edit User</h2>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editUserData.fullName}
                onChange={(e) => setEditUserData({ ...editUserData, fullName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green"
                placeholder="Enter user's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={editUserData.phone}
                onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green"
                placeholder="Enter phone number (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                value={editUserData.address}
                onChange={(e) => setEditUserData({ ...editUserData, address: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green"
                placeholder="Enter address (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                License Number
              </label>
              <input
                type="text"
                value={editUserData.licenseNumber}
                onChange={(e) => setEditUserData({ ...editUserData, licenseNumber: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-600 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-spotify-green"
                placeholder="Enter license number (optional)"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={addUserLoading}
                className="flex-1 bg-spotify-green hover:bg-spotify-green-hover text-black py-2 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addUserLoading ? 'Updating User...' : 'Update User'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingUser(null);
                  setEditUserData({ fullName: '', email: '', phone: '', address: '', licenseNumber: '' });
                  setShowEditPassword(false);
                  setShowEditConfirmPassword(false);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
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
            <option value="sales">Sales Reps</option>
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
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Phone</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Address</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">License</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Role</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Actions</th>
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
                          <p className={`text-white font-semibold ${user.isDeleted ? 'line-through opacity-50' : ''}`}>
                            {user.displayName || 'Anonymous'}
                          </p>
                          <p className={`text-gray-400 text-sm flex items-center gap-1 ${user.isDeleted ? 'line-through opacity-50' : ''}`}>
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                          {user.isDeleted && (
                            <p className="text-red-400 text-xs mt-1">Deleted</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      <p className={`text-gray-400 text-sm ${user.isDeleted ? 'line-through opacity-50' : ''}`}>
                        {user.phone || '-'}
                      </p>
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4">
                      <p className={`text-gray-400 text-sm ${user.isDeleted ? 'line-through opacity-50' : ''} max-w-xs`}>
                        {user.address ? (
                          <span className="whitespace-pre-wrap break-words">
                            {user.address.split(',').map((part, index) => (
                              <span key={index}>
                                {part.trim()}
                                {index < user.address.split(',').length - 1 && <br />}
                              </span>
                            ))}
                          </span>
                        ) : (
                          '-'
                        )}
                      </p>
                    </td>

                    {/* License Number */}
                    <td className="px-6 py-4">
                      <p className={`text-gray-400 text-sm ${user.isDeleted ? 'line-through opacity-50' : ''}`}>
                        {user.licenseNumber || '-'}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role || 'customer'}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={!currentUser || currentUser.email?.toLowerCase() !== 'admin@kushie.com' || user.isDeleted}
                        className={`px-3 py-1 rounded-full text-sm font-medium bg-black text-[#CB6015] border border-[#CB6015] focus:bg-black focus:text-[#CB6015] ${
                          !currentUser || currentUser.email?.toLowerCase() !== 'admin@kushie.com' || user.isDeleted
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer'
                        }`}
                        style={{
                          backgroundColor: 'black',
                          color: '#CB6015',
                          borderColor: '#CB6015'
                        }}
                      >
                        <option value="customer" style={{ backgroundColor: 'black', color: '#CB6015' }}>Customer</option>
                        <option value="admin" style={{ backgroundColor: 'black', color: '#CB6015' }}>Admin</option>
                        <option value="sales" style={{ backgroundColor: 'black', color: '#CB6015' }}>Sales Rep</option>
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

                    {/* Actions */}
                    <td className="px-6 py-4">
                      {currentUser?.email?.toLowerCase() === 'admin@kushie.com' && user.id !== currentUser?.uid ? (
                        <div className="flex items-center gap-2">
                          {!user.isDeleted && (
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-1.5 bg-black border border-[#CB6015] text-[#CB6015] rounded-lg hover:bg-[#CB6015] hover:text-black transition-colors"
                              title="Edit user"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                          {user.isDeleted ? (
                            <button
                              onClick={() => handleRestoreUser(user)}
                              className="p-1.5 bg-black border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-colors"
                              title="Restore user"
                            >
                              <UserIcon className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-1.5 bg-black border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-black transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
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