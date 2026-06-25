/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useEffect, useRef, MouseEvent, TouchEvent } from 'react';

interface GoldParticle {
  id: number;
  x: number; // Viewport X coordinate
  y: number; // Viewport Y coordinate
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  color: string;
  shape: 'organic' | 'diamond' | 'flake';
  scaleY: number;
  swaySpeed: number;
  swayOffset: number;
}

const GOLD_COLORS = [
  '#FFDF73', // Light Gold Spark
  '#F3C13F', // Classic Gold Leaf
  '#D4AF37', // Antique Metallic Gold
  '#AA7C11', // Heavy Rich Gold
  '#EAC15C', // Champagne Gold
  '#F5D77F'  // Soft Satin Gold
];

export default function LuxuryBackground({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<GoldParticle[]>([]);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle resizing of the fixed overlay canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setup

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 60FPS Physics Simulation & Render Loop
  useEffect(() => {
    let animationFrameId: number;
    
    const updateAndDraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animationFrameId = requestAnimationFrame(updateAndDraw);
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationFrameId = requestAnimationFrame(updateAndDraw);
        return;
      }

      // Clear with absolute precision
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particle states
      const activeParticles = particlesRef.current.map((p) => {
        const nextVy = p.vy + 0.14; // Light custom gravity
        const nextVx = p.vx * 0.96; // Air resistance damping
        const nextX = p.x + nextVx + Math.sin(p.swayOffset) * 0.35;
        const nextY = p.y + nextVy;
        const nextRotation = p.rotation + p.rotationSpeed;
        const nextOpacity = p.opacity - 0.015; // Smooth fading decay

        return {
          ...p,
          x: nextX,
          y: nextY,
          vx: nextVx,
          vy: nextVy,
          rotation: nextRotation,
          opacity: nextOpacity,
          swayOffset: p.swayOffset + p.swaySpeed,
          scaleY: Math.sin(p.swayOffset * 0.7) // Simulating 3D flutter/tumbling
        };
      }).filter((p) => p.opacity > 0);

      // Save active particles
      particlesRef.current = activeParticles;

      // Draw active particles
      activeParticles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.scale(1, p.scaleY);

        // Shiny gold foil linear gradient to look high-end
        const grad = ctx.createLinearGradient(-p.size / 2, -p.size / 2, p.size / 2, p.size / 2);
        grad.addColorStop(0, p.color);
        grad.addColorStop(0.35, '#FFFFFF'); // Shiny gloss point
        grad.addColorStop(0.7, p.color);
        grad.addColorStop(1, '#5C4308'); // Warm metallic shadow

        ctx.fillStyle = grad;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.shadowBlur = p.opacity * 6;
        ctx.globalAlpha = p.opacity;

        ctx.beginPath();
        if (p.shape === 'diamond') {
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, 0);
          ctx.lineTo(0, p.size / 2);
          ctx.lineTo(-p.size / 2, 0);
        } else if (p.shape === 'organic') {
          ctx.moveTo(-p.size * 0.3, -p.size * 0.5);
          ctx.lineTo(p.size * 0.4, -p.size * 0.4);
          ctx.lineTo(p.size * 0.5, p.size * 0.1);
          ctx.lineTo(p.size * 0.3, p.size * 0.45);
          ctx.lineTo(-p.size * 0.2, p.size * 0.5);
          ctx.lineTo(-p.size * 0.5, p.size * 0.2);
          ctx.lineTo(-p.size * 0.4, -p.size * 0.25);
        } else {
          // Flake polygon shape
          ctx.moveTo(0, -p.size * 0.4);
          ctx.lineTo(p.size * 0.4, -p.size * 0.2);
          ctx.lineTo(p.size * 0.3, p.size * 0.3);
          ctx.lineTo(-p.size * 0.3, p.size * 0.4);
          ctx.lineTo(-p.size * 0.4, -p.size * 0.1);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    animationFrameId = requestAnimationFrame(updateAndDraw);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Spawn particle factory helper
  const createFlake = (clientX: number, clientY: number, burst: boolean) => {
    const angle = burst 
      ? Math.random() * Math.PI * 2 // Burst explodes outwards in all directions
      : (Math.random() * 100 + 220) * (Math.PI / 180); // Hover trailing rises up and out slightly

    const speed = burst
      ? Math.random() * 5.5 + 2.5 // Explosive click speeds
      : Math.random() * 2.0 + 0.5; // Soft trailing speeds

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const shapes: GoldParticle['shape'][] = ['organic', 'diamond', 'flake'];

    return {
      id: Math.random() + Date.now(),
      x: clientX,
      y: clientY,
      vx,
      vy,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      size: Math.random() * 11 + 5, // 5px to 16px wide flakes
      opacity: 1,
      color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      scaleY: Math.random() * 2 - 1,
      swaySpeed: Math.random() * 0.08 + 0.02,
      swayOffset: Math.random() * Math.PI * 2
    };
  };

  // Click / Tap burst handler
  const handleTapBurst = (e: MouseEvent<HTMLDivElement>) => {
    // Burst particles
    const burstCount = 18;
    const newFlakes: GoldParticle[] = [];
    for (let i = 0; i < burstCount; i++) {
      newFlakes.push(createFlake(e.clientX, e.clientY, true));
    }
    // Limit to 120 concurrent particles total on screen for optimal memory use
    particlesRef.current = [...particlesRef.current, ...newFlakes].slice(-120);
  };

  // Hover trailing handler
  const handleHoverTrail = (clientX: number, clientY: number) => {
    const dist = Math.hypot(clientX - lastMousePos.current.x, clientY - lastMousePos.current.y);
    // Only spawn when pointer is actively moving (distance-based trailing)
    if (dist > 14) {
      const trailCount = Math.random() > 0.4 ? 2 : 1;
      const newFlakes: GoldParticle[] = [];
      for (let i = 0; i < trailCount; i++) {
        newFlakes.push(createFlake(clientX, clientY, false));
      }
      particlesRef.current = [...particlesRef.current, ...newFlakes].slice(-120);
      lastMousePos.current = { x: clientX, y: clientY };
    }
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    handleHoverTrail(e.clientX, e.clientY);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches[0]) {
      handleHoverTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div 
      id="luxury-bg-container" 
      onClick={handleTapBurst}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative min-h-screen overflow-x-hidden bg-[#FAF6F0] text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors duration-500 cursor-default"
    >
      {/* Dynamic Gold Confetti Particle Canvas Overlay (Viewport Coordinates) */}
      <canvas 
        ref={canvasRef} 
        className="pointer-events-none fixed inset-0 z-50 w-full h-full"
      />
      
      {/* 1. LUXURY WEDDING CARD BACKGROUND CANVAS */}
      {/* Heavy textured card overlay (simulating cardstock or linen pattern) */}
      <div 
        id="bg-invitation-texture" 
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l40 40-40 40L0 40z' fill='%239E7D3B' fill-opacity='0.6' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Subtle mandala watermark in background center */}
      <div 
        id="bg-mandala-watermark" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] md:w-[50vw] md:h-[50vw] max-w-[800px] max-h-[800px] opacity-[0.035] pointer-events-none mix-blend-overlay rotate-12"
      >
        <svg viewBox="0 0 200 200" fill="none" stroke="#C5A880" strokeWidth="0.75" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" />
          <circle cx="100" cy="100" r="55" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="30" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 100 + Math.cos(angle) * 30;
            const y1 = 100 + Math.sin(angle) * 30;
            const x2 = 100 + Math.cos(angle) * 80;
            const y2 = 100 + Math.sin(angle) * 80;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const cx = 100 + Math.cos(angle) * 55;
            const cy = 100 + Math.sin(angle) * 55;
            return <circle key={i} cx={cx} cy={cy} r="10" strokeDasharray="1 1" />;
          })}
        </svg>
      </div>

      {/* Elegant double-gilded border frame (Physical Wedding Card Style) */}
      <div id="card-outer-gold-frame" className="fixed inset-3 md:inset-4 border border-amber-500/15 pointer-events-none z-30 rounded-xl" />
      <div id="card-inner-gold-frame" className="fixed inset-4.5 md:inset-5.5 border border-dashed border-amber-600/10 pointer-events-none z-30 rounded-lg" />

      {/* Ornate Gold Filigree Corners */}
      <div className="fixed top-3 left-3 md:top-4 md:left-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-40 text-amber-600/30">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H96V6H12V96H4V4Z" fill="currentColor" />
          <path d="M8 8H80V10H16V80H8V8Z" fill="currentColor" className="opacity-60" />
          <path d="M12 12C20 20 20 30 12 40" stroke="currentColor" strokeWidth="1" />
          <path d="M12 12C20 20 30 20 40 12" stroke="currentColor" strokeWidth="1" />
          <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        </svg>
      </div>
      <div className="fixed top-3 right-3 md:top-4 md:right-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-40 text-amber-600/30 rotate-90">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H96V6H12V96H4V4Z" fill="currentColor" />
          <path d="M8 8H80V10H16V80H8V8Z" fill="currentColor" className="opacity-60" />
          <path d="M12 12C20 20 20 30 12 40" stroke="currentColor" strokeWidth="1" />
          <path d="M12 12C20 20 30 20 40 12" stroke="currentColor" strokeWidth="1" />
          <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        </svg>
      </div>
      <div className="fixed bottom-3 left-3 md:bottom-4 md:left-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-40 text-amber-600/30 -rotate-90">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H96V6H12V96H4V4Z" fill="currentColor" />
          <path d="M8 8H80V10H16V80H8V8Z" fill="currentColor" className="opacity-60" />
          <path d="M12 12C20 20 20 30 12 40" stroke="currentColor" strokeWidth="1" />
          <path d="M12 12C20 20 30 20 40 12" stroke="currentColor" strokeWidth="1" />
          <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        </svg>
      </div>
      <div className="fixed bottom-3 right-3 md:bottom-4 md:right-4 w-12 h-12 md:w-16 md:h-16 pointer-events-none z-40 text-amber-600/30 rotate-180">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H96V6H12V96H4V4Z" fill="currentColor" />
          <path d="M8 8H80V10H16V80H8V8Z" fill="currentColor" className="opacity-60" />
          <path d="M12 12C20 20 20 30 12 40" stroke="currentColor" strokeWidth="1" />
          <path d="M12 12C20 20 30 20 40 12" stroke="currentColor" strokeWidth="1" />
          <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        </svg>
      </div>

      {/* Floating Ambient Glow Elements - Soft Ivory Gold, Warm Peach, Velvet Rose */}
      <div id="glow-champagne" className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-amber-100/25 to-amber-200/15 blur-[120px] pointer-events-none" />
      <div id="glow-rose" className="absolute bottom-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-rose-100/30 to-amber-100/15 blur-[140px] pointer-events-none" />

      {/* Gilded Accent Top & Bottom lines */}
      <div id="royal-border-top" className="fixed top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#9E7D3B] via-[#EAC15C] to-[#9E7D3B] z-50 shadow-sm" />
      <div id="royal-border-bottom" className="fixed bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#9E7D3B] via-[#EAC15C] to-[#9E7D3B] z-50 shadow-sm" />

      {/* 3. MAIN WRAPPED LAYOUT CHILDREN */}
      <div id="main-content-wrapper" className="relative z-10 w-full px-5 md:px-8 pt-4 pb-20">
        {children}
      </div>
    </div>
  );
}
