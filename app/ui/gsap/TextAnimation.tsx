// components/TextAnimation.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TextAnimation: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;

    if (textElement) {
      gsap.fromTo(
        textElement.querySelectorAll('.letter'),
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 1,
          ease: 'power4.out',
        }
      );
    }
  }, []);

  return (
    <div className="text-container" ref={textRef}>
      {'DEVELOPEDIA'.split('').map((char, index) => (
        <span className="letter" key={index}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default TextAnimation;
