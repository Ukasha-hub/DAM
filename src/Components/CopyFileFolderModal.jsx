import React, { useState } from 'react';

const CopyFileFolderModal = ({ isOpen, onClose, onCopy, folders, item }) => {
  const [selectedFolderId, setSelectedFolderId] = useState([]);

  const handleCopy = () => {
    const itemsToCopy = Array.isArray(item) ? item : [item];

    selectedFolderId.forEach(folderId => {
      onCopy(itemsToCopy, folderId);  // ✅ Pass whole array at once
    });
  
    onClose();
    window.location.reload();

  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 flex justify-center  items-center z-50">
      <div className="bg-white p-5 rounded-xl h-[60%] w-96 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Select folder to Copy...</h2>

        <select
          multiple
          className="w-full p-2 h-[65%] mb-4 border rounded"
          value={selectedFolderId}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedFolderId(options);
          }}
        >
          
          <option value={null}>🏠 Homepage</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>📂{folder.title}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-sm btn-primary"
            disabled={selectedFolderId.length === 0}
            onClick={handleCopy}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyFileFolderModal;