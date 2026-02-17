import { useState, useEffect } from 'react'
import { Ticket, Search, Filter, Calendar, User, MapPin, DollarSign, CheckCircle, XCircle, Clock, Plus, Edit, Trash2, Download, RefreshCw, Eye } from 'lucide-react'
import axios from '../api/axios'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log('Fetching bookings...')
      const [bookingsRes, routesRes] = await Promise.all([
        axios.get('/api/bookings'),
        axios.get('/api/routes')
      ])
      
      console.log('Bookings received:', bookingsRes.data)
      setBookings(bookingsRes.data || [])
      setRoutes(routesRes.data || [])
      
      // Calculate stats
      const bookingsData = bookingsRes.data || []
      const stats = {
        total: bookingsData.length,
        confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
        completed: bookingsData.filter(b => b.status === 'completed').length,
        cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
        totalRevenue: bookingsData.reduce((sum, b) => sum + (b.fare_amount || 0), 0)
      }
      setStats(stats)
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      console.error('Error details:', error.response?.data || error.message)
      setLoading(false)
    }
  }

  const getRouteInfo = (routeId) => {
    return routes.find(r => r.id === routeId)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.passenger_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading bookings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-xl shadow-sm border border-purple-100 p-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
              <Ticket className="w-8 h-8 mr-3 text-purple-500" />
              Bookings Management
            </h2>
            <p className="mt-2 text-gray-600">Manage and track all passenger bookings</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">New Booking</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline font-medium">Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-slideIn">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Ticket className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
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
              placeholder="Search by booking reference or passenger name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none appearance-none"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Booking List ({filteredBookings.length})
          </h3>

          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const route = getRouteInfo(booking.route_id)
                const journeyDate = new Date(booking.journey_date)

                return (
                  <div
                    key={booking.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Ticket className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-gray-800">
                              {booking.booking_reference}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Booking ID: #{booking.id}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Passenger */}
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Passenger</p>
                              <p className="font-semibold text-gray-800">{booking.passenger_name}</p>
                              <p className="text-xs text-gray-600 capitalize">{booking.passenger_category}</p>
                            </div>
                          </div>

                          {/* Route */}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Route</p>
                              <p className="font-semibold text-gray-800">
                                {route?.route_number || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-600">{route?.route_name || 'Unknown'}</p>
                            </div>
                          </div>

                          {/* Journey Date */}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Journey Date</p>
                              <p className="font-semibold text-gray-800">
                                {journeyDate.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-600">Seat: {booking.seat_number}</p>
                            </div>
                          </div>

                          {/* Fare */}
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Fare Amount</p>
                              <p className="font-semibold text-green-600 text-lg">
                                ₹{booking.fare_amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Status */}
                      <div className="ml-4">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="font-semibold text-sm capitalize">{booking.status}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-right">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold">No bookings found</p>
              <p className="text-sm mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bookings
