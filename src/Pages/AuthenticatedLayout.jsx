import React from 'react'
import Topbar from '../Components/Topbar'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router-dom'

const AuthenticatedLayout = () => {
  return (
    <div>
        <Topbar></Topbar>
        <div className='flex flex-col lg:flex-row'>
        <Sidebar />
        <div className="flex-1 p-3 ">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthenticatedLayout