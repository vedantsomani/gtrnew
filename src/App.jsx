import React, { Suspense, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import PCModel from './components/Scene.jsx'
import HUD from './components/HUD.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

/**
 * App — Root component.
 *
 * CAMERA: Blender "Camera" from GLB injected inside PCModel.
 * ANIMATION: Driven by mouse scroll / touch (0→480 frames).
 * REGISTER BUTTON: Appears when scroll reaches the last frame.
 * DEVICE: Loads pc.glb on desktop, phone.glb on mobile.
 */

function detectMobile() {
  const isNarrow = window.matchMedia('(max-width: 768px)').matches
  const isTouchOnly = window.matchMedia('(pointer: coarse)').matches
  const isMobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  return isNarrow || isTouchOnly || isMobileUA
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(() => detectMobile())

  const handleLoaded = useCallback(() => setLoaded(true), [])
  const handleProgress = useCallback((p) => setScrollProgress(p), [])

  // Re-detect on resize (covers DevTools emulation toggle)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = () => setIsMobile(detectMobile())
    mq.addEventListener('change', handler)
    window.addEventListener('resize', handler)
    return () => {
      mq.removeEventListener('change', handler)
      window.removeEventListener('resize', handler)
    }
  }, [])

  const modelPath = isMobile ? '/models/phone.glb' : '/models/pc.glb'
  console.log(`[App] Device: ${isMobile ? 'MOBILE → phone.glb' : 'DESKTOP → pc.glb'}`)

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onFinished={handleLoaded} />

      {/* 3D Canvas */}
      <div className="canvas-container">
        <Canvas
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.79,
            outputColorSpace: THREE.SRGBColorSpace,
            powerPreference: 'high-performance',
          }}
          shadows
          dpr={[1, 2]}
          style={{ background: '#050510' }}
          onCreated={({ gl }) => {
            gl.physicallyCorrectLights = true
          }}
        >
          {/* Boosted ambient + directional fill */}
          <ambientLight intensity={0.24} />
          <directionalLight position={[5, 8, 3]} intensity={0.6} castShadow />
          <directionalLight position={[-4, 6, -2]} intensity={0.31} />

          <Suspense fallback={null}>
            <PCModel modelPath={modelPath} onProgress={handleProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD — shows logo + register button at end */}
      {loaded && <HUD scrollProgress={scrollProgress} />}
    </>
  )
}
