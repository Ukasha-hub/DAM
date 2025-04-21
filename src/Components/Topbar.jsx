import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Topbar = () => {
  
    const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
                <div className="navbar bg-base-100 shadow-sm flex justify-between">
                    <div className='flex flex-row lg:gap-20 '>
                        <div className="">
                        <Link to="/" className="btn btn-ghost text-sm lg:text-xl">DAM</Link>
                           
                        </div>
                        <div className="flex gap-2 bg-gray-200 p-1 rounded-md">
                            <input type="text" placeholder="Quick Search" className="input input-bordered h-8 mt-1  w-20 md:w-40 lg:w-60" />
                            <div className="dropdown ">
                                <div tabIndex={0} role="button" className="btn btn-xs text-xs lg:btn-sm m-1">All Assets ▼</div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                    <li><a>Item 1</a></li>
                                    <li><a>Item 2</a></li>
                                </ul>
                            </div>
                            <button className="btn btn-xs text-xs lg:btn-sm m-1">Search</button>
                        </div>

                    </div>
                    
                     {/* Hamburger Menu for Mobile */}
                    <div className="lg:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost text-xl">
                        ☰
                        </button>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute z-1 top-16 right-0 bg-white shadow-md p-4 w-48 rounded-lg lg:hidden">
                        <ul className="flex flex-col gap-3 text-xs">
                            <li><a href="#">Show basket</a></li>
                            <li><a href="#">Feedback</a></li>
                            <li><a href="#">Deepto Admin</a></li>
                        </ul>
                        </div>
                    )}

                    <div className='hidden lg:flex'>
                        <ul className='flex flex-row gap-7 justify-around text-xs'>
                            <li><a href="#">Show basket</a></li>
                            <li><a href="#">Feedback</a></li>
                            <li><a href="#">Deepto Admin</a></li>
                        </ul>
                    </div>
                </div>
    </div>
  )
}

export default Topbar