import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import FolderCard from '../Components/FolderCard';
import MoveFileFolderModal from '../Components/MoveFileFolderModal';
import CopyFileFolderModal from '../Components/CopyFileFolderModal';
import DeleteFileFolderModal from '../Components/DeleteFileFolderModal';

const FolderItems = () => {

  const { id } = useParams();
  const [folder, setFolder] = useState(null);
  const [items, setItems] = useState([]);
 const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null }); //right button menu
 const [showMoveModal, setShowMoveModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [itemToCopy, setItemToCopy] = useState(null);
  const [itemToMove, setItemToMove] = useState([]);
 const navigate = useNavigate();

 const [selectedItems, setSelectedItems] = useState([]);

 const [showDeleteModal, setShowDeleteModal] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);

 const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('cards');
    return saved ? JSON.parse(saved) : cardData;
  });

  const handleRightClick = (e, item) => {
    e.preventDefault(); // prevent default context menu

  const isAlreadySelected = selectedItems.some(i => i.id === item.id);

  // If right-clicked item is not already selected, select only that one
  if (!isAlreadySelected) {
    setSelectedItems([item]);
  }
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

  
  
  const handleMove = (itemsToMove, targetFolderId) => {
    const updatedCards = [...cards];
  
    const items = Array.isArray(itemsToMove) ? itemsToMove : [itemsToMove];
  
    // Remove items from any existing folders
    updatedCards.forEach(folder => {
      if (folder.folderItems) {
        folder.folderItems = folder.folderItems.filter(
          id => !items.some(item => item.id === id)
        );
      }
    });
  
    // If moving to a folder (not homepage)
    if (targetFolderId !== null) {
      const destinationFolder = updatedCards.find(
        card => card.id === parseInt(targetFolderId)
      );
  
      if (!destinationFolder || destinationFolder.folderORfile !== 'folder') return;
  
      items.forEach(item => {
        destinationFolder.folderItems.push(item.id);
      });
    }
  
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
    console.log(`Moved ${items.length} item(s) to ${targetFolderId === null ? 'Homepage' : 'folder ID: ' + targetFolderId}`);
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

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    const itemIds = itemToDelete.map(item => item.id);
  
    const updatedCards = cards
      .filter(card => !itemIds.includes(card.id))
      .map(card => {
        if (card.folderItems) {
          return {
            ...card,
            folderItems: card.folderItems.filter(
              id => !itemIds.includes(id) && !itemIds.includes(String(id))
            ),
          };
        }
        return card;
      });
  
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
    setShowDeleteModal(false);
    setItemToDelete(null);
    setSelectedItems([]); // clear selection
    window.location.reload();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
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
                                        <li onClick={()=>{
                                          const items = selectedItems.length ? selectedItems : [contextMenu.item];
                                          setItemToMove(items);
                                          setShowMoveModal(true);}}>Move Folder</li>
                                        <li onClick={() => {
                                                 setItemToCopy(selectedItems.length ? selectedItems : [contextMenu.item]);
                                                setShowCopyModal(true);
                                              }}>Copy</li>
                                        <li onClick={() => confirmDelete(selectedItems)}>Delete</li>
                                      </>
                                    )}
                                    {(contextMenu.type === 'file') && (
                                      <>
                                        <li onClick={handleOpenMetadata}>Open Meta</li>
                                        <li onClick={()=>{const items = selectedItems.length ? selectedItems : [contextMenu.item];
                                             setItemToMove(items);
                                              setShowMoveModal(true);}}>Move File</li>
                                        <li onClick={() => {
                                               setItemToCopy(selectedItems.length ? selectedItems : [contextMenu.item]);
                                              setShowCopyModal(true);
                                              
                                            }}>Copy</li>
                                        <li onClick={() => confirmDelete(selectedItems)}>Delete</li>
                                      </>
                                    )}
                                   
                                  </ul>
                                )}
            <MoveFileFolderModal
            isOpen={showMoveModal}
            onClose={() => setShowMoveModal(false)}
            onMove={handleMove}
            folders={folders}
            item={itemToMove}></MoveFileFolderModal>

          {showCopyModal && (
              <CopyFileFolderModal
              isOpen={showCopyModal}
              folders={folders}
              item={selectedItems}
              onCopy={handleCopy}
              onClose={() => setShowCopyModal(false)}
              />
            )}

          <DeleteFileFolderModal
            show={showDeleteModal}
            item={itemToDelete?.length === 1 ? itemToDelete[0] : { title: `${itemToDelete?.length} items` }}
            onDelete={handleDelete}
            onCancel={cancelDelete}
          />
    </div>
  )
}

export default FolderItems