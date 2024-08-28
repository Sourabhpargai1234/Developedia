"use client"
import { useEffect } from "react";
import Image from "next/image";
import Navbar from "./ui/Navbar";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import HangingElements from "./ui/gsap/HangingElements";
import HangingElements2 from "./ui/gsap/HangingElements2";



export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gradient-to-r from-pink-100 via-pink-50 to-blue-100">
      <h1 className="text-slate-400 font-bold bg-clip-text text-6xl mb-4">
        Share Your Code, Learn Together
      </h1>
      <p className="text-black bg-clip-text text-4xl mb-10">
        where developers learn and grow
      </p>
      <div className="flex flex-row"><Navbar /></div>
      <div className="flex flex-row">
       <HangingElements />
        <Image 
          src="/home.png"
          alt="Home-page Image"
          width={800}   
          height={500}  
        />
        <HangingElements2 />
      </div>
    </main>
  );
}
