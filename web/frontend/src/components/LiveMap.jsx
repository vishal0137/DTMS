import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Navigation, Zap, Users, Clock, MapPin } from 'lucide-react'

// Custom animated bus icon with rotation
const createBusIcon = (heading = 0, speed = 0) => {
  const isMoving = speed > 0
  const color = isMoving ? '#10b981' : '#ef4444' // Green if moving, red if stopped
  
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `
      <div style="position: relative; width: 50px; height: 50px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(${heading}deg);
          transition: transform 0.5s ease-out;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            background: ${color};
            border-radius: 50%;
            opacity: 0.2;
            animation: pulse 2s infinite;
          "></div>
          
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
            background: ${color};
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
            border: 3px solid white;
          ">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
            </svg>
          </div>
          
          ${isMoving ? `
            <div style="
              position: absolute;
              top: -4px;
              right: -4px;
              width: 14px;
              height: 14px;
              background: #fbbf24;
              border-radius: 50%;
              border: 2px solid white;
              animation: blink 1s infinite;
              box-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);
            "></div>
          ` : ''}
        </div>
      </div>
      
      <style>
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  })
}

// Animated Marker Component
function AnimatedMarker({ bus }) {
  const [position, setPosition] = useState([bus.latitude, bus.longitude])
  
  useEffect(() => {
    setPosition([bus.latitude, bus.longitude])
  }, [bus.latitude, bus.longitude])

  const icon = createBusIcon(bus.heading || 0, bus.speed || 0)
  const isMoving = (bus.speed || 0) > 0

  return (
    <Marker position={position} icon={icon}>
      <Popup className="custom-popup" maxWidth={300}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3 pb-3 border-b-2 border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isMoving ? 'bg-green-100' : 'bg-red-100'}`}>
                <Navigation className={`w-6 h-6 ${isMoving ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <div className="font-bold text-xl text-gray-800">{bus.bus_number}</div>
                <div className="text-xs text-gray-500">{bus.registration_number}</div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-bold ${
              isMoving ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {isMoving ? '● MOVING' : '● STOPPED'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-gray-600">Speed</span>
              </div>
              <div className="font-bold text-lg text-gray-800">{bus.speed?.toFixed(1) || 0} km/h</div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-600">Type</span>
              </div>
              <div className="font-bold text-sm text-gray-800">{bus.bus_type}</div>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-gray-600">Status</span>
              </div>
              <div className="font-bold text-sm text-gray-800">{bus.status || 'Active'}</div>
            </div>

            <div className="bg-pink-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span className="text-xs text-gray-600">GPS</span>
              </div>
              <div className="font-mono text-xs text-gray-700">
                {bus.latitude.toFixed(4)}, {bus.longitude.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">Live Tracking Active</span>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

// Component to auto-fit bounds when buses change
function MapController({ buses }) {
  const map = useMap()

  useEffect(() => {
    if (buses.length > 0) {
      const bounds = L.latLngBounds(
        buses.map(bus => [bus.latitude, bus.longitude])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    }
  }, [buses, map])

  return null
}

function LiveMap({ buses = [] }) {
  const defaultCenter = [28.6139, 77.2090] // Delhi coordinates
  const [prevBuses, setPrevBuses] = useState({})
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (buses.length > 0) {
      const busMap = {}
      buses.forEach(bus => {
        busMap[bus.id] = { lat: bus.latitude, lng: bus.longitude }
      })
      setPrevBuses(busMap)
      setLastUpdate(new Date())
    }
  }, [buses])

  const movingBuses = buses.filter(b => (b.speed || 0) > 0).length
  const stoppedBuses = buses.length - movingBuses

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Bus Tracking</h3>
              <p className="text-xs text-blue-100">Real-time GPS monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-semibold text-white">LIVE</span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold text-white">{buses.length}</div>
            <div className="text-xs text-blue-100">Total Buses</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold text-green-300">{movingBuses}</div>
            <div className="text-xs text-blue-100">Moving</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-2xl font-bold text-red-300">{stoppedBuses}</div>
            <div className="text-xs text-blue-100">Stopped</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[500px]">
        {buses.length > 0 ? (
          <MapContainer
            center={defaultCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController buses={buses} />
            {buses.map((bus) => (
              <AnimatedMarker 
                key={bus.id} 
                bus={bus}
                prevPosition={prevBuses[bus.id]}
              />
            ))}
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No active buses with GPS data</p>
              <p className="text-sm text-gray-400 mt-2">Waiting for live tracking data...</p>
            </div>
          </div>
        )}

        {/* Last Update Indicator */}
        {buses.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200 z-[1000]">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600">Last updated:</span>
              <span className="font-semibold text-gray-800">
                {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Legend */}
        {buses.length > 0 && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-[1000]">
            <div className="text-xs font-semibold text-gray-700 mb-2">Legend</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Moving</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Stopped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Active GPS</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveMap
