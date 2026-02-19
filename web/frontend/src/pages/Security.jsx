import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle } from 'lucide-react'

function Security() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
            <p className="text-gray-500">Manage your account security and access controls</p>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Password Protected</p>
              <p className="text-sm text-green-700">Strong password set</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Session Secure</p>
              <p className="text-sm text-green-700">Active session encrypted</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">2FA Recommended</p>
              <p className="text-sm text-yellow-700">Enable for extra security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition-all">
            Change Password
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
          </div>
          <button className="w-full border border-gray-200 py-2 px-4 rounded-xl hover:bg-gray-50 transition-all">
            Enable 2FA
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Login Activity</h3>
              <p className="text-sm text-gray-500">View recent login attempts</p>
            </div>
          </div>
          <button className="w-full border border-gray-200 py-2 px-4 rounded-xl hover:bg-gray-50 transition-all">
            View Activity
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Security Alerts</h3>
              <p className="text-sm text-gray-500">Configure security notifications</p>
            </div>
          </div>
          <button className="w-full border border-gray-200 py-2 px-4 rounded-xl hover:bg-gray-50 transition-all">
            Manage Alerts
          </button>
        </div>
      </div>
    </div>
  )
}

export default Security