import { useState, useEffect, useRef } from 'react'
import { 
  Bus, MapPin, Clock, Navigation, Activity, AlertCircle, 
  CheckCircle, Play, Pause, RotateCcw, Zap, Users, Route,
  Calendar, Timer, TrendingUp, Wifi, Signal, Battery,
  Cloud, Sun, CloudRain, Thermometer, Wind, ArrowRight
} from 'lucide-react'

// Dummy data for 2 bus routes
const DUMMY_ROUTES = [
  {
    id: 1,
    route_number: "R001",
    route_name: "Central Station - Airport",
    start_location: "Central Station",
    end_location: "Airport Terminal",
    distance_km: 25.5,
    estimated_duration_minutes: 45,
    fare: 50,
    color: "#3b82f6"
  },
  {
    id: 2,
    route_number: "R002", 
    route_name: "University - Mall",
    start_location: "University Campus",
    end_location: "Shopping Mall",
    distance_km: 18.2,
    estimated_duration_minutes: 35,
    fare: 35,
    color: "#10b981"
  }
]

const DUMMY_STOPS = {
  1: [
    { id: 1, stop_name: "Central Station", stop_order: 1, estimated_arrival_time: "08:00" },
    { id: 2, stop_name: "City Center", stop_order: 2, estimated_arrival_time: "08:12" },
    { id: 3, stop_name: "Business District", stop_order: 3, estimated_arrival_time: "08:25" },
    { id: 4, stop_name: "Metro Junction", stop_order: 4, estimated_arrival_time: "08:35" },
    { id: 5, stop_name: "Airport Terminal", stop_order: 5, estimated_arrival_time: "08:45" }
  ],
  2: [
    { id: 6, stop_name: "University Campus", stop_order: 1, estimated_arrival_time: "09:00" },
    { id: 7, stop_name: "Library Square", stop_order: 2, estimated_arrival_time: "09:08" },
    { id: 8, stop_name: "Park Avenue", stop_order: 3, estimated_arrival_time: "09:18" },
    { id: 9, stop_name: "Downtown", stop_order: 4, estimated_arrival_time: "09:28" },
    { id: 10, stop_name: "Shopping Mall", stop_order: 5, estimated_arrival_time: "09:35" }
  ]
}

const DUMMY_BUSES = [
  { id: 1, bus_number: "DTC-101", route_id: 1, registration_number: "DL-1C-1001" },
  { id: 2, bus_number: "DTC-102", route_id: 1, registration_number: "DL-1C-1002" },
  { id: 3, bus_number: "DTC-201", route_id: 2, registration_number: "DL-1C-2001" },
  { id: 4, bus_number: "DTC-202", route_id: 2, registration_number: "DL-1C-2002" }
]

function LiveTracking() {
  const [selectedRoute, setSelectedRoute] = useState(DUMMY_ROUTES[0])
  const [routes] = useState(DUMMY_ROUTES)
  const [liveBuses] = useState(DUMMY_BUSES)
  const [routeStops, setRouteStops] = useState(DUMMY_STOPS[1])
  const [busPositions, setBusPositions] = useState({})
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedBus, setSelectedBus] = useState(null)
  const [weatherCondition, setWeatherCondition] = useState('sunny')
  const intervalRef = useRef(null)

  useEffect(() => {
    // Initialize bus positions
    const initialPositions = {}
    liveBuses.forEach(bus => {
      initialPositions[bus.id] = {
        currentStopIndex: Math.floor(Math.random() * routeStops.length),
        progress: Math.random() * 100,
        direction: Math.random() > 0.5 ? 1 : -1,
        speed: 30 + Math.random() * 30,
        passengers: Math.floor(Math.random() * 40) + 10,
        delay: Math.floor(Math.random() * 10) - 5,
        status: 'moving'
      }
    })
    setBusPositions(initialPositions)

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Update bus positions every 2 seconds
    const busInterval = setInterval(() => {
      if (isPlaying) {
        updateBusPositions()
      }
    }, 2000)

    intervalRef.current = busInterval

    return () => {
      clearInterval(timeInterval)
      clearInterval(busInterval)
    }
  }, [isPlaying])

  useEffect(() => {
    if (selectedRoute) {
      setRouteStops(DUMMY_STOPS[selectedRoute.id] || [])
    }
  }, [selectedRoute])

  const updateBusPositions = () => {
    setBusPositions(prev => {
      const newPositions = { ...prev }
      
      liveBuses
        .filter(bus => bus.route_id === selectedRoute?.id)
        .forEach(bus => {
          if (!newPositions[bus.id]) return
          
          const pos = newPositions[bus.id]
          const stops = DUMMY_STOPS[selectedRoute.id] || []
          
          // Update progress
          pos.progress += 3 + Math.random() * 4
          
          if (pos.progress >= 100) {
            pos.progress = 0
            pos.currentStopIndex += pos.direction
            
            // Reverse at route ends
            if (pos.currentStopIndex >= stops.length - 1) {
              pos.direction = -1
              pos.currentStopIndex = stops.length - 1
            } else if (pos.currentStopIndex <= 0) {
              pos.direction = 1
              pos.currentStopIndex = 0
            }
            
            // Update passenger count at stops
            const change = Math.floor(Math.random() * 10) - 5
            pos.passengers = Math.max(5, Math.min(50, pos.passengers + change))
          }
          
          // Update speed and delay
          pos.speed = 25 + Math.random() * 35
          pos.delay += (Math.random() - 0.5) * 0.5
          pos.delay = Math.max(-10, Math.min(15, pos.delay))
        })
      
      return newPositions
    })
  }

  const getBusPosition = (busId) => {
    const position = busPositions[busId]
    if (!position || routeStops.length === 0) return { left: '10%' }
    
    const stopIndex = position.currentStopIndex
    const progress = position.progress / 100
    
    // Calculate position along the route line
    const basePosition = (stopIndex / (routeStops.length - 1)) * 80 + 10
    const nextStopIndex = stopIndex + position.direction
    const nextPosition = ((nextStopIndex) / (routeStops.length - 1)) * 80 + 10
    const currentPosition = basePosition + (nextPosition - basePosition) * progress
    
    return {
      left: `${Math.max(5, Math.min(95, currentPosition))}%`
    }
  }

  const getBusStatus = (busId) => {
    const position = busPositions[busId]
    if (!position) return 'Unknown'
    
    const currentStop = routeStops[position.currentStopIndex]
    const nextStopIndex = position.currentStopIndex + position.direction
    const nextStop = routeStops[nextStopIndex]
    
    if (position.progress < 10) {
      return `At ${currentStop?.stop_name || 'Stop'}`
    } else if (nextStop) {
      return `En route to ${nextStop.stop_name}`
    } else {
      return `Moving along route`
    }
  }

  const getDelayStatus = (delay) => {
    if (delay <= -2) return { text: 'Early', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (delay <= 2) return { text: 'On Time', color: 'text-green-600', bg: 'bg-green-50' }
    if (delay <= 5) return { text: 'Delayed', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { text: 'Very Delayed', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Live Bus Tracking
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-gray-800 mb-1">
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Updates
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="capitalize">{weatherCondition}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {routes.map(route => {
          const routeBuses = liveBuses.filter(bus => bus.route_id === route.id)
          const isSelected = selectedRoute?.id === route.id
          
          return (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`bg-white rounded-2xl shadow-sm border-2 transition-all cursor-pointer p-6 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-blue-500' : 'bg-gray-100'
                  }`}>
                    <Bus className={`w-6 h-6 ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{route.route_number}</h3>
                    <p className="text-sm text-gray-600">{routeBuses.length} buses active</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">₹{route.fare}</div>
                  <div className="text-sm text-gray-500">{route.distance_km} km</div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">{route.route_name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{route.start_location}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{route.end_location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{route.estimated_duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{DUMMY_STOPS[route.id]?.length || 0} stops</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedRoute && (
        <>
          {/* Route Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedRoute.route_number} - {selectedRoute.route_name}
                </h2>
                <p className="text-gray-600">
                  {selectedRoute.start_location} → {selectedRoute.end_location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    isPlaying 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
            </div>

            {/* Route Timeline */}
            <div className="relative">
              {/* Route Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-green-300 via-blue-300 to-red-300 rounded-full"></div>
              
              {/* Stops */}
              <div className="relative flex justify-between items-start py-4">
                {routeStops.map((stop, index) => {
                  const isFirst = index === 0
                  const isLast = index === routeStops.length - 1
                  
                  return (
                    <div
                      key={stop.id}
                      className="flex flex-col items-center relative"
                      style={{ width: `${100 / routeStops.length}%` }}
                    >
                      {/* Stop Circle */}
                      <div className={`w-4 h-4 rounded-full border-2 z-10 transition-all duration-500 ${
                        isFirst ? 'bg-green-500 border-green-600' :
                        isLast ? 'bg-red-500 border-red-600' :
                        'bg-white border-gray-300'
                      }`}></div>
                      
                      {/* Stop Info */}
                      <div className="mt-3 text-center">
                        <div className="font-medium text-sm text-gray-900 mb-1">
                          {stop.stop_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stop.estimated_arrival_time}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Moving Buses */}
              {liveBuses
                .filter(bus => bus.route_id === selectedRoute.id)
                .map(bus => {
                  const position = getBusPosition(bus.id)
                  const busData = busPositions[bus.id]
                  const delayInfo = busData ? getDelayStatus(busData.delay) : { text: 'On Time', color: 'text-green-600', bg: 'bg-green-50' }
                  
                  return (
                    <div
                      key={bus.id}
                      className="absolute top-6 z-20 transition-all duration-2000 ease-in-out transform -translate-x-1/2"
                      style={position}
                    >
                      <div 
                        className={`relative cursor-pointer transition-all duration-300 hover:scale-110 ${
                          selectedBus?.id === bus.id ? 'scale-125' : ''
                        }`}
                        onClick={() => setSelectedBus(selectedBus?.id === bus.id ? null : bus)}
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-lg shadow-lg flex items-center justify-center animate-pulse">
                          <Bus className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Bus Info Popup */}
                        {selectedBus?.id === bus.id && busData && (
                          <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-64 z-30">
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-800">Bus {bus.bus_number}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${delayInfo.bg} ${delayInfo.color}`}>
                                  {delayInfo.text}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-2">
                                {getBusStatus(bus.id)}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-blue-500" />
                                  <span>{Math.round(busData.speed)} km/h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-green-500" />
                                  <span>{busData.passengers} passengers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Timer className="w-4 h-4 text-orange-500" />
                                  <span>2 min to next</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  <span>Online</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Bus Fleet Cards */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bus className="w-5 h-5 text-blue-500" />
              Active Fleet
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {liveBuses
                .filter(bus => bus.route_id === selectedRoute.id)
                .map(bus => {
                  const busData = busPositions[bus.id]
                  const delayInfo = busData ? getDelayStatus(busData.delay) : { text: 'On Time', color: 'text-green-600', bg: 'bg-green-50' }
                  
                  return (
                    <div
                      key={bus.id}
                      className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedBus(selectedBus?.id === bus.id ? null : bus)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Bus className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-sm">Bus {bus.bus_number}</div>
                            <div className="text-xs text-gray-500">{bus.registration_number}</div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${delayInfo.bg} ${delayInfo.color}`}>
                          {delayInfo.text}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        {busData ? getBusStatus(bus.id) : 'Initializing...'}
                      </div>
                      
                      {busData && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-blue-500" />
                            <span>{Math.round(busData.speed)} km/h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-green-500" />
                            <span>{busData.passengers} pax</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
            
            {liveBuses.filter(bus => bus.route_id === selectedRoute.id).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No active buses on this route</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default LiveTracking