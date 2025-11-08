import NotificationPage from '@/app/Components/notifications/NotificationPage'
import ProtectedRoute from '@/app/Components/ProtectedRoute/ProtectedRoute'
import React from 'react'


const page = () => {
  return (
    <ProtectedRoute>
   <div>
    <NotificationPage />
   </div>
    </ProtectedRoute>

  )
}

export default page
