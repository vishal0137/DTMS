import { Database, Server, Wifi, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react'

function SystemStatus() {
  const systemServices = [
    { name: 'Database', status: 'online', uptime: '99.9%', lastCheck: '2 min ago', icon: Database, color: 'green' },
    { name: 'API Server', status: 'online', uptime: '99.8%', lastCheck: '1 min ago', icon: Server, color: 'green' },
    { name: 'Live Tracking', status: 'online', uptime: '99.7%', lastCheck: '30 sec ago', icon: Wifi, color: 'green' },
    { name: 'Analytics', status: 'maintenance', uptime: '98.5%', lastCheck: '5 min ago', icon: Activity, color: 'yellow' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50 border-green-200'
      case 'maintenance': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'offline': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'maintenance': return <Clock className="w-5 h-5 text-yellow-600" />
      case 'offline': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
            <p className="text-gray-500">Monitor system health and service availability</p>
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Overall System Health</h3>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">All Systems Operational</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="text-2xl font-bold text-green-600">99.8%</div>
            <div className="text-sm text-green-700">Overall Uptime</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">45</div>
            <div className="text-sm text-blue-700">Active Buses</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">1,247</div>
            <div className="text-sm text-purple-700">Active Users</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">12ms</div>
            <div className="text-sm text-orange-700">Avg Response</div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Status</h3>
        <div className="space-y-4">
          {systemServices.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  service.color === 'green' ? 'bg-green-50' : 
                  service.color === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'
                }`}>
                  <service.icon className={`w-6 h-6 ${
                    service.color === 'green' ? 'text-green-600' : 
                    service.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last checked</p>
                  <p className="text-sm font-medium text-gray-700">{service.lastCheck}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(service.status)}`}>
                  {getStatusIcon(service.status)}
                  <span className="text-sm font-medium capitalize">{service.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent System Events</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">System backup completed successfully</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Activity className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Database optimization completed</p>
              <p className="text-xs text-gray-500">6 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Scheduled maintenance window started</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus