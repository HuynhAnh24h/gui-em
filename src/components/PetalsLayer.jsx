import { useEffect, useRef } from 'react';

export default function PetalsLayer({ burstSignal }) {
  const layerRef = useRef(null);

  const spawn = (cls, n, dur, keep) => {
    const layer = layerRef.current;
    if (!layer) return;
    const calm =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) return;

    for (let i = 0; i < n; i += 1) {
      const s = document.createElement('span');
      s.className = cls;
      const d = dur * (0.7 + Math.random() * 0.6);
      const w = Math.random() * dur;
      s.style.left = `${Math.random() * 100}%`;
      s.style.animationDuration = `${d}s`;
      s.style.animationDelay = `${w}s`;
      s.style.setProperty('--dx', `${Math.random() * 120 - 60}px`);
      if (cls === 'petal') {
        const z = 0.7 + Math.random() * 0.8;
        s.style.width = `${12 * z}px`;
        s.style.height = `${16 * z}px`;
      }
      layer.appendChild(s);
      if (!keep) {
        window.setTimeout(() => {
          s.remove();
        }, (d + w) * 1000 + 200);
      }
    }
  };

  useEffect(() => {
    const layer = layerRef.current;
    spawn('dust', 16, 14, true);
    return () => {
      if (layer) {
        layer.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!burstSignal) return;
    spawn('petal', 18, 7, false);
  }, [burstSignal]);

  return <div className="petals" ref={layerRef} aria-hidden="true" />;
}
