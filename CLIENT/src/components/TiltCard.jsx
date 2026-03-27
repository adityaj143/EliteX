import React, { useRef } from 'react';

export default function TiltCard({ children, className = '', maxTilt = 15 }) {
  const ref = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -maxTilt;
    const rotateY = ((x - cx) / cx) * maxTilt;
    
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    ref.current.style.boxShadow = `${-rotateY}px ${rotateX}px 40px rgba(99, 102, 241, 0.15)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    ref.current.style.boxShadow = `0px 10px 30px rgba(0, 0, 0, 0.2)`;
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
