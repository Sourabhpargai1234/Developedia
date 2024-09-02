"use client"
import { useEffect ,useState} from "react";
import Image from "next/image";
import Navbar from "./ui/Navbar";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import HangingElements from "./ui/gsap/HangingElements";
import HangingElements2 from "./ui/gsap/HangingElements2";
import Loading from "./loading";
import TextAnimation from "./ui/gsap/TextAnimation";


export default function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);
  if (loading) {
    return <TextAnimation />;
  }
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gradient-to-r from-pink-100 via-pink-50 to-blue-100">
      <h1 className="text-slate-400 font-bold bg-clip-text text-5xl mb-4">
        Share Your Code, Learn Together
      </h1>
      <p className="text-black bg-clip-text text-2xl mb-10">
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
