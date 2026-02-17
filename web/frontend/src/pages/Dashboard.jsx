import { useState, useEffect } from 'react'
import { 
  Bus, DollarSign, Users, Clock, TrendingUp, TrendingDown, 
  MapPin, Route, Calendar, AlertCircle, CheckCircle, Activity,
  Ticket, CreditCard, UserCheck, Navigation, Bell, Plus, 
  Edit, Trash2, Eye, Download, Upload, Settings, RefreshCw
} from 'lucide-react'
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts'
import KPICard from '../components/KPICard'
import LiveMap from '../components/LiveMap'
import axios from '../api/axios'

function Dashboard() {
  const [kpis, setKpis] = useState({
    active_buses: 0,
    total_revenue: 0,
    passenger_count: 0,
    on_time_performance: 0
  })
  const [routeRevenue, setRouteRevenue] = useState([])
  const [passengerCategories, setPassengerCategories] = useState([])
  const [liveBuses, setLiveBuses] = useState([])
  const [systemStats, setSystemStats] = useState({
    totalRoutes: 0,
    totalStops: 0,
    totalBookings: 0,
    totalUsers: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'System running smoothly - All buses operational', time: '2 min ago' },
    { id: 2, type: 'warning', message: '3 routes need schedule updates', time: '15 min ago' },
    { id: 3, type: 'info', message: '25 new bookings today', time: '1 hour ago' }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
    
    // Refresh live data every 10 seconds
    const interval = setInterval(() => {
      fetchLiveBuses()
      fetchRecentBookings()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchAnalytics(),
        fetchLiveBuses(),
        fetchSystemStats(),
        fetchRecentBookings()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const [kpiRes, revenueRes, categoryRes] = await Promise.all([
        axios.get('/api/analytics/kpis'),
        axios.get('/api/analytics/route-revenue'),
        axios.get('/api/analytics/passenger-categories')
      ])

      setKpis(kpiRes.data)
      setRouteRevenue(revenueRes.data)
      setPassengerCategories(categoryRes.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchLiveBuses = async () => {
    try {
      const response = await axios.get('/api/buses/live-locations')
      setLiveBuses(response.data || [])
    } catch (error) {
      console.error('Error fetching live buses:', error)
    }
  }

  const fetchSystemStats = async () => {
    try {
      const [routesRes, stopsRes, bookingsRes, usersRes] = await Promise.all([
        axios.get('/api/routes'),
        axios.get('/api/stops'),
        axios.get('/api/bookings'),
        axios.get('/api/users')
      ])

      setSystemStats({
        totalRoutes: routesRes.data?.length || 0,
        totalStops: stopsRes.data?.length || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalUsers: usersRes.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching system stats:', error)
    }
  }

  const fetchRecentBookings = async () => {
    try {
      const response = await axios.get('/api/bookings')
      const bookings = response.data || []
      // Get last 5 bookings
      setRecentBookings(bookings.slice(-5).reverse())
    } catch (error) {
      console.error('Error fetching recent bookings:', error)
    }
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e']

  const weeklyRevenueData = [
    { day: 'Mon', revenue: 45000, bookings: 120 },
    { day: 'Tue', revenue: 52000, bookings: 145 },
    { day: 'Wed', revenue: 48000, bookings: 132 },
    { day: 'Thu', revenue: 61000, bookings: 168 },
    { day: 'Fri', revenue: 55000, bookings: 151 },
    { day: 'Sat', revenue: 38000, bookings: 98 },
    { day: 'Sun', revenue: 42000, bookings: 110 },
  ]

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300'
    }
    return badges[status?.toLowerCase()] || badges.pending
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 text-gray-800 rounded-xl shadow-sm p-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to DTMS Admin Dashboard
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="relative">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                </div>
                <span className="font-semibold text-gray-700">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notifications & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift animate-slideIn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5 text-blue-500" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </div>
              Admin Notifications
            </h2>
            <button className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <div 
                key={notif.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md stagger-item ${
                  notif.type === 'success' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                  notif.type === 'warning' ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' :
                  'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 animate-bounce-subtle" />}
                    {notif.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 animate-bounce-subtle" />}
                    {notif.type === 'info' && <Activity className="w-5 h-5 text-blue-600 mt-0.5 animate-bounce-subtle" />}
                    <div>
                      <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift animate-slideIn" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">Add New Bus</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Route className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">Create Route</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Ticket className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">New Booking</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
              <span className="font-medium">Export Reports</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium">Sync Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Buses"
          value={kpis.active_buses}
          icon={Bus}
          color="bg-blue-500"
          trend={5.2}
        />
        <KPICard
          title="Today's Revenue"
          value={`₹${kpis.total_revenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-green-500"
          trend={12.5}
        />
        <KPICard
          title="Total Passengers"
          value={kpis.passenger_count.toLocaleString()}
          icon={Users}
          color="bg-purple-500"
          trend={8.3}
        />
        <KPICard
          title="On-Time Performance"
          value={`${kpis.on_time_performance}%`}
          icon={Clock}
          color="bg-orange-500"
          trend={-2.1}
        />
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slideIn" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-xl shadow-sm border border-cyan-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Routes</p>
              <p className="text-2xl font-bold text-gray-800">{systemStats.totalRoutes}</p>
            </div>
            <Route className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Stops</p>
              <p className="text-2xl font-bold text-gray-800">{systemStats.totalStops}</p>
            </div>
            <MapPin className="w-10 h-10 text-pink-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-800">{systemStats.totalBookings}</p>
            </div>
            <Ticket className="w-10 h-10 text-indigo-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Registered Users</p>
              <p className="text-2xl font-bold text-gray-800">{systemStats.totalUsers}</p>
            </div>
            <UserCheck className="w-10 h-10 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        {/* Weekly Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Weekly Revenue Trend
            </h3>
            <span className="text-sm text-gray-500">Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Route Revenue Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-500" />
              Top Routes by Revenue
            </h3>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeRevenue.length > 0 ? routeRevenue.slice(0, 6) : [
              { route_name: 'Route 1', revenue: 45000 },
              { route_name: 'Route 2', revenue: 38000 },
              { route_name: 'Route 3', revenue: 52000 },
              { route_name: 'Route 4', revenue: 41000 },
              { route_name: 'Route 5', revenue: 35000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="route_name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="revenue" fill="#60a5fa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        {/* Passenger Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Passenger Categories
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={passengerCategories.length > 0 ? passengerCategories : [
                  { category: 'General', count: 450 },
                  { category: 'Student', count: 280 },
                  { category: 'Senior', count: 120 },
                  { category: 'Disabled', count: 50 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="count"
              >
                {(passengerCategories.length > 0 ? passengerCategories : [
                  { category: 'General', count: 450 },
                  { category: 'Student', count: 280 },
                  { category: 'Senior', count: 120 },
                  { category: 'Disabled', count: 50 },
                ]).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-indigo-500" />
            Recent Bookings
          </h3>
          <div className="space-y-3">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking, index) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:from-indigo-50 hover:to-white transition-all border border-gray-100 hover:border-indigo-200 stagger-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Ticket className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Booking #{booking.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.booking_date).toLocaleDateString()} • 
                        {booking.seats_booked} seat{booking.seats_booked > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-600">₹{booking.total_fare}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No recent bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Bus Tracking */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-500" />
            Live Bus Tracking
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">
              {liveBuses.length} Active Bus{liveBuses.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
        <LiveMap buses={liveBuses} />
      </div>
    </div>
  )
}

export default Dashboard
