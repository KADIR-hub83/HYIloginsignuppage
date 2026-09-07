// React Imports
import React from 'react'

// Next Imports
import Image, { StaticImageData } from 'next/image'

// type declaration
interface UserActivityFeedProps {
  title: string
  feed: {
    image: StaticImageData | string
    title: string
    message: string
    time: string
  }[]
}

export default function UserActivityFeed({ title, feed }: UserActivityFeedProps) {
  return (
    <div className="dashboard-feed">
      <h3 className="dashboard-feed-title">{title}</h3>
      <div className="dashboard-feed-items">
        {feed.map((item, index) => {
          return (
            <div key={index} className="dashboard-feed-item">
              <Image src={item.image} alt="Company Logo" className="dashboard-feed-item-icon" />
              <div className="dashboard-feed-item-content">
                <h4 className="dashboard-feed-item-title">{item.title}</h4>
                <p className="dashboard-feed-item-message">{item.message}</p>
                <span className="dashboard-feed-item-time">{item.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
