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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Search, Settings } from 'lucide-react'
import { Input } from '../ui/input'
import { useApp } from '@/context/appContext'

// type declaration
interface UserMessageFeedProps {
  feed: {
    id: number
    messageRead: boolean
    image: StaticImageData | string
    userStatus: boolean
    userName: string
    userHashTag: string
    time: string
    message: string
  }[]
}

export default function UserMessageFeed({ feed }: UserMessageFeedProps) {
  const { updateMessageContent } = useApp()
  const [messageCount, setMessageCount] = useState<number>(8)

  function handleClick(value: number) {
    updateMessageContent(value)
  }
  return (
    <div className="w-2/5 flex flex-col">
      <Sidebar variant="sidebar" className="w-1/5 h-full">
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent className="sidebarGroupLabel">
              <div className="w-full flex flex-col">
                <div className="w-full flex justify-between px-6 py-5">
                  <div className="w-fit flex items-center gap-2">
                    <h1 className="text-xl font-medium text-text-900 lg:text-lg">Messages</h1>
                    <div className="w-fit h-fit border border-text-300 rounded-md px-2.5 py-0.5">
                      <span className="text-xs font-medium text-text-700">{messageCount}</span>
                    </div>
                  </div>
                  <button type="button" className="w-fit h-fit text-text-700 rounded-full p-1.5">
                    <Settings strokeWidth={1.75} width={20} height={20} />
                  </button>
                </div>
                <div className="w-full flex items-center justify-center px-4 py-3">
                  <div className="relative w-full">
                    <Input placeholder={'Search'} className="pl-10" />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0">
                {feed.map((item, index) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      className={`w-full h-fit text-start flex flex-col rounded-none pr-4 pl-3 py-4 gap-4 ${index !== feed.length - 1 && 'border-b border-text-200'}`}
                      onClick={() => handleClick(item.id)}
                    >
                      <div className="w-full flex justify-between">
                        <div className="w-fit flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full bg-brand-500 mr-1 ${item.messageRead ? 'opacity-0' : 'opacity-100'}`}
                          ></div>
                          <Image src={item.image} alt="User Profile Image" className="w-10 h-10" />
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold text-text-900">{item.userName}</h3>
                            <span className="text-sm font-normal text-text-600">
                              {item.userHashTag}
                            </span>
                          </div>
                        </div>
                        <span className="dashboard-feed-item-time whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                      <div className="w-full px-5">
                        <p className="dashboard-feed-item-message">{item.message}</p>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </div>
  )
}
