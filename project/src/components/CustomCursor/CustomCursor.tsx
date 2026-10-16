import { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!visible) setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      const target = e.target as HTMLElement;
      setHovering(
        !!target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')
      );
    };

    const onLeave = () => setVisible(false);

    const animateRing = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animateRing);
    };

    raf.current = requestAnimationFrame(animateRing);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none -ml-1 w-2 h-2 rounded-full bg-gold-400 mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[100] pointer-events-none rounded-full border border-gold-400/60 transition-[width,height,opacity] duration-200 ${
          hovering ? 'w-10 h-10 -ml-5 -mt-5 opacity-100' : 'w-6 h-6 -ml-3 -mt-3 opacity-70'
        }`}
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
