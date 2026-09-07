// // React Imports
// import React, { useState } from 'react'

// // Next Imports
// import Image from 'next/image'
// import { useApp } from '@/context/appContext'

// export default function UserMessageWindow() {
//   const { messageFeed, activeMessage } = useApp()

//   const message = messageFeed ? messageFeed.filter(message => message.id === activeMessage) : []
//   return (
//     <>
//       <section className="w-full flex flex-col">
//         <div className="w-full flex justify-between">
//           <div className="w-fit flex items-center gap-2">
//             <Image src={message[0]?.image} alt="User Profile Image" className="w-14 h-14" />
//             <div className="flex flex-col">
//               <div className="flex gap-2">
//                 <h3 className="text-sm font-semibold text-text-900">{message[0]?.userName}</h3>
//                 <span className="w-fit h-fit flex items-center border border-text-300 rounded-sm px-1.5 py-0.5 gap-1">
//                   <div
//                     className={`w-1.5 h-1.5 rounded-full p-0.5 ${message[0].userStatus ? 'bg-green-500' : 'bg-white border border-text-300'}`}
//                   ></div>
//                   <span className="text-xs font-medium text-text-700">
//                     {message[0].userStatus ? 'Online' : 'Offline'}
//                   </span>
//                 </span>
//               </div>
//               <span className="text-sm font-normal text-text-600">{message[0]?.userHashTag}</span>
//             </div>
//           </div>
//           <span className="dashboard-feed-item-time whitespace-nowrap">{message[0]?.time}</span>
//         </div>
//       </section>
//       <section></section>
//       <section></section>
//     </>
//   )
// }





// React Imports
import React from 'react'

// Next Imports
import Image from 'next/image'

// Context
import { useApp } from '@/context/appContext'

interface UserMessageWindowProps {
  conversation?: {
    id?: number
    image?: any
    userStatus?: boolean
    userName?: string
    userHashTag?: string
    time?: string
    message?: string
  } | null
}

export default function UserMessageWindow({
  conversation,
}: UserMessageWindowProps) {
  const { messageFeed, activeMessage } = useApp()

  const contextMessage =
    messageFeed?.find(
      message => message.id === activeMessage,
    ) ?? null

  /*
   * Keep existing context-based behaviour first.
   * If context data is unavailable, use the
   * conversation passed from the parent.
   */
  const message =
    contextMessage ?? conversation ?? null

  return (
    <>
      <section className="flex w-full flex-col">
        {message ? (
          <div className="flex w-full justify-between">
            <div className="flex w-fit items-center gap-2">
              {message.image && (
                <Image
                  src={message.image}
                  alt="User Profile Image"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              )}

              <div className="flex flex-col">
                <div className="flex gap-2">
                  <h3 className="text-sm font-semibold text-text-900">
                    {message.userName}
                  </h3>

                  <span className="flex h-fit w-fit items-center gap-1 rounded-sm border border-text-300 px-1.5 py-0.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full p-0.5 ${
                        message.userStatus
                          ? 'bg-green-500'
                          : 'border border-text-300 bg-white'
                      }`}
                    />

                    <span className="text-xs font-medium text-text-700">
                      {message.userStatus
                        ? 'Online'
                        : 'Offline'}
                    </span>
                  </span>
                </div>

                <span className="text-sm font-normal text-text-600">
                  {message.userHashTag}
                </span>
              </div>
            </div>

            <span className="dashboard-feed-item-time whitespace-nowrap">
              {message.time}
            </span>
          </div>
        ) : null}
      </section>

      <section />
      <section />
    </>
  )
}