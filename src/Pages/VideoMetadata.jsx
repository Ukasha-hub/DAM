import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import cardData from '../Data/CardData';

function VideoMetadata() {
   


  const { id } = useParams();

  

  const Item = cardData.find(item => item.id == id);

  console.log('ID from URL:', id);
  console.log('Filtered Item:', Item);
  return (
    
        <div className='p-4 w-full flex flex-col lg:flex-row gap-20    justify-between  h-screen'>
                  <div className=' lg:basis-4/8'>
                    
                    
                    <iframe width="560" className='  size:100 w-full' height="315" src={Item.basicMetadata.filename} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                  <div className='flex flex-col gap-2 lg:basis-6/8 text-xs'>
                    
                      <h1 className='text-xl text-bold'>{Item.descriptiveMetadata.videoTitle}</h1>
                      <p className='text-sm '><span className='font-bold'>Author: </span>{Item.descriptiveMetadata.author}</p>
                      <p><span className='font-bold'>Copyright claimed?: </span>{Item.descriptiveMetadata.copyrightClaimed}</p>
                      <p><span className='font-bold'>Publishing Date: </span>{Item.descriptiveMetadata.uploadDate}</p>
                      <p>{Item.descriptiveMetadata.description}</p>

                      <hr />

                      <p><span className='font-bold'>Codec: </span> {Item.streamMetadata.codec}</p>
                      <p><span className='font-bold'>resolution: </span> {Item.streamMetadata.resolution} pixels</p>
                      <p><span className='font-bold'>Frame Rate: </span>  {Item.streamMetadata.frameRate} </p>
                      <p><span className='font-bold'>Aspect Ratio: </span>  {Item.streamMetadata.aspectRatio}</p>
                      <p><span className='font-bold'>Duration: </span> {Item.streamMetadata.duration} </p>
                      <p><span className='font-bold'>Size: </span> {Item.basicMetadata.filesize} </p>
                      <p><span className='font-bold'>Format: </span> {Item.basicMetadata.format} </p>
                  </div>
        </div>

    
  )
}

export default VideoMetadata