// Advanced Bus Movement Simulation Algorithm
// This algorithm simulates realistic bus movement with various factors

export class BusMovementSimulator {
  constructor() {
    this.buses = new Map()
    this.routes = new Map()
    this.trafficConditions = new Map()
    this.weatherFactor = 1.0
    this.timeOfDay = 'normal'
  }

  // Initialize a bus on a route
  initializeBus(busId, routeId, stops, initialPosition = 0) {
    const bus = {
      id: busId,
      routeId: routeId,
      stops: stops,
      currentStopIndex: initialPosition,
      progress: 0, // 0-100 between stops
      direction: 1, // 1 for forward, -1 for backward
      speed: this.calculateBaseSpeed(),
      status: 'moving', // moving, arriving, stopped, departing
      passengers: Math.floor(Math.random() * 50) + 10,
      capacity: 60,
      fuel: Math.floor(Math.random() * 40) + 60,
      delay: 0, // minutes
      lastUpdate: Date.now(),
      dwellTime: 0, // time spent at current stop
      averageSpeed: 35, // km/h
      maxSpeed: 60,
      acceleration: 2, // km/h per second
      deceleration: 3, // km/h per second
      trafficDelay: 0,
      weatherDelay: 0,
      mechanicalIssues: false,
      driverBehavior: this.generateDriverProfile(),
      routeKnowledge: Math.random() * 0.3 + 0.7, // 0.7-1.0
      lastStopArrival: null,
      estimatedArrival: null,
      gpsAccuracy: Math.random() * 10 + 90, // 90-100%
      signalStrength: Math.floor(Math.random() * 2) + 3, // 3-4 bars
      batteryLevel: Math.floor(Math.random() * 40) + 60
    }

    this.buses.set(busId, bus)
    this.calculateEstimatedArrivals(bus)
    return bus
  }

  // Generate realistic driver behavior profile
  generateDriverProfile() {
    return {
      aggressiveness: Math.random() * 0.4 + 0.3, // 0.3-0.7
      punctuality: Math.random() * 0.4 + 0.6, // 0.6-1.0
      experience: Math.random() * 0.3 + 0.7, // 0.7-1.0
      efficiency: Math.random() * 0.3 + 0.7, // 0.7-1.0
      safetyFactor: Math.random() * 0.2 + 0.8 // 0.8-1.0
    }
  }

  // Calculate base speed considering various factors
  calculateBaseSpeed() {
    const baseSpeed = 35 // km/h
    const timeFactors = {
      'rush_morning': 0.6,
      'rush_evening': 0.65,
      'normal': 1.0,
      'late_night': 1.2,
      'weekend': 1.1
    }
    
    return baseSpeed * (timeFactors[this.timeOfDay] || 1.0) * this.weatherFactor
  }

  // Update bus position with realistic movement
  updateBusPosition(busId, deltaTime = 5000) { // deltaTime in milliseconds
    const bus = this.buses.get(busId)
    if (!bus || bus.stops.length === 0) return null

    const deltaSeconds = deltaTime / 1000
    const currentTime = Date.now()
    
    // Update bus status based on current conditions
    this.updateBusConditions(bus, deltaSeconds)
    
    switch (bus.status) {
      case 'moving':
        this.handleMovingState(bus, deltaSeconds)
        break
      case 'arriving':
        this.handleArrivingState(bus, deltaSeconds)
        break
      case 'stopped':
        this.handleStoppedState(bus, deltaSeconds)
        break
      case 'departing':
        this.handleDepartingState(bus, deltaSeconds)
        break
    }

    // Update position and calculate delays
    this.updatePosition(bus, deltaSeconds)
    this.calculateDelays(bus)
    this.updatePassengerCount(bus)
    
    bus.lastUpdate = currentTime
    return this.getBusStatus(busId)
  }

  // Handle bus in moving state
  handleMovingState(bus, deltaSeconds) {
    const currentStop = bus.stops[bus.currentStopIndex]
    const nextStopIndex = bus.currentStopIndex + bus.direction
    const nextStop = bus.stops[nextStopIndex]

    if (!nextStop) {
      // End of route - reverse direction
      bus.direction *= -1
      bus.status = 'arriving'
      return
    }

    // Calculate distance-based progress
    const segmentDistance = this.calculateDistance(currentStop, nextStop)
    const speedKmh = this.calculateCurrentSpeed(bus, deltaSeconds)
    const speedMs = (speedKmh * 1000) / 3600 // Convert to m/s
    const distanceCovered = speedMs * deltaSeconds
    const progressIncrement = (distanceCovered / segmentDistance) * 100

    bus.progress += progressIncrement

    // Check if approaching next stop
    if (bus.progress >= 85) {
      bus.status = 'arriving'
      bus.speed *= 0.7 // Start slowing down
    }
  }

  // Handle bus arriving at stop
  handleArrivingState(bus, deltaSeconds) {
    bus.speed = Math.max(bus.speed * 0.8, 5) // Decelerate
    bus.progress += (bus.speed / 10) * deltaSeconds

    if (bus.progress >= 100) {
      bus.progress = 0
      bus.currentStopIndex += bus.direction
      bus.status = 'stopped'
      bus.dwellTime = this.calculateDwellTime(bus)
      bus.lastStopArrival = Date.now()
      
      // Update passenger count at stop
      this.simulatePassengerExchange(bus)
    }
  }

  // Handle bus stopped at station
  handleStoppedState(bus, deltaSeconds) {
    bus.dwellTime -= deltaSeconds

    if (bus.dwellTime <= 0) {
      bus.status = 'departing'
      bus.speed = 0
    }
  }

  // Handle bus departing from stop
  handleDepartingState(bus, deltaSeconds) {
    bus.speed = Math.min(bus.speed + bus.acceleration * deltaSeconds, bus.maxSpeed)
    
    if (bus.speed >= bus.averageSpeed * 0.8) {
      bus.status = 'moving'
    }
  }

  // Calculate realistic dwell time at stops
  calculateDwellTime(bus) {
    const baseTime = 30 // seconds
    const passengerFactor = (bus.passengers / bus.capacity) * 20
    const timeOfDayFactor = this.timeOfDay === 'rush_morning' || this.timeOfDay === 'rush_evening' ? 1.5 : 1.0
    const driverFactor = (2 - bus.driverBehavior.efficiency) * 10
    
    return (baseTime + passengerFactor + driverFactor) * timeOfDayFactor
  }

  // Simulate passenger boarding/alighting
  simulatePassengerExchange(bus) {
    const currentStop = bus.stops[bus.currentStopIndex]
    const isTerminal = bus.currentStopIndex === 0 || bus.currentStopIndex === bus.stops.length - 1
    
    // Passengers alighting
    const alighting = Math.floor(bus.passengers * (Math.random() * 0.3 + 0.1))
    bus.passengers = Math.max(0, bus.passengers - alighting)
    
    // Passengers boarding
    const maxBoarding = bus.capacity - bus.passengers
    const demandFactor = this.getStopDemand(currentStop, isTerminal)
    const boarding = Math.floor(Math.random() * Math.min(maxBoarding, demandFactor))
    bus.passengers = Math.min(bus.capacity, bus.passengers + boarding)
  }

  // Get stop demand based on time and location
  getStopDemand(stop, isTerminal) {
    const baseDemand = isTerminal ? 15 : 8
    const timeFactors = {
      'rush_morning': 2.0,
      'rush_evening': 1.8,
      'normal': 1.0,
      'late_night': 0.3,
      'weekend': 0.7
    }
    
    return Math.floor(baseDemand * (timeFactors[this.timeOfDay] || 1.0))
  }

  // Calculate current speed with various factors
  calculateCurrentSpeed(bus, deltaSeconds) {
    let targetSpeed = bus.averageSpeed
    
    // Driver behavior influence
    targetSpeed *= (0.8 + bus.driverBehavior.aggressiveness * 0.4)
    
    // Traffic conditions
    targetSpeed *= (1 - bus.trafficDelay / 100)
    
    // Weather conditions
    targetSpeed *= this.weatherFactor
    
    // Passenger load influence
    const loadFactor = bus.passengers / bus.capacity
    targetSpeed *= (1 - loadFactor * 0.2)
    
    // Mechanical issues
    if (bus.mechanicalIssues) {
      targetSpeed *= 0.7
    }
    
    // Smooth speed transitions
    if (bus.speed < targetSpeed) {
      bus.speed = Math.min(bus.speed + bus.acceleration * deltaSeconds, targetSpeed)
    } else if (bus.speed > targetSpeed) {
      bus.speed = Math.max(bus.speed - bus.deceleration * deltaSeconds, targetSpeed)
    }
    
    return Math.max(5, Math.min(bus.maxSpeed, bus.speed))
  }

  // Update various bus conditions
  updateBusConditions(bus, deltaSeconds) {
    // Update fuel consumption
    const fuelConsumption = (bus.speed / 100) * deltaSeconds / 3600 // Very simplified
    bus.fuel = Math.max(0, bus.fuel - fuelConsumption)
    
    // Random mechanical issues (very rare)
    if (Math.random() < 0.0001) {
      bus.mechanicalIssues = true
      setTimeout(() => {
        bus.mechanicalIssues = false
      }, 30000) // 30 seconds
    }
    
    // Update traffic conditions randomly
    if (Math.random() < 0.01) {
      bus.trafficDelay = Math.random() * 20 // 0-20% delay
    }
    
    // GPS accuracy fluctuation
    bus.gpsAccuracy = Math.max(85, Math.min(100, bus.gpsAccuracy + (Math.random() - 0.5) * 5))
    
    // Signal strength changes
    if (Math.random() < 0.05) {
      bus.signalStrength = Math.max(1, Math.min(4, bus.signalStrength + Math.floor(Math.random() * 3) - 1))
    }
  }

  // Calculate distance between two stops (simplified)
  calculateDistance(stop1, stop2) {
    if (!stop1 || !stop2) return 1000 // Default 1km
    
    // Simplified distance calculation (in meters)
    const lat1 = stop1.latitude || 0
    const lon1 = stop1.longitude || 0
    const lat2 = stop2.latitude || 0
    const lon2 = stop2.longitude || 0
    
    const R = 6371000 // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    
    return Math.max(500, R * c) // Minimum 500m between stops
  }

  // Calculate delays and update schedule adherence
  calculateDelays(bus) {
    if (!bus.estimatedArrival || !bus.lastStopArrival) return
    
    const currentTime = Date.now()
    const scheduledTime = bus.estimatedArrival[bus.currentStopIndex]
    
    if (scheduledTime) {
      bus.delay = (currentTime - scheduledTime) / (1000 * 60) // Convert to minutes
    }
  }

  // Calculate estimated arrival times for all stops
  calculateEstimatedArrivals(bus) {
    const currentTime = Date.now()
    const estimatedTimes = []
    let cumulativeTime = currentTime
    
    for (let i = 0; i < bus.stops.length; i++) {
      if (i > 0) {
        const distance = this.calculateDistance(bus.stops[i-1], bus.stops[i])
        const travelTime = (distance / 1000) / (bus.averageSpeed / 60) // minutes
        const dwellTime = i === bus.stops.length - 1 ? 0 : 2 // 2 minutes dwell time
        cumulativeTime += (travelTime + dwellTime) * 60 * 1000 // Convert to milliseconds
      }
      estimatedTimes.push(cumulativeTime)
    }
    
    bus.estimatedArrival = estimatedTimes
  }

  // Update passenger count with realistic patterns
  updatePassengerCount(bus) {
    // Gradual passenger changes during travel
    if (bus.status === 'moving' && Math.random() < 0.01) {
      // Very small chance of passenger count change during travel (emergency stops, etc.)
      const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
      bus.passengers = Math.max(0, Math.min(bus.capacity, bus.passengers + change))
    }
  }

  // Get comprehensive bus status
  getBusStatus(busId) {
    const bus = this.buses.get(busId)
    if (!bus) return null

    const currentStop = bus.stops[bus.currentStopIndex]
    const nextStopIndex = bus.currentStopIndex + bus.direction
    const nextStop = bus.stops[nextStopIndex]

    return {
      id: bus.id,
      routeId: bus.routeId,
      currentStopIndex: bus.currentStopIndex,
      currentStop: currentStop,
      nextStop: nextStop,
      progress: Math.round(bus.progress),
      status: bus.status,
      speed: Math.round(bus.speed),
      passengers: bus.passengers,
      capacity: bus.capacity,
      fuel: Math.round(bus.fuel),
      delay: Math.round(bus.delay * 10) / 10, // Round to 1 decimal
      direction: bus.direction,
      dwellTime: Math.round(bus.dwellTime),
      gpsAccuracy: Math.round(bus.gpsAccuracy),
      signalStrength: bus.signalStrength,
      batteryLevel: bus.batteryLevel,
      mechanicalIssues: bus.mechanicalIssues,
      trafficDelay: Math.round(bus.trafficDelay),
      estimatedNextStop: nextStop ? this.calculateETA(bus, nextStopIndex) : null,
      occupancyLevel: this.getOccupancyLevel(bus.passengers, bus.capacity),
      onTimePerformance: this.calculateOnTimePerformance(bus)
    }
  }

  // Calculate ETA to next stop
  calculateETA(bus, stopIndex) {
    if (!bus.stops[stopIndex]) return null
    
    const remainingProgress = 100 - bus.progress
    const currentSpeed = bus.speed || bus.averageSpeed
    const timeToNext = (remainingProgress / 100) * (this.calculateDistance(
      bus.stops[bus.currentStopIndex], 
      bus.stops[stopIndex]
    ) / 1000) / (currentSpeed / 60) // minutes
    
    return Math.max(1, Math.round(timeToNext))
  }

  // Get occupancy level description
  getOccupancyLevel(passengers, capacity) {
    const ratio = passengers / capacity
    if (ratio < 0.3) return 'Low'
    if (ratio < 0.6) return 'Medium'
    if (ratio < 0.9) return 'High'
    return 'Full'
  }

  // Calculate on-time performance
  calculateOnTimePerformance(bus) {
    const delay = Math.abs(bus.delay)
    if (delay <= 2) return 'On Time'
    if (delay <= 5) return 'Slightly Delayed'
    if (delay <= 10) return 'Delayed'
    return 'Very Delayed'
  }

  // Set time of day for realistic simulation
  setTimeOfDay(timeOfDay) {
    this.timeOfDay = timeOfDay
    // Update all buses with new conditions
    this.buses.forEach(bus => {
      bus.averageSpeed = this.calculateBaseSpeed()
    })
  }

  // Set weather conditions
  setWeatherFactor(factor) {
    this.weatherFactor = Math.max(0.3, Math.min(1.2, factor))
  }

  // Get all buses status
  getAllBusesStatus() {
    const statuses = []
    this.buses.forEach((bus, busId) => {
      statuses.push(this.getBusStatus(busId))
    })
    return statuses
  }

  // Remove bus from simulation
  removeBus(busId) {
    return this.buses.delete(busId)
  }

  // Get simulation statistics
  getSimulationStats() {
    const buses = Array.from(this.buses.values())
    const totalBuses = buses.length
    const averageSpeed = buses.reduce((sum, bus) => sum + bus.speed, 0) / totalBuses || 0
    const averageDelay = buses.reduce((sum, bus) => sum + Math.abs(bus.delay), 0) / totalBuses || 0
    const totalPassengers = buses.reduce((sum, bus) => sum + bus.passengers, 0)
    const onTimeBuses = buses.filter(bus => Math.abs(bus.delay) <= 2).length
    
    return {
      totalBuses,
      averageSpeed: Math.round(averageSpeed),
      averageDelay: Math.round(averageDelay * 10) / 10,
      totalPassengers,
      onTimePerformance: totalBuses > 0 ? Math.round((onTimeBuses / totalBuses) * 100) : 0,
      timeOfDay: this.timeOfDay,
      weatherFactor: this.weatherFactor
    }
  }
}

// Export singleton instance
export const busSimulator = new BusMovementSimulator()