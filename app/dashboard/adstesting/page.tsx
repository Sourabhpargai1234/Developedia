import React from 'react'
import AdUnit from '@/app/ui/ads/AdUnit'

export default function page() {
  return (
    <div className="absolute lg:top-1/4 lg:w-1/4 lg:right-0">
      <h1>This page is dedicated for testing ads whether they are visible to the users or not</h1>
      <h3>Meanwhile the route is not made public for the user</h3>
      <AdUnit />
    </div>
  )
}
