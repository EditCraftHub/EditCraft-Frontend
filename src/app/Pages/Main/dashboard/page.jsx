import ProtectedRoute from '@/app/Components/ProtectedRoute/ProtectedRoute'
import React from 'react'


const page = () => {
  return (
    <ProtectedRoute>
    <div className="min-h-screen ">
  <div className="max-w-6xl mx-auto p-6">
    <div className="space-y-6"> {/* ⭐ KEY: Consistent vertical spacing */}
      {/* Content sections here */}
         DashBoard for All Editors
    </div>
  </div>
</div>
    </ProtectedRoute>

  )
}

export default page
