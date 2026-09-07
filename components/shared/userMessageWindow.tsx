// React Imports
import React, { useState } from 'react'

// Next Imports
import Image from 'next/image'
import { useApp } from '@/context/appContext'

export default function UserMessageWindow() {
  const { messageFeed, activeMessage } = useApp()

  const message = messageFeed ? messageFeed.filter(message => message.id === activeMessage) : []
  return (
    <>
      <section className="w-full flex flex-col">
        <div className="w-full flex justify-between">
          <div className="w-fit flex items-center gap-2">
            <Image src={message[0]?.image} alt="User Profile Image" className="w-14 h-14" />
            <div className="flex flex-col">
              <div className="flex gap-2">
                <h3 className="text-sm font-semibold text-text-900">{message[0]?.userName}</h3>
                <span className="w-fit h-fit flex items-center border border-text-300 rounded-sm px-1.5 py-0.5 gap-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full p-0.5 ${message[0].userStatus ? 'bg-green-500' : 'bg-white border border-text-300'}`}
                  ></div>
                  <span className="text-xs font-medium text-text-700">
                    {message[0].userStatus ? 'Online' : 'Offline'}
                  </span>
                </span>
              </div>
              <span className="text-sm font-normal text-text-600">{message[0]?.userHashTag}</span>
            </div>
          </div>
          <span className="dashboard-feed-item-time whitespace-nowrap">{message[0]?.time}</span>
        </div>
      </section>
      <section></section>
      <section></section>
    </>
  )
}
