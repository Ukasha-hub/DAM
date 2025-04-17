import React, { useState } from 'react';

const CopyFileFolderModal = ({ isOpen, onClose, onCopy, folders, item }) => {
  const [selectedFolderId, setSelectedFolderId] = useState('');

  const handleCopy = () => {
    if (selectedFolderId) {
      onCopy(item, selectedFolderId); // Perform the copy logic
      onClose();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-xl w-96 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Copy {item?.folderORfile}</h2>

        <select
          className="w-full p-2 mb-4 border rounded"
          value={selectedFolderId}
          onChange={(e) => setSelectedFolderId(e.target.value)}
        >
          <option value="">Select destination folder</option>
          <option value={null}>Homepage</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.title}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-sm btn-primary"
            disabled={!selectedFolderId}
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