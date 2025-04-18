import { useNavigate } from "react-router-dom";
import cardData from "../Data/CardData";
import { useEffect, useState } from "react";

const FileFolderManager = () =>{
       
      
        const [activeTab, setActiveTab] = useState("folder-content");  
        const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, item:null }); //right button menu
       const [showMoveModal, setShowMoveModal] = useState(false);
        
        const [showCopyModal, setShowCopyModal] = useState(false);
        const [itemToCopy, setItemToCopy] = useState(null);
        const [itemToMove, setItemToMove] = useState([]);
      
        const [selectedItems, setSelectedItems] = useState([]);
      
        const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [itemToDelete, setItemToDelete] = useState(null);

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
          e.preventDefault(); // prevent default context menu
      
        const isAlreadySelected = selectedItems.some(i => i.id === item.id);
      
        // If right-clicked item is not already selected, select only that one
        if (!isAlreadySelected) {
          setSelectedItems([item]);
        }
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
      
        
      
        
        
        const handleMove = (itemsToMove, targetFolderId) => {
          const updatedCards = [...cards];
      
          const destinationFolder = updatedCards.find(
            card => card.id === parseInt(targetFolderId)
          );
        
          if (!destinationFolder || destinationFolder.folderORfile !== 'folder') return;
        
          const items = Array.isArray(itemsToMove) ? itemsToMove : [itemsToMove];
        
          items.forEach(item => {
            // Remove from any existing folders
            updatedCards.forEach(folder => {
              if (folder.folderItems) {
                folder.folderItems = folder.folderItems.filter(id => id !== item.id);
              }
            });
        
            // Add to destination folder
            destinationFolder.folderItems.push(item.id);
          });
        
          setCards(updatedCards);
          localStorage.setItem("cards", JSON.stringify(updatedCards));
          console.log(`Moved ${items.length} item(s) to folder ID: ${targetFolderId}`);
        };

        const handleMoveInFiles = (itemsToMove, targetFolderId) => {
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
        


        return{activeTab, setActiveTab, contextMenu, setContextMenu, showMoveModal, setShowMoveModal, showCopyModal, setShowCopyModal, 
            itemToCopy, setItemToCopy, itemToMove, setItemToMove, selectedItems, setSelectedItems, showDeleteModal, setShowDeleteModal, 
            itemToDelete, setItemToDelete, cards, setCards,  topLevelItems, handleSelectItem, navigate, handleRightClick, handleOpenMetadata,
            handleOpenFileItems, folders,  confirmDelete, handleDelete, handleMove,handleMoveInFiles, cancelDelete, handleCopy}


}

export default FileFolderManager