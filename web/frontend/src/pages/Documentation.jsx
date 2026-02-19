import { FileText, Book, Download, ExternalLink, Search } from 'lucide-react'

function Documentation() {
  const docCategories = [
    {
      title: 'Getting Started',
      docs: [
        { name: 'Quick Start Guide', description: 'Get up and running in 5 minutes', type: 'guide' },
        { name: 'Installation Manual', description: 'Complete installation instructions', type: 'manual' },
        { name: 'System Requirements', description: 'Hardware and software requirements', type: 'reference' },
      ]
    },
    {
      title: 'User Guides',
      docs: [
        { name: 'Dashboard Overview', description: 'Navigate the main dashboard', type: 'guide' },
        { name: 'Live Tracking', description: 'Monitor buses in real-time', type: 'guide' },
        { name: 'Route Management', description: 'Create and manage bus routes', type: 'guide' },
        { name: 'Booking System', description: 'Handle passenger bookings', type: 'guide' },
      ]
    },
    {
      title: 'API Documentation',
      docs: [
        { name: 'REST API Reference', description: 'Complete API endpoint documentation', type: 'api' },
        { name: 'Authentication', description: 'API authentication methods', type: 'api' },
        { name: 'WebSocket Events', description: 'Real-time event documentation', type: 'api' },
      ]
    },
    {
      title: 'Administration',
      docs: [
        { name: 'User Management', description: 'Manage system users and permissions', type: 'admin' },
        { name: 'System Configuration', description: 'Configure system settings', type: 'admin' },
        { name: 'Backup & Recovery', description: 'Data backup and recovery procedures', type: 'admin' },
        { name: 'Troubleshooting', description: 'Common issues and solutions', type: 'admin' },
      ]
    }
  ]

  const getDocIcon = (type) => {
    switch (type) {
      case 'guide': return '📖'
      case 'manual': return '📋'
      case 'reference': return '📚'
      case 'api': return '🔧'
      case 'admin': return '⚙️'
      default: return '📄'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
              <p className="text-gray-500">Comprehensive guides and references for Smart DTC</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Documentation Categories */}
      <div className="space-y-8">
        {docCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-500" />
              {category.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.docs.map((doc, docIndex) => (
                <div key={docIndex} className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getDocIcon(doc.type)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          doc.type === 'guide' ? 'bg-green-100 text-green-700' :
                          doc.type === 'manual' ? 'bg-blue-100 text-blue-700' :
                          doc.type === 'reference' ? 'bg-purple-100 text-purple-700' :
                          doc.type === 'api' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {doc.type}
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a href="#" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">
            <span className="text-2xl">🚀</span>
            <div>
              <p className="font-medium text-blue-900">Quick Start</p>
              <p className="text-xs text-blue-700">Get started now</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-all">
            <span className="text-2xl">🔧</span>
            <div>
              <p className="font-medium text-green-900">API Docs</p>
              <p className="text-xs text-green-700">Developer reference</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all">
            <span className="text-2xl">❓</span>
            <div>
              <p className="font-medium text-purple-900">FAQ</p>
              <p className="text-xs text-purple-700">Common questions</p>
            </div>
          </a>
          
          <a href="#" className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all">
            <span className="text-2xl">📞</span>
            <div>
              <p className="font-medium text-orange-900">Support</p>
              <p className="text-xs text-orange-700">Get help</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Documentation