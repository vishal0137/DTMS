import { useState, useEffect, useRef } from 'react'
import { 
  Bus, MapPin, Clock, Navigation, Activity, AlertCircle, 
  CheckCircle, Play, Pause, RotateCcw, Zap, Users, Route,
  Calendar, Timer, TrendingUp, Wifi, Signal, Battery,
  Cloud, Sun, CloudRain, Thermometer, Wind
} from 'lucide-react'
import axios from '../api/axios'
import { busSimulator } from '../utils/busMovementAlgorithm'

function LiveTracking() {
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [routes, setRoutes] = useState([])
  const [liveBuses, setLiveBuses] = useState([])
  const [routeStops, setRouteStops] = useState([])
  const [busStatuses, setBusStatuses] = useState({})
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedBus, setSelectedBus] = useState(null)
  const [simulationStats, setSimulationStats] = useState({})
  const [weatherCondition, setWeatherCondition] = useState('sunny')
  const [timeOfDay, setTimeOfDay] = useState('normal')
  const intervalRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    fetchRoutes()
    fetchLiveBuses()
    initializeSimulation()
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
      updateTimeOfDay()
    }, 1000)

    // Update simulation every 3 seconds
    const simulationInterval = setInterval(() => {
      if (isPlaying) {
        updateSimulation()
      }
    }, 3000)

    intervalRef.current = simulationInterval

    return () => {
      clearInterval(timeInterval)
      clearInterval(simulationInterval)
    }
  }, [isPlaying])

  useEffect(() => {
    if (selectedRoute && routeStops.length > 0) {
      initializeBusesForRoute()
    }
  }, [selectedRoute, routeStops])

  const initializeSimulation = () => {
    // Set initial conditions
    const hour = new Date().getHours()
    if (hour >= 7 && hour <= 9) {
      setTimeOfDay('rush_morning')
    } else if (hour >= 17 && hour <= 19) {
      setTimeOfDay('rush_evening')
    } else if (hour >= 22 || hour <= 5) {
      setTimeOfDay('late_night')
    } else {
      setTimeOfDay('normal')
    }

    // Random weather
    const weathers = ['sunny', 'cloudy', 'rainy']
    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)]
    setWeatherCondition(randomWeather)
    updateWeatherFactor(randomWeather)
  }

  const updateTimeOfDay = () => {
    const hour = new Date().getHours()
    let newTimeOfDay = 'normal'
    
    if (hour >= 7 && hour <= 9) {
      newTimeOfDay = 'rush_morning'
    } else if (hour >= 17 && hour <= 19) {
      newTimeOfDay = 'rush_evening'
    } else if (hour >= 22 || hour <= 5) {
      newTimeOfDay = 'late_night'
    } else if (hour >= 6 && hour <= 22) {
      newTimeOfDay = 'normal'
    } else {
      newTimeOfDay = 'weekend'
    }

    if (newTimeOfDay !== timeOfDay) {
      setTimeOfDay(newTimeOfDay)
      busSimulator.setTimeOfDay(newTimeOfDay)
    }
  }

  const updateWeatherFactor = (weather) => {
    const weatherFactors = {
      'sunny': 1.0,
      'cloudy': 0.95,
      'rainy': 0.8,
      'stormy': 0.6
    }
    busSimulator.setWeatherFactor(weatherFactors[weather] || 1.0)
  }

  const initializeBusesForRoute = () => {
    if (!selectedRoute || routeStops.length === 0) return

    // Initialize buses in the simulator
    liveBuses
      .filter(bus => bus.route_id === selectedRoute.id)
      .forEach((bus, index) => {
        const initialPosition = Math.floor(Math.random() * routeStops.length)
        busSimulator.initializeBus(bus.id, selectedRoute.id, routeStops, initialPosition)
      })
  }

  const updateSimulation = () => {
    const updatedStatuses = {}
    
    liveBuses
      .filter(bus => bus.route_id === selectedRoute?.id)
      .forEach(bus => {
        const status = busSimulator.updateBusPosition(bus.id)
        if (status) {
          updatedStatuses[bus.id] = status
        }
      })

    setBusStatuses(updatedStatuses)
    setSimulationStats(busSimulator.getSimulationStats())
  }

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('/api/routes')
      setRoutes(response.data || [])
      if (response.data && response.data.length > 0) {
        setSelectedRoute(response.data[0])
      }
    } catch (error) {
      console.error('Error fetching routes:', error)
    }
  }

  const fetchLiveBuses = async () => {
    try {
      const response = await axios.get('/api/buses/live-locations')
      const buses = response.data || []
      setLiveBuses(buses)
    } catch (error) {
      console.error('Error fetching live buses:', error)
    }
  }

  const fetchRouteStops = async (routeId) => {
    try {
      const response = await axios.get(`/api/stops/route/${routeId}`)
      const stops = response.data || []
      setRouteStops(stops.sort((a, b) => a.stop_order - b.stop_order))
    } catch (error) {
      console.error('Error fetching route stops:', error)
    }
  }

  const getBusPosition = (busId) => {
    const status = busStatuses[busId]
    if (!status || routeStops.length === 0) return { top: '50%', left: '10%' }
    
    const stopIndex = status.currentStopIndex
    const progress = status.progress / 100
    
    // Calculate position along the route line
    const basePosition = (stopIndex / (routeStops.length - 1)) * 80 + 10
    const nextStopIndex = stopIndex + status.direction
    const nextPosition = ((nextStopIndex) / (routeStops.length - 1)) * 80 + 10
    const currentPosition = basePosition + (nextPosition - basePosition) * progress
    
    return {
      top: '50%',
      left: `${Math.max(5, Math.min(95, currentPosition))}%`
    }
  }

  const getBusStatusText = (busId) => {
    const status = busStatuses[busId]
    if (!status) return 'Unknown'
    
    switch (status.status) {
      case 'arriving':
        return `Arriving at ${status.currentStop?.stop_name || 'Stop'}`
      case 'stopped':
        return `Stopped at ${status.currentStop?.stop_name || 'Stop'}`
      case 'departing':
        return `Departing from ${status.currentStop?.stop_name || 'Stop'}`
      case 'moving':
        return status.nextStop 
          ? `En route to ${status.nextStop.stop_name}` 
          : `Moving along route`
      default:
        return status.status
    }
  }

  const getDelayStatus = (delay) => {
    if (delay <= -2) return { text: 'Early', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (delay <= 2) return { text: 'On Time', color: 'text-green-600', bg: 'bg-green-50' }
    if (delay <= 5) return { text: 'Delayed', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { text: 'Very Delayed', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'sunny': return <Sun className="w-5 h-5 text-yellow-500" />
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-500" />
      default: return <Sun className="w-5 h-5 text-yellow-500" />
    }
  }

  const getTimeOfDayLabel = (timeOfDay) => {
    const labels = {
      'rush_morning': 'Morning Rush',
      'rush_evening': 'Evening Rush',
      'normal': 'Normal Hours',
      'late_night': 'Late Night',
      'weekend': 'Weekend'
    }
    return labels[timeOfDay] || 'Normal Hours'
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Live Bus Tracking
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-gray-800 mb-1">
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Updates
              </div>
              <div className="flex items-center gap-2">
                {getWeatherIcon(weatherCondition)}
                <span className="capitalize">{weatherCondition}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{getTimeOfDayLabel(timeOfDay)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Route className="w-5 h-5 text-blue-500" />
            Select Route
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isPlaying 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => {
                setBusStatuses({})
                busSimulator.buses.clear()
                fetchLiveBuses()
                if (selectedRoute && routeStops.length > 0) {
                  setTimeout(() => initializeBusesForRoute(), 1000)
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map(route => {
            const routeBuses = liveBuses.filter(bus => bus.route_id === route.id)
            return (
              <button
                key={route.id}
                onClick={() => {
                  setSelectedRoute(route)
                  fetchRouteStops(route.id)
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedRoute?.id === route.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{route.route_number}</span>
                  <div className="flex items-center gap-2">
                    <Bus className={`w-5 h-5 ${
                      selectedRoute?.id === route.id ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {routeBuses.length} buses
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{route.route_name}</p>
                <p className="text-xs text-gray-500">
                  {route.start_location} → {route.end_location}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {selectedRoute && (
        <>
          {/* Route Status Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedRoute.route_number} - {selectedRoute.route_name}
                </h2>
                <p className="text-gray-600">
                  {selectedRoute.start_location} → {selectedRoute.end_location}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Distance</div>
                <div className="text-xl font-bold text-gray-800">
                  {selectedRoute.distance_km} km
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bus className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-blue-700">Active Buses</span>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {liveBuses.filter(bus => bus.route_id === selectedRoute.id).length}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-700">Total Stops</span>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {routeStops.length}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-purple-700">Avg Speed</span>
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  {simulationStats.averageSpeed || 0} km/h
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-orange-700">Passengers</span>
                </div>
                <div className="text-2xl font-bold text-orange-800">
                  {simulationStats.totalPassengers || 0}
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium text-emerald-700">On Time</span>
                </div>
                <div className="text-2xl font-bold text-emerald-800">
                  {simulationStats.onTimePerformance || 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Live Route Visualization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-500" />
                Live Route Status
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Bus Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Current Stop</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Upcoming Stop</span>
                </div>
              </div>
            </div>

            {/* Route Timeline */}
            <div className="relative">
              {/* Route Line with gradient animation */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-green-300 via-blue-300 to-red-300 rounded-full transform -translate-y-1/2 route-line"></div>
              
              {/* Stops */}
              <div className="relative flex justify-between items-center py-8">
                {routeStops.map((stop, index) => {
                  const isFirst = index === 0
                  const isLast = index === routeStops.length - 1
                  const position = (index / (routeStops.length - 1)) * 100
                  
                  return (
                    <div
                      key={stop.id}
                      className="relative flex flex-col items-center"
                      style={{ left: `${position}%`, position: 'absolute', transform: 'translateX(-50%)' }}
                    >
                      {/* Stop Circle */}
                      <div className={`w-6 h-6 rounded-full border-4 z-10 transition-all duration-500 ${
                        isFirst ? 'bg-green-500 border-green-600 shadow-lg shadow-green-200' :
                        isLast ? 'bg-red-500 border-red-600 shadow-lg shadow-red-200' :
                        'bg-white border-gray-300 hover:border-blue-400'
                      }`}>
                        {isFirst && <CheckCircle className="w-4 h-4 text-white absolute -top-1 -left-1" />}
                        {isLast && <MapPin className="w-4 h-4 text-white absolute -top-1 -left-1" />}
                      </div>
                      
                      {/* Stop Info */}
                      <div className="mt-4 text-center min-w-max">
                        <div className="font-semibold text-sm text-gray-800 mb-1">
                          {stop.stop_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stop.estimated_arrival_time}
                        </div>
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          Stop {stop.stop_order}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Moving Buses with Advanced Animation */}
              {liveBuses
                .filter(bus => bus.route_id === selectedRoute.id)
                .map(bus => {
                  const position = getBusPosition(bus.id)
                  const status = busStatuses[bus.id]
                  const delayInfo = status ? getDelayStatus(status.delay) : { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50' }
                  
                  return (
                    <div
                      key={bus.id}
                      className="absolute z-20 transition-all duration-2000 ease-in-out transform -translate-x-1/2 -translate-y-1/2"
                      style={position}
                    >
                      {/* Bus Icon with Enhanced Animation */}
                      <div 
                        className={`relative cursor-pointer transition-all duration-300 hover:scale-110 ${
                          selectedBus?.id === bus.id ? 'scale-125 animate-glow' : ''
                        } ${status?.status === 'arriving' ? 'animate-busArrive' : ''}`}
                        onClick={() => setSelectedBus(selectedBus?.id === bus.id ? null : bus)}
                      >
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center transition-all duration-500 ${
                            status?.status === 'stopped' ? 'bg-red-500 animate-pulse' :
                            status?.status === 'arriving' ? 'bg-yellow-500 animate-bounce-subtle' :
                            'bg-blue-500 animate-routePulse'
                          }`}>
                            <Bus className="w-6 h-6 text-white" />
                          </div>
                          
                          {/* Speed Indicator */}
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-xs font-bold text-white">{status?.speed || 0}</span>
                          </div>
                          
                          {/* Status Indicator */}
                          <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center">
                            {status?.status === 'moving' && <Navigation className="w-3 h-3 text-blue-600 animate-spin" />}
                            {status?.status === 'stopped' && <AlertCircle className="w-3 h-3 text-red-600 animate-statusBlink" />}
                            {status?.status === 'arriving' && <MapPin className="w-3 h-3 text-yellow-600 animate-bounce" />}
                          </div>
                          
                          {/* Signal Strength */}
                          <div className="absolute -bottom-1 -right-1">
                            <div className="flex gap-0.5">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 rounded-sm transition-all duration-300 ${
                                    i < (status?.signalStrength || 4) ? 'bg-green-500' : 'bg-gray-300'
                                  } animate-signalBars`}
                                  style={{ 
                                    height: `${(i + 1) * 2 + 2}px`,
                                    animationDelay: `${i * 0.1}s`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Bus Info Popup */}
                        {selectedBus?.id === bus.id && status && (
                          <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-80 z-30 animate-scaleIn">
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-800 text-lg">Bus {bus.bus_number}</h4>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${delayInfo.bg} ${delayInfo.color}`}>
                                  {delayInfo.text}
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-600 mb-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Activity className="w-4 h-4 text-blue-500" />
                                  <span className="font-medium">Status:</span>
                                </div>
                                <span className="capitalize">{getBusStatusText(bus.id)}</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-blue-500" />
                                    <span>Speed: {status.speed} km/h</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-green-500" />
                                    <span>Load: {status.occupancyLevel}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-orange-500" />
                                    <span>Next: {status.estimatedNextStop || 'N/A'} min</span>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Battery className="w-4 h-4 text-purple-500" />
                                    <span>Fuel: {status.fuel}%</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Signal className="w-4 h-4 text-cyan-500" />
                                    <span>Signal: {status.signalStrength}/4</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span>GPS: {status.gpsAccuracy}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Passengers: {status.passengers}/{status.capacity}</span>
                                  <span>Performance: {status.onTimePerformance}</span>
                                </div>
                                <div className="mt-2 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: `${(status.passengers / status.capacity) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              {status.mechanicalIssues && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="font-medium">Mechanical Issue Detected</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Bus Fleet Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bus className="w-5 h-5 text-blue-500" />
              Fleet Status
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveBuses
                .filter(bus => bus.route_id === selectedRoute.id)
                .map(bus => {
                  const status = busStatuses[bus.id]
                  const delayInfo = status ? getDelayStatus(status.delay) : { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50' }
                  
                  return (
                    <div
                      key={bus.id}
                      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover-lift"
                      onClick={() => setSelectedBus(selectedBus?.id === bus.id ? null : bus)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            status?.status === 'stopped' ? 'bg-red-100 animate-pulse' :
                            status?.status === 'arriving' ? 'bg-yellow-100' :
                            'bg-blue-100'
                          }`}>
                            <Bus className={`w-5 h-5 ${
                              status?.status === 'stopped' ? 'text-red-600' :
                              status?.status === 'arriving' ? 'text-yellow-600' :
                              'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">Bus {bus.bus_number}</div>
                            <div className="text-xs text-gray-500">{bus.registration_number}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${delayInfo.bg} ${delayInfo.color}`}>
                            {delayInfo.text}
                          </span>
                          <div className="flex items-center gap-1">
                            <div className="flex gap-0.5">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 rounded-sm ${
                                    i < (status?.signalStrength || 4) ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                                  style={{ height: `${(i + 1) * 2 + 2}px` }}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">Online</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded">
                        <span className="capitalize">{status ? getBusStatusText(bus.id) : 'Initializing...'}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-500" />
                          <span>{status?.speed || 0} km/h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-green-500" />
                          <span>{status?.occupancyLevel || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="w-3 h-3 text-orange-500" />
                          <span>{status?.estimatedNextStop || 'N/A'} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Battery className="w-3 h-3 text-purple-500" />
                          <span>{status?.fuel || 0}%</span>
                        </div>
                      </div>

                      {/* Progress bar for passenger load */}
                      {status && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Passenger Load</span>
                            <span>{status.passengers}/{status.capacity}</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-1000 ${
                                (status.passengers / status.capacity) > 0.8 ? 'bg-red-500' :
                                (status.passengers / status.capacity) > 0.6 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(status.passengers / status.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Mechanical issues warning */}
                      {status?.mechanicalIssues && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                          <AlertCircle className="w-3 h-3" />
                          <span>Mechanical Issue</span>
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