"use client"
import React, { useEffect } from "react";

type AdBannerTypes={
    dataAdSlot: string,
    dataAdFormat: string,
    dataFullWidthResponsive: boolean
}

const AdBanner=(props:AdBannerTypes)=>{
    useEffect(()=>{
        try {
            ((window as any).adsbygoogle=(window as any).adsbygoogle || []).push({})
        } catch (error: any) {
            console.log(error.message)
        }
    })
    return(
        <ins
        className="adsbygoogle adbanner-customize"
        style={{
          display: 'block',
          overflow: 'hidden',
        }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        {...props}
      />
    )
}
export default AdBanner