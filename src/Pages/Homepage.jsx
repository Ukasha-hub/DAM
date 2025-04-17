import React, { useEffect, useState } from 'react'
import cardData from '../Data/CardData'
import FolderCard from '../Components/FolderCard'

import { useNavigate } from 'react-router-dom'
import MoveFileFolderModal from '../Components/MoveFileFolderModal'
import CopyFileFolderModal from '../Components/CopyFileFolderModal'


const Homepage = () => {

  const [activeTab, setActiveTab] = useState("folder-content");  
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, item:null }); //right button menu
  const [showMoveModal, setShowMoveModal] = useState(false);
  
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [itemToCopy, setItemToCopy] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('cards');
    return saved ? JSON.parse(saved) : cardData;
  });

  //moved files or folders will be hidden from top level
  const topLevelItems = cards.filter(item =>
    !cards.some(card =>
      card.folderORfile === 'folder' &&
      card.folderItems.includes(item.id)
    )
  );
  
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  
  const handleSelectItem = (item) => {
    setSelectedItems((prevSelected) => {
      const isAlreadySelected = prevSelected.some(i => i.id === item.id);
      if (isAlreadySelected) {
        return prevSelected.filter(i => i.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };

 
  const navigate = useNavigate();

  const handleRightClick = (e, item) => {
    setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        type: item.folderORfile,  // 'folder' or 'file'
        item: item,
    });
  };

  //opening metadata using right button menu/context menu
  const handleOpenMetadata = () => {
    if (contextMenu.item && contextMenu.item.id) {
      navigate(`/metadata/${contextMenu.item.id}`);
    }
  };

  //opening Folder items using right button menu/context menu
  const handleOpenFileItems = () => {
    if (contextMenu.item && contextMenu.item.id) {
      navigate(`/folderitem/${contextMenu.item.id}`);
    }
  };

  // Close context/right button menu on outside click 
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    

    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('click', handleClick);
      
    };
  }, [contextMenu]);

  

  
  
  const handleMove = (item, targetFolderId) => {
        // Make a deep copy of cards
      const updatedCards = [...cards];

      

      // Find the destination folder
      const targetFolder = updatedCards.find(card => card.id === parseInt(targetFolderId));

      // Add the moved item ID to the folderItems array
      if (targetFolder && targetFolder.folderORfile === 'folder') {
        targetFolder.folderItems.push(item.id);
      }

      // Add item back to main list if you still want to show it
      //updatedCards.push(item); // optional depending on design

      setCards(updatedCards);
      console.log(`Moved item "${item.title}" (ID: ${item.id}) to folder ID: ${targetFolderId}`);
      localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  

  const folders = cards.filter(f => f.folderORfile === 'folder');
  
  const handleDelete = (itemId) => {
    const updatedCards = cards.filter(card => card.id !== itemId);
    updatedCards.forEach(card => {
      if (card.folderItems) {
        card.folderItems = card.folderItems.filter(id => id !== itemId && id !== String(itemId));
      }
    });
    setCards(updatedCards);
    localStorage.setItem('cards', JSON.stringify(updatedCards));
    window.location.reload();
  };

  const handleCopy = (originalItems, targetFolderId) => {
    const updatedCards = [...cards];
  
    // Ensure originalItems is always an array
    const itemsToCopy = Array.isArray(originalItems) ? originalItems : [originalItems];
  
    itemsToCopy.forEach(originalItem => {
      const newId = crypto.randomUUID();// or use a proper ID generator
      const copiedItem = {
        ...originalItem,
        id: newId,
        title: `${originalItem.title} (copy)`
      };
  
      if (targetFolderId !== 'null') {
        const destinationFolder = updatedCards.find(f => f.id === parseInt(targetFolderId));
        if (destinationFolder && destinationFolder.folderORfile === 'folder') {
          destinationFolder.folderItems.push(newId);
        }
      }
  
      updatedCards.push(copiedItem);
    });
  
    setCards(updatedCards);
    localStorage.setItem('cards', JSON.stringify(updatedCards));
  };
  

  
  return (
    <div className='p-3  w-full'>
        {/*tab */}
        <div className=' h-20 '>
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-lift">
            <input type="radio" name="" className="tab" aria-label="Folder Content" checked={activeTab === "folder-content"} onChange={() => setActiveTab("folder-content")}/>
            <div className="tab-content bg-base-100 border-base-300 p-6">
                        {/*breadcrump */}
                        <div className='flex flex-col lg:flex-row  lg:justify-between '>
                            <div className="breadcrumbs text-xs lg:text-sm">
                                <ul>
                                    <li><a>Home</a></li>
                                    <li><a>Documents</a></li>
                                    <li>Add Document</li>
                                </ul>
                            </div>
                            <div className=''>
                                    <ul className='flex flex-row gap-7 lg:justify-around text-xs'>
                                        <li><a href="">Folder Subscribe</a></li>
                                        <li><a href="">Folder Settings</a></li>
                                        
                                    </ul>
                            </div>
                        </div>

                        {/*buttons and paginations */}
                        <div>
                        <div className=" text-xs mt-1 lg:text-sm flex flex-col gap-1 lg:flex-row justify-evenly lg:justify-between">
                                <ul className='flex flex-row gap-2 lg:gap-3 '>
                                    
                                    <li><button onClick={() => navigate("/add-files")} className="btn-xs bg-green-300 p-1 rounded-sm">Add Files</button></li>
                                    <li><a href="">Select all</a></li>
                                    <li><a href="">Search within folder</a></li>
                                    
                                    
                                    <li>
                                        <div className="dropdown ">
                                                <div tabIndex={0} role="button" className="text-xs lg:text-sm lg:btn-sm ">More actions ▼</div>
                                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                                    <li><a>Item 1</a></li>
                                                    <li><a>Item 2</a></li>
                                                </ul>
                                        </div>
                                    </li>
                                </ul>
                                <ul className='flex flex-row gap-3'>
                                    <div className="join">
                                        <button className="join-item btn btn-xs">«</button>
                                        <button className="join-item btn btn-xs">Page 22</button>
                                        <button className="join-item btn btn-xs">»</button>
                                    </div>
                                    <div className='flex flex-row'>
                                    <h6>Page:</h6>
                                    <div className="dropdown ">
                                                <div tabIndex={0} role="button" className="text:xs lg:text-sm border-1  rounded-sm lg:btn-sm">1 ▼</div>
                                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                                    <li><a href=''>Item 1</a></li>
                                                    <li><a href=''>Item 2</a></li>
                                                </ul>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-1'>
                                    <h6>Sort by:</h6>
                                    <div className="dropdown ">
                                                <div tabIndex={0} role="button" className=" text-xs lg:text-sm border-1 rounded-sm lg:btn-sm w-15 lg:w-25  flex justify-between "><span>Name</span> <span>▼</span> </div>
                                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                                    <li><a>Item 1</a></li>
                                                    <li><a>Item 2</a></li>
                                                </ul>
                                        </div>
                                        <div className="dropdown dropdown-end">
                                                <div tabIndex={0} role="button" className=" text-xs lg:text-sm border-1 rounded-sm lg:btn-sm w-15 lg:w-25  flex justify-between "><span>50</span> <span>▼</span> </div>
                                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                                    <li><a>Item 1</a></li>
                                                    <li><a>Item 2</a></li>
                                                </ul>
                                        </div>
                                    </div>

                                </ul>
                            </div>
                            

                        </div>
                        {/*cards of folders */}
                       <div
                            className="relative min-h-screen"
                            onContextMenu={(e) => {
                                // Only show blank menu if clicked outside item
                                if (e.target === e.currentTarget) {
                                e.preventDefault();
                                setContextMenu({
                                    visible: true,
                                    x: e.clientX,
                                    y: e.clientY,
                                    type: 'blank',
                                    item: null,
                                });
                                }
                            }}
                            >
                            {/* Grid inside */}
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
                                {topLevelItems.map((item) => (
                                <FolderCard key={item.id} item={item} onRightClick={handleRightClick} onSelect={handleSelectItem}
                                isSelected={selectedItems.some(i => i.id === item.id)} />
                                ))}
                            </div>

                            {/* Context menu */}
                            {contextMenu.visible && (
                                  <ul
                                    className="fixed bg-white border rounded shadow-lg text-sm z-50"
                                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                                  >
                                    {(contextMenu.type === 'folder') && (
                                      <>
                                        <li onClick={handleOpenFileItems}>Open Folder</li>
                                        <li onClick={()=>{setShowMoveModal(true);}}>Move Folder</li>
                                        <li onClick={() => {
                                                setItemToCopy(selectedItems.length ? selectedItems : [contextMenu.item]);
                                                setShowCopyModal(true);
                                              }}>Copy</li>
                                        <li onClick={() => handleDelete(contextMenu.item.id)}>Delete</li>
                                      </>
                                    )}
                                    {(contextMenu.type === 'file') && (
                                      <>
                                        <li onClick={handleOpenMetadata}>Open Meta</li>
                                        <li onClick={()=>{setShowMoveModal(true);}}>Move File</li>
                                        <li onClick={() => {
                                              setItemToCopy(selectedItems.length ? selectedItems : [contextMenu.item]);
                                              setShowCopyModal(true);
                                            }}>Copy</li>
                                        <li onClick={() => handleDelete(contextMenu.item.id)}>Delete</li>
                                      </>
                                    )}
                                    
                                  </ul>
                                )}
                        </div>
                    </div>

            <input type="radio" name="my_tabs_3" className="tab" aria-label="Videos"  checked={activeTab === "videos"} onChange={() => setActiveTab("videos")}/>
            <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 2</div>

            </div>
            <MoveFileFolderModal
            isOpen={showMoveModal}
            onClose={() => setShowMoveModal(false)}
            onMove={handleMove}
            folders={folders}
            item={contextMenu.item}></MoveFileFolderModal>

            {showCopyModal && (
              <CopyFileFolderModal
              isOpen={showCopyModal}
              folders={folders}
              item={selectedItems}
              onCopy={handleCopy}
              onClose={() => setShowCopyModal(false)}
              />
            )}
        </div>
        


    </div>

    
  )
}

export default Homepage;  