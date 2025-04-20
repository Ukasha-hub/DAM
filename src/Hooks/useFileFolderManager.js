import { useNavigate } from "react-router-dom";
import cardData from "../Data/CardData";
import { useEffect, useMemo, useState } from "react";

const useFileFolderManager = () =>{
       
      
        const [activeTab, setActiveTab] = useState("folder-content");  
        const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, item:null }); //right button menu
       const [showMoveModal, setShowMoveModal] = useState(false);
        
        const [showCopyModal, setShowCopyModal] = useState(false);
        const [itemToCopy, setItemToCopy] = useState(null);
        const [itemToMove, setItemToMove] = useState([]);
      
        const [selectedItems, setSelectedItems] = useState([]);
      
        const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [itemToDelete, setItemToDelete] = useState(null);

      const [items, setItems] = useState([]);

      const [cards, setCards] = useState(() => {
        const saved = localStorage.getItem('cards');
        return saved ? JSON.parse(saved) : cardData;
      });


     

       //moved files or folders will be hidden from top level
       const topLevelItems = useMemo(() => {
        return cards.filter(item =>
          !cards.some(card =>
            card.folderORfile === 'folder' &&
            card.folderItems.includes(item.id)
          )
        );
      }, [cards]);

    
    

    const [sortBy, setSortBy] = useState("name"); // default sort
const [sortOrder, setSortOrder] = useState("asc"); // ascending or descending

const sortedItems = [...topLevelItems].sort((a, b) => {
  if (sortBy === "name") {
    const nameA = a.title.toLowerCase();
    const nameB = b.title.toLowerCase();
    return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  }
  // Add more sorting options here
  return 0;
});

const handleSort = (criteria) => {
  if (sortBy === criteria) {
    // Toggle order if same sort clicked
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortBy(criteria);
    setSortOrder("asc"); // default to ascending on new sort
  }
};



 //Pagination handling 

 const [currentPage, setCurrentPage] = useState(1);
        
 const [itemsPerPage, setItemsPerPage] = useState(10);
 const totalPages = Math.ceil(sortedItems .length / itemsPerPage); // Calculate total pages
   // Calculate start and end indices for current page
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
 const currentItems = sortedItems.slice(startIndex, endIndex);
 const paginatedTopLevelItems = topLevelItems.slice(startIndex, endIndex);

 // Change page function
 const changePage = (page) => {
   if (page > 1 && page <= totalPages) {
     setCurrentPage(page);
   }
 };

 const handleItemsPerPageChange = (count) => {
  setItemsPerPage(count);
  setCurrentPage(1); // Reset to page 1 when changing items per page
};

//For folderItems
const [sortByinFiles, setSortByinFiles] = useState("name"); // default sort
const [sortOrderinFiles, setSortOrderinFiles] = useState("asc"); // ascending or descending

const sortedItemsinFiles = [...items].sort((a, b) => {
  if (sortByinFiles === "name") {
    const nameA = a.title.toLowerCase();
    const nameB = b.title.toLowerCase();
    return sortOrderinFiles === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  }
  // Add more sorting options here
  return 0;
});

const handleSortinFiles = (criteria) => {
  if (sortBy === criteria) {
    // Toggle order if same sort clicked
    setSortOrderinFiles((prev) => (prev === "asc" ? "desc" : "asc"));
  } else {
    setSortByinFiles(criteria);
    setSortOrderinFiles("asc"); // default to ascending on new sort
  }
};

const [currentPageinFiles, setCurrentPageinFiles] = useState(1);
        
 const [itemsPerPageinFiles, setItemsPerPageinFiles] = useState(5);
 const totalPagesinFiles = Math.ceil(sortedItemsinFiles .length / itemsPerPageinFiles); // Calculate total pages
   // Calculate start and end indices for current page
   const startIndexinFiles = (currentPageinFiles - 1) * itemsPerPageinFiles;
   const endIndexinFiles = startIndexinFiles + itemsPerPageinFiles;
 const currentItemsinFiles = sortedItemsinFiles.slice(startIndexinFiles, endIndexinFiles);
 const paginatedTopLevelItemsinFiles = items.slice(startIndexinFiles, endIndexinFiles);

  // Change page function
  const changePageinFiles = (page) => {
    if (page > 1 && page <= totalPagesinFiles) {
      setCurrentPageinFiles(page);
    }
  };
 
  const handleItemsPerPageChangeinFiles = (count) => {
   setItemsPerPageinFiles(count);
   setCurrentPageinFiles(1); // Reset to page 1 when changing items per page
 };


    useEffect(() => {
        localStorage.setItem('cards', JSON.stringify(cards));
      }, [cards]);

      const handleSelectItem = (item) => {
        setSelectedItems((prevSelected) => {
          const exists = prevSelected.find(i => i.id === item.id);
          if (exists) {
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

        const handleMoveInFolders = (itemsToMove, targetFolderId) => {
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
        


        return{handleItemsPerPageChangeinFiles , changePageinFiles ,paginatedTopLevelItemsinFiles,currentItemsinFiles,totalPagesinFiles,itemsPerPageinFiles, setItemsPerPageinFiles, currentPageinFiles, setCurrentPageinFiles,handleSortinFiles,sortOrderinFiles, setSortOrderinFiles, sortByinFiles, setSortByinFiles,sortedItemsinFiles,items, setItems, itemsPerPage,handleItemsPerPageChange ,handleSort,sortBy, sortOrder,currentPage, setCurrentPage, changePage,totalPages,currentItems,paginatedTopLevelItems , activeTab,  setActiveTab, contextMenu, setContextMenu, showMoveModal, setShowMoveModal, showCopyModal, setShowCopyModal, 
            itemToCopy, setItemToCopy, itemToMove, setItemToMove, selectedItems, setSelectedItems, showDeleteModal, setShowDeleteModal, 
            itemToDelete, setItemToDelete, cards, setCards,  topLevelItems, handleSelectItem, navigate, handleRightClick, handleOpenMetadata,
            handleOpenFileItems, folders,  confirmDelete, handleDelete, handleMove,handleMoveInFolders, cancelDelete, handleCopy}


}

export default useFileFolderManager