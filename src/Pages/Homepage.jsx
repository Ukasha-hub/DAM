

import FolderCard from '../Components/FolderCard'


import MoveFileFolderModal from '../Components/MoveFileFolderModal'
import CopyFileFolderModal from '../Components/CopyFileFolderModal'
import DeleteFileFolderModal from '../Components/DeleteFileFolderModal'
import FileFolderManager from '../Hooks/FileFolderManager'
import { Link, useLocation } from 'react-router-dom'
import cardData from '../Data/CardData'
import PaginationComponent from '../Components/PaginationComponent'


const Homepage = () => {

  const {itemsPerPage,handleItemsPerPageChange ,handleSort,sortBy, sortOrder,currentPage, setCurrentPage, totalPages,currentItems, activeTab, setActiveTab, contextMenu, setContextMenu, showMoveModal, setShowMoveModal, showCopyModal, setShowCopyModal, 
    itemToCopy, setItemToCopy, itemToMove, setItemToMove, selectedItems, setSelectedItems, showDeleteModal, setShowDeleteModal, 
    itemToDelete, setItemToDelete, cards, setCards,  topLevelItems, handleSelectItem, navigate, handleRightClick, handleOpenMetadata,
    handleOpenFileItems, folders,  confirmDelete, handleDelete, handleMove, cancelDelete, handleCopy} = FileFolderManager();

 
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const handleSelectAll = (items) => {
      if (Array.isArray(items)) {
        setSelectedItems((prevSelected) => {
          if (prevSelected.length === items.length) {
            return []; // Deselect all if all are already selected
          } else {
            return items.map(item => item); // Select all
          }
        });
      } else {
        console.error("Items is not an array", items);
      }
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
                        <div className='flex flex-col lg:flex-row lg:justify-between'>

                        <div className="breadcrumbs text-xs lg:text-sm">
                              <ul className="flex gap-2">
                                <li><Link to="/">🏠 Home</Link></li>
                                {pathnames.map((title, index) => {
                                  const routeTo = '/' + pathnames.slice(0,1).join('/');
                                  const isLast = index === pathnames.length - 1;
                                
                                  // Convert title to number for correct match
                                  const matched = cardData.find((item) => item.id === Number(title));
                                  const displayName = matched?.title || title;
                                  return (
                                    <li key={index}>
                                      {isLast ? (
                                        <span className="text-gray-500">{displayName}</span>
                                      ) : (
                                        <Link to={routeTo}>{displayName}</Link>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
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
                                    
                                    <li><button onClick={() => navigate("/add-files")} className="btn btn-xs bg-green-300 p-1 rounded-sm">Add Files</button></li>
                                    <li><button className='btn btn-xs' onClick={()=>{handleSelectAll(cardData)}}>Select all</button></li>
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
                                <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} handleSort={handleSort} sortBy={sortBy} sortOrder={sortOrder} handleItemsPerPageChange={handleItemsPerPageChange } itemsPerPage={itemsPerPage}></PaginationComponent>
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
                                {currentItems.map((item) => (
                                <FolderCard key={item.id} item={item} onRightClick={handleRightClick} onSelect={handleSelectItem}
                                isSelected={selectedItems.some(i => i.id === item.id)} />
                                ))}
                            </div>

                            {/* Context menu */}
                            {contextMenu.visible && (
                                <ul
                                  className="fixed bg-white border p-3 flex flex-col gap-2 rounded shadow-lg text-sm z-50"
                                  style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                                >
                                  {contextMenu.type === 'folder' && (
                                    <li 
                                      className=" hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                      onClick={handleOpenFileItems}
                                    >
                                      Open Folder
                                    </li>
                                  )}
                                  {contextMenu.type === 'file' && (
                                    <li 
                                      className=" hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                      onClick={handleOpenMetadata}
                                    >
                                      Open Meta
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

                                  <li
                                    className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                    onClick={() => {
                                      setItemToCopy(selectedItems.length ? selectedItems : [contextMenu.item]);
                                      setShowCopyModal(true);
                                    }}
                                  >
                                    Copy
                                  </li>

                                  <li 
                                    className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer"
                                    onClick={() => confirmDelete(selectedItems)}
                                  >
                                    Delete
                                  </li>
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

export default Homepage;  