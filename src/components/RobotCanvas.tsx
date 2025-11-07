"use client"

import React, { useEffect, useRef, useState } from "react"
import { SplineScene } from "@/components/ui/splite"
import { AlertTriangle, Zap, Sparkles } from "lucide-react"
import { useDeviceDetection } from "@/hooks/useDeviceDetection"
import { SplineErrorBoundary } from "./SplineErrorBoundary"

type Props = {
  className?: string
}

export default function RobotCanvas({ className }: Props) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { isMobile, isLowPowerMode, connectionType } = useDeviceDetection()
  const [enable3D, setEnable3D] = useState(true)

  // Auto-disable 3D on low power mode or slow connection
  useEffect(() => {
    if (isLowPowerMode) {
      setEnable3D(false)
    }
  }, [isLowPowerMode])

  useEffect(() => {
    if (!ref.current) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ready && !error && enable3D) {
          setReady(true)

          // Set 10 second timeout for Spline loading
          timeoutRef.current = setTimeout(() => {
            if (!error) {
              setTimedOut(true)
              console.warn('Spline scene loading timed out after 10 seconds')
            }
          }, 10000)
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
  }, [ready, error, enable3D])

  const scene = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

  // Lightweight fallback component
  const LightweightFallback = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-pulse" />

      <div className="relative z-10">
        <div className="w-32 h-32 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          AI Employee Ready
        </h3>
        <p className="text-cyan-200/90 text-base max-w-md leading-relaxed">
          3D visualization disabled for optimal performance on your device. All features work perfectly!
        </p>
      </div>
    </div>
  )

  return (
    <div className="relative">
      {/* Mobile 3D Toggle Button */}
      {isMobile && (
        <div className="absolute -top-12 right-0 z-20">
          <button
            onClick={() => {
              setEnable3D(!enable3D)
              if (!enable3D) {
                setReady(false)
                setError(false)
                setTimedOut(false)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-800 rounded-lg hover:bg-white transition-all shadow-lg hover:shadow-xl text-sm font-medium border border-cyan-200/50"
            aria-label={enable3D ? 'Disable 3D animation to save battery' : 'Enable 3D animation'}
          >
            {enable3D ? (
              <>
                <Zap className="w-4 h-4 text-orange-500" />
                <span>Save Battery</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Enable 3D</span>
              </>
            )}
          </button>
        </div>
      )}

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
          {!enable3D ? (
            <LightweightFallback />
          ) : !ready ? (
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
            <SplineErrorBoundary fallback={<LightweightFallback />}>
              <SplineScene
                scene={scene}
                className="w-full h-full"
                onError={() => setError(true)}
              />
            </SplineErrorBoundary>
          )}
        </div>
      </div>
    </div>
  )
}
