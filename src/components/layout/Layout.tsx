import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
