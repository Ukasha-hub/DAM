import React, { useState } from 'react'
import { FaChevronDown, FaChevronRight, FaFolder } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const FolderList = ({ folder, cards }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubfolders = folder.folderItems && folder.folderItems.length > 0;

  const navigate = useNavigate();

  // Find the corresponding objects for each folderItem ID
  const folderItemObjects = folder.folderItems.map(id => {
    return cards.find(item => item.id === id);
  }).filter(item => item !== undefined); // Make sure to remove undefined items if any ID doesn't match

  return (
    <div className="ml-2 mb-1">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => hasSubfolders && setIsOpen(!isOpen)}
      >
        {hasSubfolders && (
          <span className="mr-1">
            {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
          </span>
        )}
        <FaFolder className="text-yellow-500 mr-2" />
        <span onClick={() => navigate(`/folderitem/${folder.id}`)}>{folder.title}</span>
      </div>

      {isOpen && hasSubfolders && (
        <div className="ml-4 border-l pl-2 mt-1">
          {folderItemObjects.map(sub => {
            if (sub.folderORfile === "folder") {
              return <FolderList key={sub.id} folder={sub} cards={cards} />;
            } 
          })}
        </div>
      )}
    </div>
  );
};     
export default FolderList