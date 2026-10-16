import { useState } from 'react';

export default function HomeGlow() {
  const [particles] = useState(() =>
    Array.from({ length: 18 }).map(() => ({
      left: Math.random() * 100,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 10,
      size: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  );

  return <HomeGlowInner particles={particles} />;
}

import { useEffect, useRef } from 'react';

function HomeGlowInner({ particles }: { particles: { left: number; duration: number; delay: number; size: number; opacity: number }[] }) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const animate = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[280px] h-[280px] rounded-full pointer-events-none -ml-[140px] -mt-[140px] z-40 mix-blend-screen"
        style={{
          willChange: 'transform',
          background:
            'radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.12) 45%, transparent 70%)',
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {particles.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-gold-400 mix-blend-screen"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `hero-particle-rise ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
