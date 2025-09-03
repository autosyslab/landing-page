"use client"

import React, { useEffect, useRef, useState } from "react"
import { SplineScene } from "@/components/ui/splite"

type Props = {
  className?: string
}

/**
 * Lazy-mounts Spline when in view and sits on a bright cyan sky glow.
 */
export default function RobotCanvas({ className }: Props) {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ready && !loading) {
          setLoading(true)
          setReady(true)
        }
      },
      { rootMargin: "200px" }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ready, loading])

  // Use a demo scene URL that works
  const scene = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

  const handleSplineLoad = () => {
    setLoading(false)
  }

  const handleSplineError = () => {
    setLoading(false)
    setError(true)
  }
  return (
    <div
      ref={ref}
      className={`
        relative h-[560px] md:h-[600px] lg:h-[640px] 
        rounded-2xl overflow-hidden
        ring-1 ring-cyan-400/20
        shadow-[0_0_80px_rgba(94,234,212,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
        focus-within:ring-2 focus-within:ring-cyan-400/50
        ${className || ""}
      `}
      role="img"
      aria-label="Interactive 3D robot preview"
    >
      {/* Sky glow: big blurred radial light that slowly breathes */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(1200px_900px_at_80%_40%,#5ff6ff_0%,#0fd8f0_35%,#00c5de_60%,#00b8d4_75%,transparent_80%)]
          opacity-90 blur-sm
          motion-safe:animate-glow
        "
      />
      {/* Robot canvas */}
      <div
        className="absolute inset-0 rounded-none overflow-hidden motion-safe:animate-float"
      >
        {error ? (
          <div className="h-full grid place-items-center text-white/70">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <div className="text-lg font-medium">Robot temporarily offline</div>
              <div className="text-sm text-white/50 mt-2">Please try refreshing the page</div>
            </div>
          </div>
        ) : ready ? (
          <>
            {loading && (
              <div className="absolute inset-0 grid place-items-center text-white/70 z-10 bg-slate-900/20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <div className="text-lg font-medium">Loading robot...</div>
                </div>
              </div>
            )}
            <SplineScene 
              scene={scene} 
              className="w-full h-full" 
              onLoad={handleSplineLoad}
              onError={handleSplineError}
            />
          </>
        ) : (
          <div className="h-full grid place-items-center text-white/40">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <div className="text-lg font-medium">Ready when you are...</div>
              <div className="text-sm text-white/30 mt-2">3D robot will load when visible</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}