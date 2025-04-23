import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useFileFolderManager from '../Hooks/useFileFolderManager';

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const {cards, setCards
  } = useFileFolderManager();

  // Update search results when the query changes.
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = cards.filter(item =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        (item.description && item.description.toLowerCase().includes(lowerCaseQuery))
      );
      setSearchResults(results);
    }
  }, [searchQuery]);

  // Close the search results when clicking outside of the search box.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // When a search result is clicked, clear the search and navigate.
  const handleSelectResult = (item) => {
    setSearchQuery("");
    setSearchResults([]);
    if (item.folderORfile === "file") {
      navigate(`/metadata/${item.id}`);
    } else if (item.folderORfile === "folder") {
      navigate(`/folderitem/${item.id}`);
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm flex justify-between">
        <div className="flex flex-row lg:gap-20">
          <div>
            <Link to="/" className="btn btn-ghost text-sm lg:text-xl">DAM</Link>
          </div>
          {/* Search input with dropdown */}
          <div className="relative flex gap-2 bg-gray-200 p-1 rounded-md" ref={searchRef}>
            <input
              type="text"
              placeholder="Quick Search"
              className="input input-bordered h-8 mt-1 w-20 md:w-40 lg:w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-xs text-xs lg:btn-sm m-1">
              Search
            </button>
            {searchResults.length > 0 && (
              <ul className="absolute top-full left-0 z-50 w-full border bg-white rounded-md shadow-lg mt-1">
                {searchResults.map(result => (
                  <li
                    key={result.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectResult(result)}
                  >
                    {result.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="btn btn-ghost text-xl">
            ☰
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="absolute z-1 top-16 right-0 bg-white shadow-md p-4 w-48 rounded-lg lg:hidden">
            <ul className="flex flex-col gap-3 text-xs">
              <li><a href="#">Show basket</a></li>
              <li><a href="#">Feedback</a></li>
              <li><a href="#">Deepto Admin</a></li>
            </ul>
          </div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex">
          <ul className="flex flex-row gap-7 justify-around text-xs">
            <li><a href="#">Show basket</a></li>
            <li><a href="#">Feedback</a></li>
            <li><a href="#">Deepto Admin</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
