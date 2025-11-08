'use client'
import CreatePost from '@/app/Components/CreatePost/CreatePost'
import ProtectedRoute from '@/app/Components/ProtectedRoute/ProtectedRoute'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute>
     
     
          <CreatePost />
      
        
    </ProtectedRoute>
  )
}

export default page