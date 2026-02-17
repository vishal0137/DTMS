import { useState, useEffect } from 'react'
import { Bus, MapPin, Clock, Route as RouteIcon, Navigation, Plus, Download, Calendar, Users, ChevronLeft } from 'lucide-react'
import axios from '../api/axios'

function BusRoutes() {
  const [buses, setBuses] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  const [routes, setRoutes] = useState([])
  const [stops, setStops] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [showBusDetails, setShowBusDetails] = useState(false)

  useEffect(() => {
    fetchBuses()
  }, [])

  const fetchBuses = async () => {
    try {
      console.log('Fetching buses from API...')
      const response = await axios.get('/api/buses')
      console.log('Buses received:', response.data)
      setBuses(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching buses:', error)
      console.error('Error details:', error.response?.data || error.message)
      setLoading(false)
    }
  }

  const handleBusSelect = async (bus) => {
    setSelectedBus(bus)
    setSelectedRoute(null)
    setRoutes([])
    setStops({})
    setShowBusDetails(true)
    
    try {
      const routesResponse = await axios.get(`/api/routes?bus_id=${bus.id}`)
      setRoutes(routesResponse.data)
      
      if (routesResponse.data.length > 0) {
        const routeIds = routesResponse.data.map(r => r.id)
        const stopsPromises = routeIds.map(id => 
          axios.get(`/api/stops?route_id=${id}`)
        )
        const stopsResponses = await Promise.all(stopsPromises)
        
        const stopsMap = {}
        stopsResponses.forEach((response, index) => {
          stopsMap[routeIds[index]] = response.data
        })
        setStops(stopsMap)
        
        if (routesResponse.data.length > 0) {
          setSelectedRoute(routesResponse.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching routes/stops:', error)
    }
  }

  const handleRouteSelect = (route) => {
    setSelectedRoute(route)
  }

  const handleCloseBusDetails = () => {
    setShowBusDetails(false)
    setTimeout(() => {
      setSelectedBus(null)
      setSelectedRoute(null)
      setRoutes([])
      setStops({})
    }, 300)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Bus className="w-12 h-12 text-blue-500 animate-pulse" />
          <div className="text-xl text-gray-600">Loading buses...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-sm border border-blue-100 p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
              <Bus className="w-8 h-8 mr-3 text-blue-500" />
              Bus Fleet & Route Assignments
            </h2>
            <p className="text-sm text-gray-600 mt-1">{buses.length} buses • Schedule & route management</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Assign Route</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bus Fleet Grid - Hide with animation when details shown */}
      <div className={`transition-all duration-500 ${
        showBusDetails 
          ? 'opacity-0 scale-95 h-0 overflow-hidden' 
          : 'opacity-100 scale-100'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {buses.map((bus, index) => (
            <div
              key={bus.id}
              onClick={() => handleBusSelect(bus)}
              className="bg-white rounded-xl border-2 border-gray-200 p-4 cursor-pointer transition-all duration-300 hover-lift hover:border-blue-300 animate-scaleIn"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{bus.bus_number}</h3>
                    <p className="text-xs text-gray-500">{bus.bus_type}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${bus.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              </div>
              
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Reg:</span>
                  <span className="font-semibold">{bus.registration_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Capacity:</span>
                  <span className="font-semibold">{bus.capacity} seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className={`font-semibold ${bus.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                    {bus.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Bus Details - Show with animation */}
      {selectedBus && (
        <div className={`space-y-6 transition-all duration-500 ${
          showBusDetails 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-10 h-0 overflow-hidden'
        }`}>
          {/* Bus Info Card with Back Button */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 animate-fadeIn">
            <button
              onClick={handleCloseBusDetails}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all shadow-sm mb-4 btn-ripple group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Fleet</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Bus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{selectedBus.bus_number}</h3>
                  <p className="text-blue-100">{selectedBus.registration_number}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-sm text-blue-100">Type</div>
                    <div className="text-lg font-semibold">{selectedBus.bus_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-100">Capacity</div>
                    <div className="text-lg font-semibold">{selectedBus.capacity} seats</div>
                  </div>
                  <div>
                    <div className={`px-4 py-2 rounded-full font-semibold ${
                      selectedBus.is_active ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {selectedBus.is_active ? '● ACTIVE' : '● INACTIVE'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Routes */}
          {routes.length > 0 ? (
            <>
              {/* Route Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <RouteIcon className="w-5 h-5 text-blue-500" />
                  Assigned Routes ({routes.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {routes.map((route, index) => (
                    <button
                      key={route.id}
                      onClick={() => handleRouteSelect(route)}
                      className={`text-left p-4 rounded-lg border-2 transition-all hover-lift animate-scaleIn ${
                        selectedRoute?.id === route.id
                          ? 'border-blue-400 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800">{route.route_number}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          route.is_active 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}>
                          {route.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{route.route_name}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{route.distance_km.toFixed(1)} km</span>
                        <span>{route.estimated_duration_minutes} min</span>
                        <span className="font-semibold text-green-600">₹{Math.round(route.fare)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Route Schedule Details */}
              {selectedRoute && stops[selectedRoute.id] && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  {/* Schedule Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-500" />
                        Route Schedule: {selectedRoute.route_number}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{selectedRoute.route_name}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Distance</div>
                        <div className="text-xl font-bold text-blue-600">{selectedRoute.distance_km.toFixed(1)} km</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="text-xl font-bold text-orange-600">{selectedRoute.estimated_duration_minutes} min</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Fare</div>
                        <div className="text-xl font-bold text-green-600">₹{Math.round(selectedRoute.fare)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stop Timeline */}
                  <div className="space-y-3 mb-6">
                    {stops[selectedRoute.id]
                      .sort((a, b) => a.stop_order - b.stop_order)
                      .map((stop, index, array) => {
                        const isFirst = index === 0
                        const isLast = index === array.length - 1
                        
                        return (
                          <div 
                            key={stop.id}
                            className="relative flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all animate-slideIn"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-transform hover:scale-110 ${
                                isFirst ? 'bg-green-500 text-white' :
                                isLast ? 'bg-red-500 text-white' :
                                'bg-blue-500 text-white'
                              }`}>
                                {stop.stop_order}
                              </div>
                            </div>

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

                  {/* Route Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover-lift">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">Total Stops</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">{stops[selectedRoute.id].length}</div>
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
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center animate-fadeIn">
              <RouteIcon className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Routes Assigned</h3>
              <p className="text-gray-500">This bus has no routes assigned yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BusRoutes
