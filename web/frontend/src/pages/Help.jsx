import { HelpCircle, Book, MessageSquare, Phone, Mail, FileText } from 'lucide-react'

function Help() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-500">Get assistance and find answers to your questions</p>
          </div>
        </div>
      </div>

      {/* Help Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Documentation</h3>
              <p className="text-sm text-gray-500">Browse user guides and tutorials</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-500">Chat with our support team</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Phone Support</h3>
              <p className="text-sm text-gray-500">Call us for immediate assistance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Support</h3>
              <p className="text-sm text-gray-500">Send us your questions via email</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">FAQ</h3>
              <p className="text-sm text-gray-500">Frequently asked questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Phone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Phone</p>
            <p className="text-gray-600">+91 11 2345 6789</p>
          </div>
          <div className="text-center">
            <Mail className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Email</p>
            <p className="text-gray-600">support@smartdtc.com</p>
          </div>
          <div className="text-center">
            <MessageSquare className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Live Chat</p>
            <p className="text-gray-600">Available 24/7</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help