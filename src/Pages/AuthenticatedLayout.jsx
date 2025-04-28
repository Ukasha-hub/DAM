import React from 'react'
import Topbar from '../Components/Topbar'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router-dom'
import useFileFolderManager from '../Hooks/useFileFolderManager'
import logo from '../assets/sysnova broadcast logo.png'; 



const AuthenticatedLayout = () => {
  

  //console.log(cards)
  return (
    <>
    <div>
        <Topbar></Topbar>
        <div className='flex flex-col lg:flex-row'>
        <Sidebar   />
        
        <div className="flex-1 p-3 ">
          <Outlet />
          
        </div>
      </div>
      <div className='hidden lg:block  flex flex-col mt-[20%] justify-end '>
      <footer className="footer sm:footer-horizontal bg-gray-100 opacity-90 sticky   text-gray-800 justify-center p-4">
                                          
                                              
                                          <div className='flex flex-row'><span>Developed by:</span> <img src={logo} alt="" className='h-7 w-30'/></div>
                                      
                                      
      </footer>
      </div>
      
    </div>
    
    </>
  )
}

export default AuthenticatedLayout