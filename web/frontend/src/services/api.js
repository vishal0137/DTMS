const API_BASE_URL = 'http://localhost:8000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Bus endpoints
  async getLiveBusLocations() {
    return this.request('/buses/live-locations')
  }

  async getBuses() {
    return this.request('/buses')
  }

  // Route endpoints
  async getRoutes() {
    return this.request('/routes')
  }

  async getRoute(routeId) {
    return this.request(`/routes/${routeId}`)
  }

  // Stop endpoints
  async getStops() {
    return this.request('/stops')
  }

  async getStopsByRoute(routeId) {
    return this.request(`/stops/route/${routeId}`)
  }

  // Analytics endpoints
  async getKPIs() {
    return this.request('/analytics/kpis')
  }

  async getRouteRevenue() {
    return this.request('/analytics/route-revenue')
  }

  async getPassengerCategories() {
    return this.request('/analytics/passenger-categories')
  }

  // Booking endpoints
  async getBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/bookings${queryString ? '?' + queryString : ''}`)
  }

  // Health check
  async healthCheck() {
    const response = await fetch('http://localhost:8000/health')
    return response.json()
  }
}

export default new ApiService()