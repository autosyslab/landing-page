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
  const [showPopup, setShowPopup] = useState(false)
  const [showRobot, setShowRobot] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ready) {
          // Show popup immediately
          setShowPopup(true)
          
          // Hide popup and show robot after 2s
          setTimeout(() => {
            setShowPopup(false)
            setShowRobot(true)
            setReady(true)
          }, 2000)
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
      {showPopup && (
        <div
          className={`
            absolute inset-0 z-20 flex items-center justify-center
            pointer-events-none
            transition-opacity duration-500 ease-out
            ${showPopup ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Simple text notification */}
          <div
            className={`
              px-6 py-4 rounded-xl
              bg-white/10 backdrop-blur-md
              border border-white/20
              transform transition-all duration-500 ease-out
            `}
          >
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
                I'm here ✨
              </h3>
            </div>
          </div>
        </div>
      )}
      {/* Robot canvas */}
      <div
        className={`
          absolute inset-0 rounded-none overflow-hidden
          ${showRobot ? "opacity-100 animate-float" : "opacity-0"}
          transition-opacity duration-300
        `}
      >
        {showRobot ? (
          <SplineScene scene={scene} className="w-full h-full" />
        ) : (
          <div className="h-full grid place-items-center text-white/40">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <div className="text-lg font-medium">Ready when you are...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}