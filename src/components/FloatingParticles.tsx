export interface ParticleItem {
  id: number;
  x: number;
  y: number;
  glyph: string;
}

interface FloatingParticlesProps {
  particles: ParticleItem[];
}

export function FloatingParticles({particles}: FloatingParticlesProps) {
  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-burst-rise fixed text-2xl select-none"
          style={{left: p.x - 14, top: p.y - 14}}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
