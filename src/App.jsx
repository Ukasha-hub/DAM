
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Topbar from './Components/Topbar'
import Sidebar from './Components/Sidebar'
import Homepage from './Pages/Homepage'

import { Route, Routes } from 'react-router-dom'
import AddFilePage from './Pages/AddFilePage'
import VideoMetadata from './Pages/VideoMetadata'
import Login from './Pages/Login'
import AuthenticatedLayout from './Pages/AuthenticatedLayout'
import FolderItems from './Pages/FolderItems'
import logo from '/src/assets/sysnova broadcast logo.png'; 


function App() {
  
  
  return (
    <>
     <Routes>
      {/* Routes with layout */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/add-files" element={<AddFilePage />} />
        <Route path="/metadata/:id" element={<VideoMetadata />} />
        <Route path="/folderitem/:id" element={<FolderItems />}></Route>
       
      </Route>

      {/* Route without layout */}
      <Route path="/login" element={<Login />} />
    </Routes>

   
    
     
    </>
  )
}

export default App
