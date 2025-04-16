import React, { useState } from 'react'


const FolderList = ({folder}) => {
  
const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ml-4">
      <button onClick={() => setIsOpen(!isOpen)} className="flex text-xs w-full lg:text-md items-center gap-1">
        {/* Show an arrow only if the folder has children */}
        {folder.children && folder.children.length > 0 ? (
          <span>{isOpen ? "📂 v" : "📁 >"}</span>
        ) : (
          <span>📁</span> // No arrow for folders without children
        )}
        {folder.name}
      </button>

      {isOpen && folder.children && (
        <div className="ml-4">
          {folder.children.map((child, index) => (
            <FolderList key={index} folder={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FolderList