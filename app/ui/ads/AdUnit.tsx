"use client"
import React, { useEffect } from "react";


const AdUnit=()=>{
    useEffect(()=>{
        try {
            ((window as any).adsbygoogle=(window as any).adsbygoogle || []).push({})
        } catch (error: any) {
            console.log(error.message)
        }
    })
    return (
        <div style={{ display: 'block' }}>
          <ins
            className="adsbygoogle bg-black"
            style={{ display: 'block' }}
            data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
            data-ad-slot="5771651795"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      );
}
export default AdUnit