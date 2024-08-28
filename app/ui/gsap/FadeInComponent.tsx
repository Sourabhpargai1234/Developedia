// components/FadeInComponent.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const FadeInComponent: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );
    }
  }, []);

  return (
    <div ref={elementRef}>
      <h1>Hello, GSAP!</h1>
    </div>
  );
};

export default FadeInComponent;
