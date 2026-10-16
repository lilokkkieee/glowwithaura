import { useState } from 'react';

export default function HeroParticles({ count = 22 }: { count?: number }) {
  const [particles] = useState(() =>
    Array.from({ length: count }).map(() => ({
      left: Math.random() * 95,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 8,
      size: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-gold-400"
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
  );
}
