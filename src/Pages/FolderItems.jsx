import React, { useEffect, useState } from 'react'
import {  useParams } from 'react-router-dom';
import FolderCard from '../Components/FolderCard';
import MoveFileFolderModal from '../Components/MoveFileFolderModal';
import CopyFileFolderModal from '../Components/CopyFileFolderModal';
import DeleteFileFolderModal from '../Components/DeleteFileFolderModal';

import FileFolderManager from '../Hooks/FileFolderManager';

const FolderItems = () => {


  const {activeTab, setActiveTab, contextMenu, setContextMenu, showMoveModal, setShowMoveModal, showCopyModal, setShowCopyModal, 
    itemToCopy, setItemToCopy, itemToMove, setItemToMove, selectedItems, setSelectedItems, showDeleteModal, setShowDeleteModal, 
    itemToDelete, setItemToDelete, cards, setCards,  handleSelectItem, navigate, handleRightClick, handleOpenMetadata,
    handleOpenFileItems, folders,  confirmDelete, handleDelete, handleMoveInFolders, cancelDelete, handleCopy} = FileFolderManager();

  const { id } = useParams();
  const [folder, setFolder] = useState(null);
  const [items, setItems] = useState([]);
    

 

   

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

 

 

  

 
  

  return (
    <div>

       {/*tab */}
       <div className=' h-20 '>
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-lift">
            <input type="radio" name="" className="tab" aria-label="Folder Content" checked={activeTab === "folder-content"} onChange={() => setActiveTab("folder-content")}/>
            <div className='tab-content bg-base-100 border-base-300 p-4'>
                <div className=" p-6  grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
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
                            
                    </div>
            </div>
            <input type="radio" name="my_tabs_3" className="tab" aria-label="Videos"  checked={activeTab === "videos"} onChange={() => setActiveTab("videos")}/>
            <div className="tab-content bg-base-100 border-base-300 p-4">Tab content 2</div>

            </div>   

            <MoveFileFolderModal
                        isOpen={showMoveModal}
                        onClose={() => setShowMoveModal(false)}
                        onMove={handleMoveInFolders}
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
    </div>  

     
  )
}

export default FolderItems