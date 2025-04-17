import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../Data/api';
import UploadFileModal from '../Components/UploadSuccessErrorModal';

const AddFilePage = () => {
  const [activeTab, setActiveTab] = useState("add-asset");  
  const [files, setFiles] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFiles([...files, ...Array.from(event.target.files)]); // Append new files
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index)); // Remove file by index
  };


  const handleUpload = async () => {
    setUploading(true);
    setUploadSuccess(false);
    setUploadError(false);
    setErrorMessage('');

    try {
      for (let file of files) {
        // Check if the file is a video
        if (!file.type.startsWith('video/')) {
          setUploading(false);
          setUploadError(true);
          setErrorMessage('Only video files can be uploaded.');
          return; // Exit the function if the file is not a video
        }
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/videos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Upload successful', response.data);
      }
      setUploading(false);
      setUploadSuccess(true);
    } catch (error) {
      setUploading(false);
      setUploadError(true);
      setErrorMessage(error.message || 'Error uploading file');
      console.error("Error uploading file", error);
    }
  };

   // Calculate total size
   const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  
  return (
    <div>
       
        
        <div className="bg-white p-5 rounded-lg h-screen w-full overflow-y-auto">
          {/*Heading */}
            <div className='flex font-bold text-lg flex-row justify-between'>
                <h1>Add File(s)</h1>
                <button onClick={() => navigate(-1)}  className="btn btn-md    right-2 top-2">Close ✖</button>
            </div>
            
           {/*tabs */}
           {/* name of each tab group should be unique */}
            <div className="tabs tabs-lift ">
              
                
                <input type="radio" name="" className="tab" aria-label="Add asset"  checked={activeTab === "add-asset"} onChange={() => setActiveTab("add-asset")}/>
                <div className="tab-content border-2 bg-base-100 border-base-300 p-6 ">
                  <h1 className='text-lg font-bold'>Select files</h1>
                  <fieldset className="w-full space-y-2 p-4 border rounded-md bg-gray-100">
                    <label htmlFor="files" className="block text-sm font-medium flex items-center  justify-between">
                      <span className=''>Filename</span>
                      <span>Size</span>
                      <span>Status</span>
                      <button></button>
                    </label>

                    {/* File Input */}
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        id="fileInput"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      
                      
                      
                      {/* Display Selected Files */}
                      <div className="mt-2 space-y-1">
                        {files.length === 0 ? (
                          <p className="text-sm text-gray-500">No files selected.</p>
                        ) : (
                          files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 border rounded-md bg-white">
                              <span className="text-sm w-10 lg:w-20 truncate block"><span>{file.name}</span></span>
                              
                              <span>({(file.size / 1024).toFixed(2)} KB)</span>
                              <span>{uploading ? 'Uploading...' : uploadSuccess ? 'Success' : uploadError ? 'Error' : 'Idle'}</span>
                              
                              <button
                                onClick={() => removeFile(index)}
                                className="btn btn-xs btn-circle font-bold bg-red-700 text-white">
                                x
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </fieldset>
                  <div className='flex flex-col lg:flex-row justify-between'>

                    <div className='flex gap-2'>
                        <button
                              onClick={() => document.getElementById("fileInput").click()}
                              className="btn mt-2 btn-sm " 
                            >
                              Add Files
                        </button>
                        <button className="btn mt-2 btn-sm " onClick={handleUpload} disabled={files.length === 0 || uploading}>Start Upload</button>
                    </div>

                    <div className='flex flex-row gap-2'>
                      <div className="mt-4">
                        Total Size: {(totalSize / 1024).toFixed(2)} KB,
                      </div>
                      <div className="mt-4 font-semibold">Status: {uploading ? 'Uploading...' : uploadSuccess ? 'Success' : uploadError ? 'Error' : 'Idle'}</div>
                     
                    </div>

                  </div>
                  
                  <div className='flex flex-row mt-4'>
                    <input type="checkbox" defaultChecked className="checkbox" />
                    <h3>Extract zip-archive and save folder structures.</h3>
                  </div>

                  <div className='mt-10 flex justify-center'>
                    <button className='btn btn-md'>Restart Uploading</button>
                  </div>
                  
                   {/* Upload Modal for loading, success, or error */}
                   <UploadFileModal uploading={uploading} success={uploadSuccess} error={uploadError} errorMessage={errorMessage}></UploadFileModal>

                </div>

                <input type="radio" name="tab-2" className="tab" aria-label="Add from server" checked={activeTab === "add-from-server"} onChange={() => setActiveTab("add-from-server")}/>
                <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                <input type="radio" name="tab-3" className="tab" aria-label="Add from email" checked={activeTab === "add-from-email"} onChange={() => setActiveTab("add-from-email")}/>
                <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                <input type="radio" name="tab-4" className="tab" aria-label="Add with FTP" checked={activeTab === "add-with-FTP"} onChange={() => setActiveTab("add-with-FTP")}/>
                <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                <input type="radio" name="tab-5" className="tab" aria-label="Link to content" checked={activeTab === "link-to-content"} onChange={() => setActiveTab("link-to-content")}/>
                <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
            </div>
        </div>
      
    </div>
  )
}

export default AddFilePage