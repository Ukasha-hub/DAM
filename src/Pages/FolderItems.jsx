
import React, { useEffect, useState } from 'react'
import {  useParams } from 'react-router-dom';
import FolderCard from '../Components/FolderCard';
import MoveFileFolderModal from '../Components/MoveFileFolderModal';

import DeleteFileFolderModal from '../Components/DeleteFileFolderModal';

import useFileFolderManager from '../Hooks/useFileFolderManager';
import { Link, useLocation } from 'react-router-dom'
import cardData from '../Data/CardData';
import PaginationComponent from '../Components/PaginationComponent';
import Breadcrumb from '../Components/Breadcrumb';
import RenameFolderModal from '../Components/RenameFolderModal';
import TopbarInsideTabs from '../Components/TopbarInsideTabs';


const FolderItems = () => {


  const {createFolderInFolders,handleDrop ,itemToRename, setItemToRename, showRenameModal, setShowRenameModal, handleSelectAll, pasteClipboardItems, clipboard, setClipboard, handleItemsPerPageChangeinFiles , changePageinFiles ,paginatedTopLevelItemsinFiles,currentItemsinFiles,totalPagesinFiles,itemsPerPageinFiles, setItemsPerPageinFiles, currentPageinFiles, setCurrentPageinFiles,handleSortinFiles,sortOrderinFiles, setSortOrderinFiles, sortByinFiles, setSortByinFiles,sortedItemsinFiles,items, setItems, itemsPerPage,handleItemsPerPageChange ,handleSort,sortBy, sortOrder,currentPage, setCurrentPage, changePage,totalPages,currentItems,paginatedTopLevelItems, activeTab, setActiveTab, contextMenu, setContextMenu, showMoveModal, setShowMoveModal, showCopyModal, setShowCopyModal, 
    itemToCopy, setItemToCopy, itemToMove, setItemToMove, selectedItems, setSelectedItems, showDeleteModal, setShowDeleteModal, 
    itemToDelete, setItemToDelete, cards, setCards,  handleSelectItem, navigate, handleRightClick, handleOpenMetadata,
    handleOpenFileItems, folders,  confirmDelete, handleDelete, handleMoveInFolders, cancelDelete, handleCopy} = useFileFolderManager();

  const { id } = useParams();
  const [folder, setFolder] = useState(null);

  
  
  
    
  const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);
 
    const handleRenameFolders = (item, newName) => {
      const data = JSON.parse(localStorage.getItem("cards")) || [];
      const index = data.findIndex(i => i.id === item.id);
      if (index !== -1) {
        data[index].title = newName;
        localStorage.setItem("cards", JSON.stringify(data));
        setCards(data);
    
        // Optional: update items in current folder
        const parentFolderIndex = data.findIndex(i => i.id === parseInt(id));
        const updatedChildItems = data.filter(i =>
          data[parentFolderIndex]?.folderItems.includes(i.id)
        );
        setItems(updatedChildItems);
      }
    };

    



   

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



  if (items.length === 0) return( 
  
                <div className="p-4" onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    type: 'blank',
                    item: null,
                  });
                }}
              > 
                
                <div className=' h-20 '>
                          {/* name of each tab group should be unique */}
                          <div className="tabs tabs-lift">
                          <input type="radio" name="" className="tab" aria-label="Folder Content" checked={activeTab === "folder-content"} onChange={() => setActiveTab("folder-content")}/>
                          <div className='tab-content bg-base-100 border-base-300 p-4'>

                          <TopbarInsideTabs location={location} pathnames={pathnames} navigate={navigate} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} handleSort={handleSort} sortBy={sortBy} sortOrder={sortOrder} handleItemsPerPageChange={handleItemsPerPageChange } itemsPerPage={itemsPerPage} handleSelectAll={handleSelectAll}></TopbarInsideTabs>

              {/*buttons and paginations */}
              <div>

                <div className='flex justify-center pt-50'><div className='pb-30'>Folder is empty</div></div>
                {/* Context menu */}
                {contextMenu.visible && (
                                                  <ul
                                                    className="fixed bg-white border  flex flex-col  rounded shadow-lg text-sm z-50"
                                                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                                                  >
                                                    {contextMenu.type === 'blank' ? (
                                                      <>
                                                      <li
                                                        className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                                        onClick={()=>{createFolderInFolders(id)}}
                                                        
                                                      >
                                                        ➕ Create New Folder
                                                        <hr className='text-gray-300'/>
                                                      </li>
                                                      {clipboard && clipboard.length > 0 && (
                                                        <li
                                                          className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                                          onClick={() => pasteClipboardItems(id)}
                                                        >
                                                          Paste
                                                        </li>
                                                      )}

                                                      </>
                                                    ) : (
                                                      <></>
                                                    )}
                                                  </ul>
                                                )}


              </div>



                            </div>
                          <input type="radio" name="my_tabs_3" className="tab" aria-label="Videos"  checked={activeTab === "videos"} onChange={() => setActiveTab("videos")}/>
                          <div className="tab-content bg-base-100 border-base-300 p-4">Tab content 2</div>  
                
              </div>
              </div>
              </div>
  )

 

  return (
    <div>

       {/*tab */}
       <div className=' h-20 '>
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-lift">
            <input type="radio" name="" className="tab" aria-label="Folder Content" checked={activeTab === "folder-content"} onChange={() => setActiveTab("folder-content")}/>
            <div className='tab-content bg-base-100 border-base-300 p-4'>
              {/*breadcrump */}
              
                          <div className='flex flex-col lg:flex-row lg:justify-between'>
                            <div className="breadcrumbs text-xs lg:text-sm">
                            <Breadcrumb location={location} pathnames={pathnames}></Breadcrumb>
                            </div>

                            <div>
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
                                    <li><button className='btn btn-xs' onClick={()=>{handleSelectAll(items)}}>Select all</button></li>
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
                                <PaginationComponent currentPage={currentPageinFiles} totalPages={totalPagesinFiles} onPageChange={setCurrentPageinFiles} handleSort={handleSortinFiles} sortBy={sortByinFiles} sortOrder={sortOrder} handleItemsPerPageChange={handleItemsPerPageChangeinFiles } itemsPerPage={itemsPerPageinFiles}></PaginationComponent>
                            </div>
                            

                        </div>
                <div className=" p-10  grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
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
                      {currentItemsinFiles.map(item => (
                        <FolderCard key={item.id} item={item} onRightClick={handleRightClick} onSelect={handleSelectItem}
                        isSelected={selectedItems.some(i => i.id === item.id)}  onDrop={handleDrop}/>
                      ))}

                            {/* Context menu */}
                            {contextMenu.visible && (
                                    <ul
                                      className="fixed bg-white border  flex flex-col  rounded shadow-lg text-sm z-50"
                                      style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                                    >
                                      {contextMenu.type === 'blank' ? (
                                        <>
                                        <li
                                          className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                          onClick={()=>{createFolderInFolders(id)}}
                                          
                                        >
                                          ➕ Create New Folder
                                        </li>
                                        <hr className='text-gray-300'/>
                                        {clipboard && clipboard.length > 0 && (
                                            <li
                                              className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                              onClick={() => pasteClipboardItems(id)}
                                            >
                                              Paste
                                            </li>
                                          )}

                                        </>
                                      ) : (
                                        <>
                                          {contextMenu.type === 'folder' && (
                                            <li
                                              className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                              onClick={handleOpenFileItems}
                                            >
                                              Open Folder
                                              <hr className='text-gray-300'/>
                                            </li>
                                          )}
                                          {contextMenu.type === 'file' && (
                                            <li
                                              className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                              onClick={handleOpenMetadata}
                                            >
                                              Open Meta
                                              <hr className='text-gray-300'/>
                                            </li>
                                          )}
                                          <li
                                            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                            onClick={() => {
                                              const items = selectedItems.length ? selectedItems : [contextMenu.item];
                                              setItemToMove(items);
                                              setShowMoveModal(true);
                                            }}
                                          >
                                            Move {contextMenu.type === 'folder' ? 'Folder' : 'File'}
                                            <hr className='text-gray-300'/>
                                          </li>
                                         
                                          <li
                                            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                            onClick={() => {
                                              setItemToCopy(selectedItems.length ? selectedItems : [contextMenu.item]);
                                              setClipboard(selectedItems.length ? selectedItems : [contextMenu.item]);
                                              setContextMenu(prev => ({ ...prev, visible: false }));
                                            }}
                                          >
                                            Copy
                                            <hr className='text-gray-300'/>
                                          </li>
                                          <li
                                            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                            onClick={() => {
                                              const item = selectedItems.length ? selectedItems[0] : contextMenu.item;
                                              setItemToRename(item);
                                              setShowRenameModal(true);
                                              setContextMenu(prev => ({ ...prev, visible: false }));
                                            }}
                                          >
                                            Rename
                                            <hr className='text-gray-300'/>
                                          </li>

                                          <li
                                            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                            onClick={() => confirmDelete(selectedItems)}
                                          >
                                            Delete
                                          </li>
                                        </>
                                      )}
                                    </ul>
                                  )}

                            
                    </div>
            </div>
                <input type="radio" name="my_tabs_3" className="tab" aria-label="Videos"  checked={activeTab === "videos"} onChange={() => setActiveTab("videos")}/>
                <div className="tab-content bg-base-100 border-base-300 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-10">
                    {items
                      .filter(item => item.folderORfile === "file")
                      .map(item => (
                        <FolderCard
                          key={item.id}
                          item={item}
                          onRightClick={handleRightClick}
                          onSelect={handleSelectItem}
                          isSelected={selectedItems.some(i => i.id === item.id)}
                        />
                      ))}
                  </div>
                </div>

            </div>   

          

            <MoveFileFolderModal
                        isOpen={showMoveModal}
                        onClose={() => setShowMoveModal(false)}
                        onMove={handleMoveInFolders}
                        folders={folders}
                        item={itemToMove}></MoveFileFolderModal>

            

            <DeleteFileFolderModal
              show={showDeleteModal}
              item={itemToDelete?.length === 1 ? itemToDelete[0] : { title: `${itemToDelete?.length} items` }}
              onDelete={handleDelete}
              onCancel={cancelDelete}
            /> 
            <RenameFolderModal
            isOpen={showRenameModal}
            item={itemToRename}
            onClose={() => setShowRenameModal(false)}
            onRename={handleRenameFolders} // pass current item and folder ID
          />


      </div>
    </div>  

     
  )
}

export default FolderItems
