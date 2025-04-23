import React from 'react'
import useFileFolderManager from '../Hooks/useFileFolderManager';
import Breadcrumb from './Breadcrumb';
import PaginationComponent from './PaginationComponent';

const TopbarInsideTabs = ({location, pathnames, currentPage ,totalPages, setCurrentPage,handleSort, sortBy ,sortOrder, handleItemsPerPageChange ,itemsPerPage, handleSelectAll}) => {
    const {cards, setCards
        } = useFileFolderManager();
  return (
    <div>
        {/*breadcrump */}
        <div className='flex flex-col lg:flex-row lg:justify-between'>

            <Breadcrumb location={location} pathnames={pathnames}></Breadcrumb>

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
                        <li><button className='btn btn-xs' onClick={()=>{handleSelectAll(cards)}}>Select all</button></li>
                        
                        
                        
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
    </div>
  )
}

export default TopbarInsideTabs