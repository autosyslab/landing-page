'use client'

import { Suspense, lazy, ErrorBoundary } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}

export function SplineScene({ scene, className, onLoad, onError }: SplineSceneProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white/70 text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <div>Failed to load 3D scene</div>
          </div>
        </div>
      }
      onError={onError}
    >
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
          onLoad={onLoad}
          onError={onError}
        />
      </Suspense>
    </ErrorBoundary>
  )
}