import gsap from 'gsap';

// Function to apply scaling animation on hover
export const applyHoverScale = (element: HTMLElement | null) => {
  if (element) {
    gsap.fromTo(
      element,
      { scale: 1 },
      { scale: 2, duration: 0.3, ease: 'power1.out' }
    );
  }
};

// Function to revert scaling animation on mouse leave
export const revertScale = (element: HTMLElement | null) => {
  if (element) {
    gsap.to(element, { scale: 1, duration: 0.3, ease: 'power1.out' });
  }
};
