"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface DotBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function DotBackground({ children, className }: DotBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dots: { x: number; y: number; originX: number; originY: number }[] = [];
    const gap = 20;
    const dotSize = 1;
    const interactionRadius = 100;
    const maxDisplacement = 15;
    const ease = 0.1;

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initDots(width, height);
    };

    const initDots = (width: number, height: number) => {
      dots = [];
      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          dots.push({ 
            x: x, 
            y: y, 
            originX: x, 
            originY: y 
          });
        }
      }
    };

    const render = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#404040";

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      dots.forEach((dot) => {
        const dx = mouseX - dot.originX;
        const dy = mouseY - dot.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let targetX = dot.originX;
        let targetY = dot.originY;

        if (distance < interactionRadius) {
          const force = (interactionRadius - distance) / interactionRadius;
          const angle = Math.atan2(dy, dx);
          const move = force * maxDisplacement;
          targetX -= Math.cos(angle) * move;
          targetY -= Math.sin(angle) * move;
        }

        dot.x += (targetX - dot.x) * ease;
        dot.y += (targetY - dot.y) * ease;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseLeave = () => {
        mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", resizeCanvas);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
        ref={containerRef}
        className={cn("relative flex min-h-screen w-full flex-col items-center bg-black overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
      <div className="relative z-20 w-full">
        {children}
      </div>
    </div>
  );
}
