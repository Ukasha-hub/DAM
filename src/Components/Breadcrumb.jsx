import React from 'react'
import { Link } from 'react-router-dom';
import cardData from '../Data/CardData';

const Breadcrumb = ({location, pathnames}) => {
  return (
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
  )
}

export default Breadcrumb