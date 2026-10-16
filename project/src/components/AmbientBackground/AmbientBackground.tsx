import { useState } from 'react';

type Props = { count?: number };

export default function AmbientBackground({ count = 30 }: Props) {
  const [particles] = useState(() =>
    Array.from({ length: count }).map(() => ({
      left: Math.random() * 95,
      duration: 14 + Math.random() * 16,
      delay: Math.random() * 12,
      size: 3 + Math.random() * 5,
      opacity: 0.25 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 100,
    }))
  );

  const [glows] = useState(() =>
    Array.from({ length: 5 }).map((_, i) => ({
      top: 10 + i * 20 + Math.random() * 10,
      left: i % 2 === 0 ? 6 + Math.random() * 14 : 80 + Math.random() * 14,
      size: 360 + Math.random() * 260,
      duration: 8 + Math.random() * 7,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-[60]"
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, #3D6B49 0%, #2D5237 50%, #1A3022 100%)',
        }}
      />
      {glows.map((g, i) => (
        <span
          key={`glow-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${g.top}%`,
            left: `${g.left}%`,
            width: `${g.size}px`,
            height: `${g.size}px`,
            background:
              'radial-gradient(circle, rgba(140,200,150,0.22) 0%, rgba(140,200,150,0) 70%)',
            animation: `ambient-glow ${g.duration}s ease-in-out ${g.delay}s infinite`,
          }}
        />
      ))}
      {particles.map((p, i) => (
        <span
          key={`p-${i}`}
          className="absolute bottom-0 rounded-full"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: 'rgba(200, 235, 190, 0.85)',
              boxShadow: '0 0 8px rgba(160, 220, 160, 0.6)',
              '--p-opacity': p.opacity,
              '--p-drift': `${p.drift}px`,
              animation: `ambient-float ${p.duration}s linear ${p.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
