import React, { useState } from 'react'


const PaginationComponent = ({ currentPage, totalPages, onPageChange, handleSort, sortBy, sortOrder ,handleItemsPerPageChange, itemsPerPage }) => {

  return (
    <div>
      <ul className="flex flex-row gap-3">
      <div>
      <ul className="flex flex-row gap-3">
      <div className="join">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn btn-xs"
                >
                    «
                </button>

                {/* Current Page Number */}
                <button className="join-item btn btn-xs btn-active" >
                    {currentPage}
                </button>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="join-item btn btn-xs"
                >
                    »
                </button>
                </div>

      </ul>
    </div>

        <div className="flex flex-row gap-1">
          <h6>Sort by:</h6>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="text-xs lg:text-sm border-1 rounded-sm lg:btn-sm w-15 lg:w-25 flex justify-between"
            >
              <span>Name</span> <span>▼</span>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                <li><a onClick={() => handleSort("name")}>Name {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</a></li>
                {/* Add more sort options here */}
            </ul>
          </div>

          <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="text-xs lg:text-sm border-1 rounded-sm lg:btn-sm w-15 lg:w-25 flex justify-between"
            >
                <span>{itemsPerPage}</span> <span>▼</span>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
                {[5, 10, 15].map((count) => (
                <li key={count}>
                    <a onClick={() => handleItemsPerPageChange(count)}>{count} per page</a>
                </li>
                ))}
            </ul>
            </div>
        </div>
      </ul>

      {/* Display the files/folders for the current page */}
      
    </div>
  )
}

export default PaginationComponent