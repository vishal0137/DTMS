import { useState, useEffect } from 'react'
import { Route as RouteIcon, MapPin, Clock, Bus, Navigation, ArrowRight, Plus, Download, Upload, Search, Calendar, Users, X, ChevronLeft } from 'lucide-react'
import axios from '../api/axios'

function Routes() {
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      console.log('Fetching routes from API...')
      const response = await axios.get('/api/routes')
      console.log('Routes received:', response.data)
      setRoutes(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching routes:', error)
      console.error('Error details:', error.response?.data || error.message)
      setLoading(false)
    }
  }

  const handleRouteSelect = async (route) => {
    setSelectedRoute(route)
    setShowDetails(true)
    
    try {
      console.log('Fetching stops for route:', route.id)
      const response = await axios.get(`/api/stops?route_id=${route.id}`)
      console.log('Stops received:', response.data)
      setStops(response.data)
    } catch (error) {
      console.error('Error fetching stops:', error)
    }
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setTimeout(() => {
      setSelectedRoute(null)
      setStops([])
    }, 300) // Wait for animation to complete
  }

  const filteredRoutes = routes.filter(route => 
    route.route_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.route_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateTravelTime = (stops) => {
    if (stops.length < 2) return 0
    const sortedStops = [...stops].sort((a, b) => a.stop_order - b.stop_order)
    const firstStop = sortedStops[0]
    const lastStop = sortedStops[sortedStops.length - 1]
    
    if (firstStop.estimated_arrival_time && lastStop.estimated_arrival_time) {
      const start = new Date(`2000-01-01 ${firstStop.estimated_arrival_time}`)
      const end = new Date(`2000-01-01 ${lastStop.estimated_arrival_time}`)
      return Math.round((end - start) / (1000 * 60))
    }
    return 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Bus className="w-12 h-12 text-blue-500 animate-pulse" />
          <div className="text-xl text-gray-600">Loading routes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-sm border border-green-100 p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center">
              <RouteIcon className="w-8 h-8 mr-3 text-green-500" />
              Bus Routes & Schedules
            </h2>
            <p className="text-sm text-gray-600 mt-1">{routes.length} routes • Real-time schedule information</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Add Route</span>
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

        {/* Search Bar - Only show when not viewing details */}
        {!showDetails && (
          <div className="relative animate-fadeIn">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes by number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all"
            />
          </div>
        )}
      </div>

      {/* Routes Grid - Hide with animation when details shown */}
      <div className={`transition-all duration-500 ${
        showDetails 
          ? 'opacity-0 scale-95 h-0 overflow-hidden' 
          : 'opacity-100 scale-100'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route, index) => (
            <div
              key={route.id}
              onClick={() => handleRouteSelect(route)}
              className="bg-white rounded-xl border-2 border-gray-200 p-5 cursor-pointer transition-all duration-300 hover-lift hover:border-green-300 animate-scaleIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Route Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                    <Bus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{route.route_number}</h3>
                    <p className="text-xs text-gray-500">Route ID: {route.id}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  route.is_active 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {route.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              {/* Route Name */}
              <h4 className="text-sm font-semibold text-gray-700 mb-3 line-clamp-2">
                {route.route_name}
              </h4>

              {/* Route Details */}
              <div className="space-y-2">
                {route.start_location !== 'Unknown' && route.end_location !== 'Unknown' && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span className="text-gray-700 truncate">{route.start_location}</span>
                      <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 truncate">{route.end_location}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{route.distance_km.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700">{route.estimated_duration_minutes} min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Base Fare</span>
                  <span className="text-lg font-bold text-green-600">₹{Math.round(route.fare)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Route Schedule - Show with animation */}
      {selectedRoute && (
        <div className={`transition-all duration-500 ${
          showDetails 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-10 h-0 overflow-hidden'
        }`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Back Button & Schedule Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCloseDetails}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm hover:shadow-md btn-ripple group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="font-medium">Back to Routes</span>
                </button>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-green-500" />
                    Route Schedule: {selectedRoute.route_number}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedRoute.route_name}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Travel Time</div>
                <div className="text-2xl font-bold text-blue-600">
                  {calculateTravelTime(stops) || selectedRoute.estimated_duration_minutes} min
                </div>
              </div>
            </div>

            {/* Schedule Timeline */}
            {stops.length > 0 && (
              <div className="space-y-3 mb-6">
                {stops
                  .sort((a, b) => a.stop_order - b.stop_order)
                  .map((stop, index, array) => {
                    const isFirst = index === 0
                    const isLast = index === array.length - 1
                    
                    return (
                      <div 
                        key={stop.id} 
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-green-200 hover:shadow-md transition-all animate-slideIn"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {/* Stop Number */}
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-transform hover:scale-110 ${
                            isFirst ? 'bg-green-500 text-white' :
                            isLast ? 'bg-red-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {stop.stop_order}
                          </div>
                        </div>

                        {/* Stop Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {isFirst && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded animate-pulse">
                                START
                              </span>
                            )}
                            {isLast && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded animate-pulse">
                                END
                              </span>
                            )}
                            <h4 className="font-semibold text-gray-800 truncate">{stop.stop_name}</h4>
                          </div>
                          {stop.latitude && stop.longitude && (
                            <p className="text-xs text-gray-500">
                              <MapPin className="w-3 h-3 inline mr-1" />
                              {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                            </p>
                          )}
                        </div>

                        {/* Arrival Time */}
                        <div className="flex-shrink-0 text-right">
                          {stop.estimated_arrival_time ? (
                            <>
                              <div className="text-xs text-gray-500 mb-1">Arrival</div>
                              <div className="flex items-center gap-1 text-lg font-bold text-blue-600">
                                <Clock className="w-4 h-4" />
                                {stop.estimated_arrival_time}
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-gray-400">No schedule</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}

            {/* Route Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover-lift">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Total Stops</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{stops.length}</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 hover-lift">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">Distance</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{selectedRoute.distance_km.toFixed(1)} km</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 hover-lift">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-900">Duration</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">{selectedRoute.estimated_duration_minutes} min</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 hover-lift">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-900">Base Fare</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">₹{Math.round(selectedRoute.fare)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Routes
