// components/HangingElements.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

const HangingElements2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.hanging-item');

      // GSAP animation for hanging effect
      gsap.fromTo(
        elements,
        { y: -250, opacity: 0 }, // Initial state: above and transparent
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2, // Stagger the animation
          ease: 'elastic.out(1, 0.5)' // Elastic easing for natural bounce
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="hanging-container">
      <div className="hanging-item curved-image my-8 bg-blue-800 hidden lg:block">
      <Image 
          src="/Coding3.png"
          alt="Home-page Image"
          width={400}   
          height={400} 
          className="curved-image" 
        />
      </div>
      <div className="hanging-item curved-image bg-blue-200 hidden lg:block">
      <Image 
          src="/Coding1.png"
          alt="Home-page Image"
          width={400}   
          height={200}  
          className='curved-image my-8'
        />
      </div>
    </div>
  );
};

export default HangingElements2;
