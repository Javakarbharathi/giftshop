import { useEffect, useRef } from 'react';

export default function MotionBackground() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.003;

      // Soft, clean South Indian silk background wash
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      // Subtle flowing golden amber and royal indigo waves
      const waves = [
        { color: 'rgba(234, 88, 12, 0.045)', speed: time, amp: 55, freq: 0.0015, y: 0.3 },
        { color: 'rgba(37, 99, 235, 0.035)', speed: time * 0.8, amp: 45, freq: 0.0012, y: 0.55 },
        { color: 'rgba(217, 119, 6, 0.03)', speed: time * 1.2, amp: 60, freq: 0.0018, y: 0.8 }
      ];

      waves.forEach(w => {
        ctx.beginPath();
        const baseY = height * w.y;
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseY);

        for (let x = 0; x <= width; x += 16) {
          const y = baseY + Math.sin(x * w.freq + w.speed) * w.amp;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
