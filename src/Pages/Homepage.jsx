

import FolderCard from '../Components/FolderCard'


import MoveFileFolderModal from '../Components/MoveFileFolderModal'

import DeleteFileFolderModal from '../Components/DeleteFileFolderModal'
import useFileFolderManager from '../Hooks/useFileFolderManager'
import { Link, useLocation } from 'react-router-dom'
import cardData from '../Data/CardData'
import PaginationComponent from '../Components/PaginationComponent'
import Breadcrumb from '../Components/Breadcrumb'
import RenameFolderModal from '../Components/RenameFolderModal'
import { useState } from 'react'
import TopbarInsideTabs from '../Components/TopbarInsideTabs'


const Homepage = () => {

  const {createFolderInHomepage, handleDrop,handleRenameHomePage,itemToRename, setItemToRename, showRenameModal, setShowRenameModal, handleSelectAll, pasteClipboardItems, clipboard, setClipboard, itemsPerPage,handleItemsPerPageChange ,handleSort,sortBy, sortOrder,currentPage, setCurrentPage, totalPages,currentItems, activeTab, setActiveTab, contextMenu, setContextMenu, showMoveModal, setShowMoveModal, showCopyModal, setShowCopyModal, 
    itemToCopy, setItemToCopy, itemToMove, setItemToMove, selectedItems, setSelectedItems, showDeleteModal, setShowDeleteModal, 
    itemToDelete, setItemToDelete, cards, setCards,  topLevelItems, handleSelectItem, navigate, handleRightClick, handleOpenMetadata,
    handleOpenFileItems, folders,  confirmDelete, handleDelete, handleMove, cancelDelete, handleCopy} = useFileFolderManager();

 
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

   

    



      

  
  return (
    <div className='p-3  w-full'>
        {/*tab */}
        <div className=' h-20 '>
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-lift">
            <input type="radio" name="" className="tab" aria-label="Folder Content" checked={activeTab === "folder-content"} onChange={() => setActiveTab("folder-content")}/>
            <div className="tab-content bg-base-100 border-base-300 p-6">
            <TopbarInsideTabs location={location} pathnames={pathnames} navigate={navigate} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} handleSort={handleSort} sortBy={sortBy} sortOrder={sortOrder} handleItemsPerPageChange={handleItemsPerPageChange } itemsPerPage={itemsPerPage} handleSelectAll={handleSelectAll}></TopbarInsideTabs>
                        
                        {/*cards of folders */}
                       <div
                            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-10 "
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
                            
                                {currentItems.map((item) => (
                                <FolderCard key={item.id} item={item} onRightClick={handleRightClick} onSelect={handleSelectItem}
                                isSelected={selectedItems.some(i => i.id === item.id)}  onDrop={handleDrop} />
                                ))}
                           

                              {/* Context menu */}
                              {contextMenu.visible && (
                                    <ul
                                      className="fixed bg-white border p-1 flex flex-col  rounded shadow-lg text-sm z-50"
                                      style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                                    >
                                      {contextMenu.type === 'blank' ? (
                                        <>
                                        <li
                                          className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                          onClick={createFolderInHomepage}
                                          
                                        >
                                          ➕ Create New Folder
                                        </li>
                                        <hr className='text-gray-300'/>
                                        {clipboard && clipboard.length > 0 && (
                                        <li
                                          className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                          onClick={() => pasteClipboardItems(null)}
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
                                          </li>
                                          <hr className='text-gray-300'/>
                                         
                                          <li
                                            className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                            onClick={() => {
                                              setItemToCopy(selectedItems.length ? selectedItems : [contextMenu.item]);
                                              setClipboard(selectedItems.length ? selectedItems : [contextMenu.item]);
                                              setContextMenu(prev => ({ ...prev, visible: false }));
                                            }}
                                          >
                                            Copy
                                          </li>
                                          <hr className='text-gray-300'/>
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
                                            </li>
                                            <hr className='text-gray-300'/>
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
            <div className="tab-content bg-base-100 border-base-300 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-10">
                    {topLevelItems
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
            onMove={handleMove}
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
              onRename={handleRenameHomePage}
            />
        </div>
        


    </div>

    
  )
}

export default Homepage;  