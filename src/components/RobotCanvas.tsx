"use client"

import React, { useEffect, useRef, useState } from "react"
import { SplineScene } from "@/components/ui/splite"
import { AlertTriangle } from "lucide-react"
import { SplineErrorBoundary } from "./SplineErrorBoundary"

type Props = {
  className?: string
}

export default function RobotCanvas({ className }: Props) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ready && !error) {
          // Small delay to ensure browser is ready for WebGL
          setTimeout(() => {
            setReady(true)

            // Set 15 second timeout for Spline loading (increased from 10s)
            timeoutRef.current = setTimeout(() => {
              if (!error) {
                setTimedOut(true)
                console.warn('Spline scene loading timed out after 15 seconds')
              }
            }, 15000)
          }, 100)
        }
      },
      { rootMargin: "200px" }
    )

    io.observe(ref.current)

    return () => {
      io.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [ready, error])

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
      {/* Sky glow background */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(1200px_900px_at_80%_40%,#5ff6ff_0%,#0fd8f0_35%,#00c5de_60%,#00b8d4_75%,transparent_80%)]
          opacity-90 blur-sm animate-glow
        "
      />

      {/* Content */}
      <div className="absolute inset-0 rounded-none overflow-hidden animate-float">
        {!ready ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-cyan-200/70 text-lg font-medium">
              Preparing 3D view...
            </div>
          </div>
        ) : error || timedOut ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {timedOut ? 'Loading Taking Longer Than Expected' : '3D View Unavailable'}
            </h3>
            <p className="text-cyan-200/70 text-sm max-w-sm mb-4">
              {timedOut
                ? 'The 3D scene is taking longer to load. The website still works perfectly!'
                : 'Unable to load 3D visualization. All features are still fully functional.'}
            </p>
            <button
              onClick={() => {
                setError(false)
                setTimedOut(false)
                setReady(false)
                setTimeout(() => setReady(true), 100)
              }}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <SplineErrorBoundary
            fallback={
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">3D Scene Error</h3>
                <p className="text-cyan-200/70 text-sm max-w-sm mb-4">
                  The 3D visualization encountered an error. This might be due to browser limitations or network issues.
                </p>
                <button
                  onClick={() => {
                    setError(false)
                    setTimedOut(false)
                    setReady(false)
                    setLoaded(false)
                    setTimeout(() => setReady(true), 100)
                  }}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            }
          >
            <SplineScene
              scene={scene}
              className="w-full h-full"
              onError={() => {
                console.error('Spline scene failed to load')
                setError(true)
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current)
                }
              }}
            />
          </SplineErrorBoundary>
        )}
      </div>
    </div>
  )
}
