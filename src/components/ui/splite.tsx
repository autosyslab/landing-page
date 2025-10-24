'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onError?: () => void
}

export function SplineScene({ scene, className, onError }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-white/70">Loading 3D scene...</div>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={() => console.log('✅ Spline scene loaded successfully')}
        onError={(error) => {
          console.error('❌ Spline scene failed to load:', error)
          onError?.()
        }}
      />
    </Suspense>
  )
}
