import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const FolderCard = ({item, onRightClick}) => {

  

  

  return (
    <div>
        <div  onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(e, item);
        }}
        className="max-w-xs rounded-md shadow-md border relative"
        >
        <Link to={item.folderORfile === 'file' ? `/metadata/${item.id}` : `/folderitem/${item.id}`}>
              <img src={item.image} alt="" className="object-cover object-center w-full rounded-t-md h-30" />
        </Link>
            <div className="flex flex-col justify-between p-6 space-y-8">
                <div className="space-y-2">
                    <h2 className="text-sm font-semibold tracking-wide"></h2>
                    <Link to={item.folderORfile === 'file' ? `/metadata/${item.id}` : `/folderitem/${item.id}`}>
                      <p className="text-sm dark:text-gray-800">{item.title}</p>
                    </Link>
                    
                    
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default FolderCard