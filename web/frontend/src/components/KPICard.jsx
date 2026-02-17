function KPICard({ title, value, icon: Icon, color, trend }) {
  // Convert bright colors to soft colors
  const softColors = {
    'bg-blue-500': 'bg-blue-50 border-blue-100',
    'bg-green-500': 'bg-green-50 border-green-100',
    'bg-purple-500': 'bg-purple-50 border-purple-100',
    'bg-orange-500': 'bg-orange-50 border-orange-100',
    'bg-red-500': 'bg-red-50 border-red-100',
    'bg-yellow-500': 'bg-yellow-50 border-yellow-100',
    'bg-pink-500': 'bg-pink-50 border-pink-100',
    'bg-indigo-500': 'bg-indigo-50 border-indigo-100',
  }

  const iconColors = {
    'bg-blue-500': 'text-blue-500',
    'bg-green-500': 'text-green-500',
    'bg-purple-500': 'text-purple-500',
    'bg-orange-500': 'text-orange-500',
    'bg-red-500': 'text-red-500',
    'bg-yellow-500': 'text-yellow-500',
    'bg-pink-500': 'text-pink-500',
    'bg-indigo-500': 'text-indigo-500',
  }

  const softColor = softColors[color] || 'bg-gray-50 border-gray-100'
  const iconColor = iconColors[color] || 'text-gray-500'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift animate-scaleIn">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1">
              <div className={`flex items-center text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </div>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl border ${softColor} transition-transform hover:scale-110 duration-300`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}

export default KPICard
