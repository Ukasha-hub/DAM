import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import FolderCard from '../Components/FolderCard';
import MoveFileFolderModal from '../Components/MoveFileFolderModal';
import CopyFileFolderModal from '../Components/CopyFileFolderModal';

const FolderItems = () => {

  const { id } = useParams();
  const [folder, setFolder] = useState(null);
  const [items, setItems] = useState([]);
 const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null }); //right button menu
 const [showMoveModal, setShowMoveModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [itemToCopy, setItemToCopy] = useState(null);
 const navigate = useNavigate();

 const [selectedItems, setSelectedItems] = useState([]);

 const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('cards');
    return saved ? JSON.parse(saved) : cardData;
  });

  const handleRightClick = (e, item) => {
    setContextMenu({
        visible: true,
        x: e.pageX,
        y: e.pageY,
        type: item.folderORfile,  // 'folder' or 'file'
        item: item,
    });
  };

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

  
  
  const handleMove = (item, targetFolderId) => {
    // Make a deep copy of cards
  const updatedCards = [...cards];

  // Remove the item from any folder that contains it
  updatedCards.forEach(card => {
    if (card.folderORfile === 'folder') {
      const index = card.folderItems.indexOf(item.id);
      if (index !== -1) {
        card.folderItems.splice(index, 1);
      }
    }
  });
  
  

  // Add the moved item ID to the folderItems array
  // If moving to a new folder (not homepage)
  if (targetFolderId) {
    const targetFolder = updatedCards.find(card => card.id === parseInt(targetFolderId)); // Find the destination folder
    if (targetFolder && targetFolder.folderORfile === 'folder') {
      targetFolder.folderItems.push(item.id);
    }
  }

  // Add item back to main list if you still want to show it
  //updatedCards.push(item); // optional depending on design

  setCards(updatedCards);
  console.log(`Moved item "${item.title}" (ID: ${item.id}) to folder ID: ${targetFolderId}`);
  localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  

  const folders = cards.filter(f => f.folderORfile === 'folder');

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

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cards")) || [];
    const targetFolder = data.find(item => item.id === parseInt(id) && item.folderORfile === "folder");
    setFolder(targetFolder);

    if (targetFolder) {
        const childItems = data.filter(item =>
            targetFolder.folderItems.includes(item.id) || 
            targetFolder.folderItems.includes(String(item.id))
          )
      setItems(childItems);
    }
  }, [id]);

  if (!folder) return <div className="p-4">Folder not found.</div>;
  if (items.length === 0) return <div className="p-4">This folder is empty.</div>;

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
     <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
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
      }}>
      {items.map(item => (
        <FolderCard key={item.id} item={item} onRightClick={handleRightClick} onSelect={handleSelectItem}
        isSelected={selectedItems.some(i => i.id === item.id)}/>
      ))}

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
  )
}

export default FolderItems