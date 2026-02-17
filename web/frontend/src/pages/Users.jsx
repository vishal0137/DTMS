import { useState, useEffect } from 'react'
import { Users as UsersIcon, Search, Filter, Mail, Phone, Wallet, Shield, User, CheckCircle, XCircle, Edit, Trash2, Plus, Download, Upload, RefreshCw, UserPlus } from 'lucide-react'
import axios from '../api/axios'

function Users() {
  const [users, setUsers] = useState([])
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    passengers: 0,
    active: 0,
    totalWalletBalance: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log('Fetching users...')
      const usersRes = await axios.get('/api/users')
      
      console.log('Users received:', usersRes.data)
      setUsers(usersRes.data || [])
      
      // Calculate stats
      const usersData = usersRes.data || []
      const stats = {
        total: usersData.length,
        admins: usersData.filter(u => u.role === 'admin').length,
        passengers: usersData.filter(u => u.role === 'passenger').length,
        active: usersData.filter(u => u.is_active).length,
        totalWalletBalance: 0 // Will be calculated if wallet data is available
      }
      setStats(stats)
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      console.error('Error details:', error.response?.data || error.message)
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'passenger':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Shield className="w-4 h-4" />
      case 'passenger':
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-sm border border-indigo-100 p-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <UsersIcon className="w-8 h-8 mr-3 text-indigo-500" />
              User Management
            </h2>
            <p className="mt-2 text-gray-600">Manage system users and their accounts</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg hover:from-indigo-100 hover:to-indigo-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Add User</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Upload className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Import</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slideIn">
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-indigo-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Passengers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.passengers}</p>
            </div>
            <User className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="passenger">Passengers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            User List ({filteredUsers.length})
          </h3>

          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const createdDate = new Date(user.created_at)

                return (
                  <div
                    key={user.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-3 rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                          }`}>
                            {user.role === 'admin' ? (
                              <Shield className="w-6 h-6 text-purple-600" />
                            ) : (
                              <User className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-gray-800">
                              {user.full_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              User ID: #{user.id}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Email */}
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="font-semibold text-gray-800 text-sm">{user.email}</p>
                            </div>
                          </div>

                          {/* Phone */}
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-semibold text-gray-800 text-sm">{user.phone}</p>
                              </div>
                            </div>
                          )}

                          {/* Member Since */}
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Member Since</p>
                              <p className="font-semibold text-gray-800 text-sm">
                                {createdDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Role & Status */}
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 ${getRoleBadge(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="font-semibold text-sm capitalize">{user.role}</span>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-2">
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold">No users found</p>
              <p className="text-sm mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* User Statistics Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Role</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">#{user.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{user.full_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Users
