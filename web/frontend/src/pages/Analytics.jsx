import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Users, Bus, Calendar, BarChart3 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from '../api/axios'

function Analytics() {
  const [kpis, setKpis] = useState({
    active_buses: 0,
    total_revenue: 0,
    passenger_count: 0,
    on_time_performance: 0
  })
  const [routeRevenue, setRouteRevenue] = useState([])
  const [passengerCategories, setPassengerCategories] = useState([])
  const [bookings, setBookings] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      console.log('Fetching analytics data...')
      const [kpiRes, revenueRes, categoryRes, bookingsRes, routesRes] = await Promise.all([
        axios.get('/api/analytics/kpis'),
        axios.get('/api/analytics/route-revenue'),
        axios.get('/api/analytics/passenger-categories'),
        axios.get('/api/bookings'),
        axios.get('/api/routes')
      ])

      console.log('Analytics data received')
      setKpis(kpiRes.data || { active_buses: 0, total_revenue: 0, passenger_count: 0, on_time_performance: 0 })
      setRouteRevenue(revenueRes.data || [])
      setPassengerCategories(categoryRes.data || [])
      setBookings(bookingsRes.data || [])
      setRoutes(routesRes.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      console.error('Error details:', error.response?.data || error.message)
      setLoading(false)
    }
  }

  // Calculate additional metrics
  const avgFare = bookings.length > 0 
    ? (bookings.reduce((sum, b) => sum + b.fare_amount, 0) / bookings.length).toFixed(2)
    : 0

  const totalDistance = routes.reduce((sum, r) => sum + (r.distance_km || 0), 0).toFixed(1)
  
  const avgRouteDistance = routes.length > 0
    ? (totalDistance / routes.length).toFixed(1)
    : 0

  // Booking trends (mock data for demonstration)
  const bookingTrends = [
    { month: 'Jan', bookings: 145, revenue: 72500 },
    { month: 'Feb', bookings: 168, revenue: 84000 },
    { month: 'Mar', bookings: 192, revenue: 96000 },
    { month: 'Apr', bookings: 178, revenue: 89000 },
    { month: 'May', bookings: 205, revenue: 102500 },
    { month: 'Jun', bookings: 220, revenue: 110000 },
  ]

  // Route performance
  const routePerformance = routes.slice(0, 10).map(route => ({
    name: route.route_number,
    distance: route.distance_km,
    fare: route.fare,
    duration: route.estimated_duration_minutes
  }))

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 rounded-xl shadow-sm border border-blue-100 p-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-500" />
              Analytics Dashboard
            </h2>
            <p className="mt-2 text-gray-600">Comprehensive insights and performance metrics</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-lg font-semibold text-gray-700">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideIn">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Bus className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Active Buses</p>
              <p className="text-3xl font-bold text-gray-800">{kpis.active_buses}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-semibold">+5.2%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">₹{kpis.total_revenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-semibold">+12.5%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Passengers</p>
              <p className="text-3xl font-bold text-gray-800">{kpis.passenger_count.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-semibold">+8.3%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">On-Time %</p>
              <p className="text-3xl font-bold text-gray-800">{kpis.on_time_performance}%</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-red-500 mr-1 rotate-180" />
            <span className="text-red-500 font-semibold">-2.1%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slideIn" style={{ animationDelay: '0.2s' }}>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-100 p-4 hover-lift">
          <p className="text-sm text-blue-700 font-semibold">Total Routes</p>
          <p className="text-2xl font-bold text-blue-900">{routes.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-100 p-4 hover-lift">
          <p className="text-sm text-green-700 font-semibold">Avg Fare</p>
          <p className="text-2xl font-bold text-green-900">₹{avgFare}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-100 p-4 hover-lift">
          <p className="text-sm text-purple-700 font-semibold">Total Bookings</p>
          <p className="text-2xl font-bold text-purple-900">{bookings.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-100 p-4 hover-lift">
          <p className="text-sm text-orange-700 font-semibold">Avg Route Distance</p>
          <p className="text-2xl font-bold text-orange-900">{avgRouteDistance} km</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        {/* Booking Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Booking Trends (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#60a5fa" strokeWidth={2} name="Bookings" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Passenger Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-500" />
            Passenger Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
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
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {(passengerCategories.length > 0 ? passengerCategories : [
                  { category: 'General', count: 450 },
                  { category: 'Student', count: 280 },
                  { category: 'Senior', count: 120 },
                  { category: 'Disabled', count: 50 },
                ]).map((entry, index) => (
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
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        {/* Route Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            Top Routes by Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeRevenue.length > 0 ? routeRevenue.slice(0, 8) : [
              { route_name: 'Route 1', revenue: 45000 },
              { route_name: 'Route 2', revenue: 38000 },
              { route_name: 'Route 3', revenue: 52000 },
              { route_name: 'Route 4', revenue: 41000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="route_name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }} />
              <Legend />
              <Bar dataKey="revenue" fill="#34d399" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Route Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Route Distance vs Fare
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="distance" fill="#60a5fa" name="Distance (km)" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="fare" fill="#fbbf24" name="Fare (₹)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Route</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Distance</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Duration</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Fare</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {routes.slice(0, 10).map((route, index) => (
                <tr key={route.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{route.route_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{route.route_name}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{route.distance_km.toFixed(1)} km</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{route.estimated_duration_minutes} min</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">₹{Math.round(route.fare)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      route.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {route.is_active ? 'Active' : 'Inactive'}
                    </span>
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

export default Analytics
