'use client'

import React, { useState } from 'react'

import UserMessageFeed from '@/components/shared/userMessageFeed'
import UserMessageWindow from '@/components/shared/userMessageWindow'

export default function Messages() {
  const [selectedConversation, setSelectedConversation] =
    useState<any>(null)

  return (
    <div className="w-full h-[calc(100vh-100px)] px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold lg:text-2xl">
          Messages
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Manage your conversations
        </p>
      </div>

      <div className="w-full h-[calc(100%-70px)] border rounded-xl overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] h-full">
          {/* Conversation List */}
          <div className="border-r h-full overflow-hidden">
            <UserMessageFeed
              onSelectConversation={setSelectedConversation}
              selectedConversation={selectedConversation}
            />
          </div>

          {/* Chat Window */}
          <div className="h-full overflow-hidden">
            {selectedConversation ? (
              <UserMessageWindow
                conversation={selectedConversation}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                <div className="text-lg font-semibold">
                  Select a conversation
                </div>

                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                  Choose a conversation from the left side to view and send messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}