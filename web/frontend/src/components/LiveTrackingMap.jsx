import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import apiService from '../services/api'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Enhanced bus icons with better visibility
const createBusIcon = (status, isDark = false) => {
  const color = status === 'moving' ? '#10b981' : '#f59e0b'
  const bgColor = isDark ? '#1f2937' : '#ffffff'
  
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="14" fill="${bgColor}" stroke="${color}" stroke-width="3"/>
        <path d="M8 18c0 .88.39 1.67 1 2.22V22c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V8c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S10.67 16 11.5 16s1.5.67 1.5 1.5S12.33 19 11.5 19zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H10V8h12v5z" fill="${color}" transform="translate(0, -2) scale(0.8)"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

// Enhanced stop icon
const createStopIcon = (isDark = false) => {
  const color = '#3b82f6'
  const bgColor = isDark ? '#1f2937' : '#ffffff'
  
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="${bgColor}" stroke="${color}" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="${color}"/>
      </svg>
    `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

function LiveTrackingMap({ selectedRoute, routeStops, buses, busPositions, isDark }) {
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]) // Delhi center
  const [mapKey, setMapKey] = useState(0)

  // Update map center when route changes
  useEffect(() => {
    if (routeStops.length > 0 && routeStops[0].latitude) {
      setMapCenter([routeStops[0].latitude, routeStops[0].longitude])
    }
  }, [routeStops])

  // Update map when route changes
  useEffect(() => {
    if (routeStops.length > 0 && routeStops[0].latitude) {
      setMapCenter([routeStops[0].latitude, routeStops[0].longitude])
      setMapKey(prev => prev + 1)
    }
  }, [selectedRoute, routeStops])

  // Generate route path from stops
  const routePath = routeStops
    .filter(stop => stop.latitude && stop.longitude)
    .map(stop => [stop.latitude, stop.longitude])

  // Calculate bus positions along route
  const getBusMapPosition = (busId) => {
    const busData = busPositions[busId]
    if (!busData || routeStops.length === 0) return null

    const currentStopIndex = busData.currentStopIndex
    const progress = busData.progress / 100

    const currentStop = routeStops[currentStopIndex]
    const nextStopIndex = (currentStopIndex + 1) % routeStops.length
    const nextStop = routeStops[nextStopIndex]

    if (!currentStop || !nextStop || !currentStop.latitude || !nextStop.latitude) {
      return currentStop && currentStop.latitude ? [currentStop.latitude, currentStop.longitude] : null
    }

    // Interpolate position between current and next stop
    const lat = currentStop.latitude + (nextStop.latitude - currentStop.latitude) * progress
    const lng = currentStop.longitude + (nextStop.longitude - currentStop.longitude) * progress

    return [lat, lng]
  }

  // Filter buses for selected route
  const routeBuses = buses.filter(bus => 
    selectedRoute && (bus.bus_id === selectedRoute.bus_id || bus.id <= (selectedRoute.active_buses || 2))
  )

  // Choose tile layer based on theme
  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  
  const tileAttribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <div className="w-full h-full relative">
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution={tileAttribution}
          url={tileUrl}
        />
        
        {/* Route path */}
        {routePath.length > 1 && (
          <Polyline
            positions={routePath}
            color="#3b82f6"
            weight={5}
            opacity={0.8}
            dashArray="0"
          />
        )}
        
        {/* Bus stops */}
        {routeStops
          .filter(stop => stop.latitude && stop.longitude)
          .map(stop => (
            <Marker
              key={stop.id}
              position={[stop.latitude, stop.longitude]}
              icon={createStopIcon(isDark)}
            >
              <Popup className={isDark ? 'dark-popup' : ''}>
                <div className={`p-3 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <h4 className="font-bold mb-1">{stop.stop_name}</h4>
                  <p className="text-sm opacity-75">Stop #{stop.stop_order}</p>
                  <p className="text-sm opacity-75">ETA: {stop.estimated_arrival_time}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        
        {/* Live buses */}
        {routeBuses.map(bus => {
          const position = getBusMapPosition(bus.id)
          const busData = busPositions[bus.id]
          
          if (!position || !busData) return null
          
          return (
            <Marker
              key={bus.id}
              position={position}
              icon={createBusIcon(busData.status, isDark)}
            >
              <Popup className={isDark ? 'dark-popup' : ''}>
                <div className={`p-4 min-w-64 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      busData.status === 'moving' ? 'bg-green-500' : 'bg-orange-500'
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v6a2 2 0 002 2V6h12V4H4z"/>
                        <path d="M18 8H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2zM7 15a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{bus.bus_number}</h4>
                      <p className="text-sm opacity-75">{bus.registration_number}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="opacity-75">Speed:</span>
                      <div className="font-semibold">{Math.round(busData.speed)} km/h</div>
                    </div>
                    <div>
                      <span className="opacity-75">Passengers:</span>
                      <div className="font-semibold">{busData.passengers}/{bus.capacity}</div>
                    </div>
                    <div>
                      <span className="opacity-75">Status:</span>
                      <div className={`font-semibold capitalize ${
                        busData.status === 'moving' ? 'text-green-500' : 'text-orange-500'
                      }`}>
                        {busData.status}
                      </div>
                    </div>
                    <div>
                      <span className="opacity-75">Delay:</span>
                      <div className={`font-semibold ${
                        busData.delay > 2 ? 'text-red-500' : 
                        busData.delay < -1 ? 'text-blue-500' : 'text-green-500'
                      }`}>
                        {busData.delay > 0 ? `+${Math.round(busData.delay)}m` : 
                         busData.delay < 0 ? `${Math.round(busData.delay)}m` : 'On time'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      busData.status === 'moving' ? 'bg-green-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="text-xs font-medium opacity-75">Live Tracking</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 z-10 space-y-2">
        <button
          onClick={() => {
            const map = document.querySelector('.leaflet-container')
            if (map && map._leaflet_map) {
              map._leaflet_map.zoomIn()
            }
          }}
          className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center text-lg font-bold ${
            isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          +
        </button>
        <button
          onClick={() => {
            const map = document.querySelector('.leaflet-container')
            if (map && map._leaflet_map) {
              map._leaflet_map.zoomOut()
            }
          }}
          className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center text-lg font-bold ${
            isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          −
        </button>
      </div>
    </div>
  )
}

export default LiveTrackingMap