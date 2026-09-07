// // React Imports
// import React, { useState } from 'react'

// // Next Imports
// import Image, { StaticImageData } from 'next/image'

// // shadcn Imports
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from '@/components/ui/sidebar'
// import { Search, Settings } from 'lucide-react'
// import { Input } from '../ui/input'
// import { useApp } from '@/context/appContext'

// // type declaration
// interface UserMessageFeedProps {
//   feed: {
//     id: number
//     messageRead: boolean
//     image: StaticImageData | string
//     userStatus: boolean
//     userName: string
//     userHashTag: string
//     time: string
//     message: string
//      onSelectConversation?: (conversation: any) => void
//   selectedConversation?: any
//   }[]
// }

// export default function UserMessageFeed({ feed }: UserMessageFeedProps) {
//   const { updateMessageContent } = useApp()
//   const [messageCount, setMessageCount] = useState<number>(8)

//   function handleClick(value: number) {
//     updateMessageContent(value)
//   }
//   return (
//     <div className="w-2/5 flex flex-col">
//       <Sidebar variant="sidebar" className="w-1/5 h-full">
//         <SidebarContent>
//           <SidebarGroup className="px-0">
//             <SidebarGroupContent className="sidebarGroupLabel">
//               <div className="w-full flex flex-col">
//                 <div className="w-full flex justify-between px-6 py-5">
//                   <div className="w-fit flex items-center gap-2">
//                     <h1 className="text-xl font-medium text-text-900 lg:text-lg">Messages</h1>
//                     <div className="w-fit h-fit border border-text-300 rounded-md px-2.5 py-0.5">
//                       <span className="text-xs font-medium text-text-700">{messageCount}</span>
//                     </div>
//                   </div>
//                   <button type="button" className="w-fit h-fit text-text-700 rounded-full p-1.5">
//                     <Settings strokeWidth={1.75} width={20} height={20} />
//                   </button>
//                 </div>
//                 <div className="w-full flex items-center justify-center px-4 py-3">
//                   <div className="relative w-full">
//                     <Input placeholder={'Search'} className="pl-10" />
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
//                   </div>
//                 </div>
//               </div>
//             </SidebarGroupContent>
//             <SidebarGroupContent>
//               <SidebarMenu className="gap-0">
//                 {feed.map((item, index) => (
//                   <SidebarMenuItem key={item.id}>
//                     <SidebarMenuButton
//                       className={`w-full h-fit text-start flex flex-col rounded-none pr-4 pl-3 py-4 gap-4 ${index !== feed.length - 1 && 'border-b border-text-200'}`}
//                       onClick={() => handleClick(item.id)}
//                     >
//                       <div className="w-full flex justify-between">
//                         <div className="w-fit flex items-center gap-2">
//                           <div
//                             className={`w-2 h-2 rounded-full bg-brand-500 mr-1 ${item.messageRead ? 'opacity-0' : 'opacity-100'}`}
//                           ></div>
//                           <Image src={item.image} alt="User Profile Image" className="w-10 h-10" />
//                           <div className="flex flex-col">
//                             <h3 className="text-sm font-semibold text-text-900">{item.userName}</h3>
//                             <span className="text-sm font-normal text-text-600">
//                               {item.userHashTag}
//                             </span>
//                           </div>
//                         </div>
//                         <span className="dashboard-feed-item-time whitespace-nowrap">
//                           {item.time}
//                         </span>
//                       </div>
//                       <div className="w-full px-5">
//                         <p className="dashboard-feed-item-message">{item.message}</p>
//                       </div>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//         <SidebarFooter />
//       </Sidebar>
//     </div>
//   )
// }












// React Imports
import React, { useState } from 'react'

// Next Imports
import Image, { StaticImageData } from 'next/image'

// shadcn Imports
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { Search, Settings } from 'lucide-react'
import { Input } from '../ui/input'
import { useApp } from '@/context/appContext'

// --------------------------------------------------
// Types
// --------------------------------------------------

export interface MessageFeedItem {
  id: number
  messageRead: boolean
  image: StaticImageData | string
  userStatus: boolean
  userName: string
  userHashTag: string
  time: string
  message: string
}

interface UserMessageFeedProps {
  feed?: MessageFeedItem[]
  onSelectConversation?: (conversation: MessageFeedItem) => void
  selectedConversation?: MessageFeedItem | null
}

// --------------------------------------------------
// Component
// --------------------------------------------------

export default function UserMessageFeed({
  feed = [],
  onSelectConversation,
  selectedConversation,
}: UserMessageFeedProps) {
  const { updateMessageContent } = useApp()

  const [messageCount] = useState<number>(8)

  // --------------------------------------------------
  // Conversation Click
  // --------------------------------------------------

  const handleClick = (item: MessageFeedItem) => {
    // Preserve existing application logic
    updateMessageContent(item.id)

    // Notify parent component about selected conversation
    onSelectConversation?.(item)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <Sidebar
        variant="sidebar"
        className="h-full w-full"
      >
        <SidebarContent>
          <SidebarGroup className="px-0">

            {/* Header */}
            <SidebarGroupContent className="sidebarGroupLabel">
              <div className="flex w-full flex-col">

                <div className="flex w-full justify-between px-6 py-5">
                  <div className="flex w-fit items-center gap-2">
                    <h1 className="text-xl font-medium text-text-900 lg:text-lg">
                      Messages
                    </h1>

                    <div className="h-fit w-fit rounded-md border border-text-300 px-2.5 py-0.5">
                      <span className="text-xs font-medium text-text-700">
                        {messageCount}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="h-fit w-fit rounded-full p-1.5 text-text-700"
                    aria-label="Message settings"
                  >
                    <Settings
                      strokeWidth={1.75}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>

                {/* Search */}
                <div className="flex w-full items-center justify-center px-4 py-3">
                  <div className="relative w-full">
                    <Input
                      placeholder="Search"
                      className="pl-10"
                    />

                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      width={18}
                      height={18}
                    />
                  </div>
                </div>
              </div>
            </SidebarGroupContent>

            {/* Conversation List */}
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                {feed.map((item, index) => {
                  const isSelected =
                    selectedConversation?.id === item.id

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        type="button"
                        className={`
                          flex h-fit w-full flex-col gap-4
                          rounded-none px-3 py-4 pr-4 text-start
                          ${
                            index !== feed.length - 1
                              ? 'border-b border-text-200'
                              : ''
                          }
                          ${
                            isSelected
                              ? 'bg-muted'
                              : ''
                          }
                        `}
                        onClick={() => handleClick(item)}
                      >
                        <div className="flex w-full justify-between">
                          <div className="flex w-fit items-center gap-2">

                            {/* Unread Indicator */}
                            <div
                              className={`
                                mr-1 h-2 w-2 rounded-full
                                bg-brand-500
                                ${
                                  item.messageRead
                                    ? 'opacity-0'
                                    : 'opacity-100'
                                }
                              `}
                            />

                            {/* User Image */}
                            <Image
                              src={item.image}
                              alt={`${item.userName} profile`}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />

                            {/* User Details */}
                            <div className="flex flex-col">
                              <h3 className="text-sm font-semibold text-text-900">
                                {item.userName}
                              </h3>

                              <span className="text-sm font-normal text-text-600">
                                {item.userHashTag}
                              </span>
                            </div>
                          </div>

                          {/* Time */}
                          <span className="dashboard-feed-item-time whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>

                        {/* Last Message */}
                        <div className="w-full px-5">
                          <p className="dashboard-feed-item-message">
                            {item.message}
                          </p>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>

          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter />
      </Sidebar>
    </div>
  )
}