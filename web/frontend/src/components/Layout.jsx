import { useState } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

function Layout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
