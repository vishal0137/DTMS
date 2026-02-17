import { Home, Bus, Route, Users, CreditCard, MapPin, BarChart3, Navigation } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

function Sidebar({ isOpen }) {
  const location = useLocation()
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Navigation, label: 'Live Tracking', path: '/live-tracking' },
    { icon: Bus, label: 'Bus Routes', path: '/bus-routes' },
    { icon: Route, label: 'Routes', path: '/routes' },
    { icon: MapPin, label: 'Stops', path: '/stops' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: CreditCard, label: 'Bookings', path: '/bookings' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ]

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400">Smart DTC</h1>
        <p className="text-xs text-gray-400 mt-1">Transit Management</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                isActive ? 'bg-gray-800 text-white border-l-4 border-blue-500' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
