"use client"

import React, { useEffect, useRef, useState } from "react"
import { SplineScene } from "@/components/ui/splite"

type Props = {
  className?: string
}

type AnimationPhase = 'initial' | 'popup' | 'fading' | 'background' | 'robot-ready'
/**
 * Lazy-mounts Spline when in view, fades in, and sits on a bright cyan sky glow.
 */
export default function RobotCanvas({ className }: Props) {
  const [ready, setReady] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('initial')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ready) {
          // Start the animation sequence
          setAnimationPhase('popup')
          
          // Popup phase: 3s
          setTimeout(() => setAnimationPhase('fading'), 3000)
          
          // Fade to background phase: 2s
          setTimeout(() => setAnimationPhase('background'), 5000)
          
          // Robot ready phase: after total 6s
          setTimeout(() => {
            setAnimationPhase('robot-ready')
            setReady(true)
          }, 6000)
        }
      },
      { rootMargin: "200px" }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ready])

  // Use a demo scene URL that works
  const scene = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

  return (
    <div
      ref={ref}
      className={`
        relative h-[560px] md:h-[600px] lg:h-[640px] 
        rounded-2xl overflow-hidden
        ring-1 ring-cyan-400/20
        shadow-[0_0_80px_rgba(94,234,212,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
        ${className || ""}
      `}
    >
      {/* Sky glow: big blurred radial light that slowly breathes */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(1200px_900px_at_80%_40%,#5ff6ff_0%,#0fd8f0_35%,#00c5de_60%,#00b8d4_75%,transparent_80%)]
          opacity-90 blur-sm animate-glow
        "
      />

      {/* Enhanced "I'm coming" popup notification */}
      {(animationPhase === 'popup' || animationPhase === 'fading' || animationPhase === 'background') && (
        <div
          className={`
            absolute inset-0 z-20 flex items-center justify-center
            ${animationPhase === 'popup' ? 'pointer-events-auto' : 'pointer-events-none'}
          `}
        >
          {/* Semi-transparent backdrop */}
          <div 
            className={`
              absolute inset-0 
              ${animationPhase === 'popup' ? 'bg-slate-900/60' : 
                animationPhase === 'fading' ? 'bg-slate-900/40' : 'bg-slate-900/20'}
              transition-all duration-2000
            `} 
          />
          
          {/* Coming text notification */}
          <div
            className={`
              absolute top-1/2 left-1/2 z-30
              px-8 py-6 rounded-2xl
              bg-gradient-to-br from-cyan-500/90 to-blue-600/90
              border-2 border-cyan-300/50
              shadow-[0_0_60px_rgba(0,212,255,0.8),0_0_100px_rgba(0,212,255,0.4)]
              backdrop-blur-lg
              ${animationPhase === 'popup' ? 'animate-coming-popup' : 
                animationPhase === 'fading' ? 'animate-fade-to-background' : ''}
              transition-all duration-2000
            `}
            style={{
              transform: animationPhase === 'background' 
                ? 'translate(-50%, -50%) scale(0.7)' 
                : undefined,
              opacity: animationPhase === 'background' ? 0.3 : undefined
            }}
          >
            {/* Glowing ring effect */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-400/30 to-blue-500/30 animate-pulse blur-sm" />
            
            {/* Main text */}
            <div className="relative z-10 text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-2">
                I'm Coming...
              </h3>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <p className="text-cyan-100 text-sm mt-3 font-medium">
                Your AI employee is initializing...
              </p>
            </div>

            {/* Corner accent lights */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-cyan-300 rounded-full blur-sm animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-300 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>
      )}
      {/* Robot canvas */}
      <div
        className={`
          absolute inset-0 rounded-none overflow-hidden
          ${animationPhase === 'robot-ready' ? "opacity-100 animate-float" : "opacity-0"}
          transition-opacity duration-1000
        `}
      >
        {animationPhase === 'robot-ready' ? (
          <SplineScene scene={scene} className="w-full h-full" />
        ) : (
          <div className="h-full grid place-items-center text-white/40">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <div className="text-lg font-medium">Preparing your AI employee...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}