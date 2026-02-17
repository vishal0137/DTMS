import { useState, useEffect } from 'react'
import { MapPin, Clock, Route as RouteIcon, Navigation, Search, Plus, Download } from 'lucide-react'
import axios from '../api/axios'

function Stops() {
  const [stops, setStops] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoute, setSelectedRoute] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log('Fetching stops and routes from API...')
      const [stopsResponse, routesResponse] = await Promise.all([
        axios.get('/api/stops'),
        axios.get('/api/routes')
      ])
      console.log('Stops received:', stopsResponse.data)
      console.log('Routes received:', routesResponse.data)
      setStops(stopsResponse.data)
      setRoutes(routesResponse.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      console.error('Error details:', error.response?.data || error.message)
      setLoading(false)
    }
  }

  const getRouteInfo = (routeId) => {
    return routes.find(r => r.id === routeId)
  }

  const filteredStops = stops.filter(stop => {
    const matchesSearch = stop.stop_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRoute = selectedRoute === 'all' || stop.route_id === parseInt(selectedRoute)
    return matchesSearch && matchesRoute
  })

  const groupedStops = filteredStops.reduce((acc, stop) => {
    const routeId = stop.route_id
    if (!acc[routeId]) {
      acc[routeId] = []
    }
    acc[routeId].push(stop)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-600">Loading stops...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-xl shadow-sm border border-purple-100 p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
              <MapPin className="w-8 h-8 mr-3 text-purple-500" />
              All Stops
            </h2>
            <p className="text-sm text-gray-600 mt-1">{filteredStops.length} stops available</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Add Stop</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all shadow-sm hover:shadow-md btn-ripple group">
              <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
              <span className="hidden sm:inline font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stops by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Route Filter */}
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Routes</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>
                {route.route_number} - {route.route_name}
              </option>
            ))}
          </select>
        </div>

        {/* Stops Display */}
        {Object.keys(groupedStops).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedStops).map(([routeId, routeStops]) => {
              const route = getRouteInfo(parseInt(routeId))
              if (!route) return null

              return (
                <div key={routeId} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 shadow-md">
                  {/* Route Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-purple-200">
                    <div>
                      <h3 className="text-xl font-bold text-purple-900 flex items-center">
                        <RouteIcon className="w-5 h-5 mr-2" />
                        {route.route_number} - {route.route_name}
                      </h3>
                      {route.start_location !== 'Unknown' && route.end_location !== 'Unknown' && (
                        <p className="text-sm text-gray-600 mt-1">
                          {route.start_location} → {route.end_location}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">₹{Math.round(route.fare)}</div>
                      <div className="text-xs text-gray-600">{routeStops.length} stops</div>
                    </div>
                  </div>

                  {/* Stops Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {routeStops
                      .sort((a, b) => a.stop_order - b.stop_order)
                      .map((stop, index) => {
                        const isFirst = index === 0
                        const isLast = index === routeStops.length - 1

                        return (
                          <div
                            key={stop.id}
                            className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-shadow border-l-4 border-purple-500"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {isFirst ? (
                                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <Navigation className="w-5 h-5 text-white" />
                                  </div>
                                ) : isLast ? (
                                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {stop.stop_order}
                                  </div>
                                )}
                                {isFirst && (
                                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">START</span>
                                )}
                                {isLast && (
                                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">END</span>
                                )}
                              </div>
                              <div className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                #{stop.stop_order}
                              </div>
                            </div>

                            <h4 className="font-bold text-gray-800 mb-2">{stop.stop_name}</h4>

                            <div className="space-y-2 text-sm">
                              {stop.estimated_arrival_time && (
                                <div className="flex items-center text-gray-600">
                                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                  <span>{stop.estimated_arrival_time}</span>
                                </div>
                              )}
                              {stop.latitude && stop.longitude && (
                                <div className="flex items-center text-gray-500 text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <MapPin className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-semibold">No stops found</p>
            <p className="text-sm mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stops
