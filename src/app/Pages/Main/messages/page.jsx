'use client';

import ProtectedRoute from '@/app/Components/ProtectedRoute/ProtectedRoute'
import React from 'react'
import ChatPage from './socket/SocketConnect';


const page = () => {
  return (
    <ProtectedRoute>
    {/* <div className="min-h-screen ">
  <div className="max-w-6xl mx-auto p-6">
    <div className="space-y-6">
      
     <ChatPage />
    </div>
  </div>
</div> */}

<ChatPage />
    </ProtectedRoute>

  )
}

export default page
