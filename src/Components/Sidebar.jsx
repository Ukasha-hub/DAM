import React from 'react'
import { useState } from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";

import FolderList from './FolderList';
import folderData from '../Data/FolderData';
import cardData from "../Data/CardData";
import { Link } from 'react-router-dom';



const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem('cards');
        return saved ? JSON.parse(saved) : cardData;
      });
  return (
    <div>
        {/*hamburger menu */}
           <button className="p-4 lg:hidden"  onClick={() => setIsOpen(!isOpen)} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-800">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>

            {/* Mobile Menu (Hidden by Default) */}
            {isOpen && (
                <div className="flex flex-col lg:hidden">
                    <div className="divide-y divide-gray-300">
                    <h2 className=" text-xs lg:text-md mb-1">Folders</h2>
                    {cards
  .filter(item => item.folderORfile === "folder" && !cards.some(parent => 
    Array.isArray(parent.folderItems) && parent.folderItems.includes(item.id)
  ))
  .map((folder, index) => (
    <FolderList key={index} folder={folder} cards={cards} />
))}
                                        
                </div>
                        
                </div>
            )}

             {/* Desktop sidebar */}

            <div className=" hidden lg:block h-screen  p-3 space-y-2 w-60  shadow-sm  text-black">
                
               
                <div className="divide-y divide-gray-300">
                  <Link to='/'><h2 className=" text-md mb-2">🏠 HomePage</h2></Link>
                  <hr/>
                    
                    {cards
  .filter(item => item.folderORfile === "folder" && !cards.some(parent => 
    Array.isArray(parent.folderItems) && parent.folderItems.includes(item.id)
  ))
  .map((folder, index) => (
    <FolderList className="" key={index} folder={folder} cards={cards} />
))}
                    
                </div>
            </div>
    </div>
  )
}

export default Sidebar