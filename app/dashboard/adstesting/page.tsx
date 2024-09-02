import React from 'react'
import AdBanner from '@/app/ui/ads/AdBanner'

export default function page() {
  return (
    <div className="absolute lg:top-1/4 lg:w-1/4 lg:right-0">
      <AdBanner dataAdFormat='auto' dataFullWidthResponsive={true} dataAdSlot='1573170883'/>
    </div>
  )
}
