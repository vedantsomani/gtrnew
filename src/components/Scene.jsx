import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

/**
 * PCModel — Loads the GLB (pc.glb or phone.glb based on device),
 * uses the Blender "Camera", drives ALL animations via
 * mouse scroll (desktop) or touch swipe (mobile),
 * and reports scroll progress to parent for UI triggers.
 *
 * 480 frames → scroll maps 0 → clip.duration
 */
export default function PCModel({ modelPath = '/models/pc.glb', onProgress }) {
  const gltf = useGLTF(modelPath)
  const { scene, cameras, animations } = gltf
  const { set, size } = useThree()

  const mixerRef = useRef(null)
  const actionsRef = useRef([])
  const blenderCamRef = useRef(null)
  const progressRef = useRef(0)        // current (lerped)
  const targetProgressRef = useRef(0)  // target from scroll
  const durationRef = useRef(1)
  const lastReportedRef = useRef(-1)

  // ── 1. Find and activate the Blender camera ──────────────────────
  useEffect(() => {
    let cam = null

    if (cameras && cameras.length > 0) {
      cam = cameras.find((c) => c.name === 'Camera')
      if (!cam) cam = cameras.find((c) => c.name.toLowerCase().includes('camera'))
      if (!cam) cam = cameras[0]
    }

    if (!cam) {
      scene.traverse((child) => {
        if (cam) return
        if ((child.isCamera || child instanceof THREE.PerspectiveCamera) && child.name === 'Camera') {
          cam = child
        }
      })
    }

    if (!cam) {
      scene.traverse((child) => {
        if (cam) return
        if (child.isCamera || child instanceof THREE.PerspectiveCamera) {
          cam = child
        }
      })
    }

    if (!cam) {
      console.error('[Scene] ✗ No camera found in GLB!')
      return
    }

    console.log(`[Scene] ✓ Blender camera "${cam.name}" activated (${modelPath})`)

    if (cam.isPerspectiveCamera) {
      cam.aspect = size.width / size.height
      cam.updateProjectionMatrix()
    }
    cam.updateMatrixWorld(true)

    blenderCamRef.current = cam
    set({ camera: cam })
  }, [scene, cameras, gltf, set, size, modelPath])

  // ── 2. Aspect ratio on resize ────────────────────────────────────
  useEffect(() => {
    const cam = blenderCamRef.current
    if (!cam || !cam.isPerspectiveCamera) return
    cam.aspect = size.width / size.height
    cam.updateProjectionMatrix()
  }, [size])

  // ── 3. Setup animations — paused, scroll-driven ──────────────────
  useEffect(() => {
    if (!animations || animations.length === 0) {
      console.log('[Scene] No animations in GLB.')
      return
    }

    const mixer = new THREE.AnimationMixer(scene)
    mixerRef.current = mixer

    const actions = []
    let maxDuration = 0

    animations.forEach((clip) => {
      console.log(`[Scene] Clip "${clip.name}" — ${clip.duration.toFixed(2)}s, ${clip.tracks.length} tracks`)

      const action = mixer.clipAction(clip)
      action.play()
      action.paused = true
      action.clampWhenFinished = true
      action.setLoop(THREE.LoopOnce, 1)

      actions.push(action)
      if (clip.duration > maxDuration) maxDuration = clip.duration
    })

    actionsRef.current = actions
    durationRef.current = maxDuration

    console.log(`[Scene] ✓ ${animations.length} clip(s) ready — scroll-driven (max ${maxDuration.toFixed(2)}s)`)

    return () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(scene)
    }
  }, [animations, scene])

  // ── 4. Listen to mouse wheel + touch → update scroll progress ────
  useEffect(() => {
    const SCROLL_SENSITIVITY = 0.0008
    const TOUCH_SENSITIVITY = 0.003

    let touchStartY = 0

    // Desktop: mouse wheel
    const handleWheel = (e) => {
      e.preventDefault()
      targetProgressRef.current += e.deltaY * SCROLL_SENSITIVITY
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current))
    }

    // Mobile: touch start
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    // Mobile: touch move (swipe up = scroll forward)
    const handleTouchMove = (e) => {
      e.preventDefault()
      const deltaY = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      targetProgressRef.current += deltaY * TOUCH_SENSITIVITY
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current))
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // ── 5. Per-frame: lerp progress, seek animation, report progress ─
  useFrame(() => {
    // Smooth lerp toward target scroll position
    const lerp = 0.08
    progressRef.current += (targetProgressRef.current - progressRef.current) * lerp

    // Seek all actions to the correct time
    const time = progressRef.current * durationRef.current

    actionsRef.current.forEach((action) => {
      if (action && action.getClip()) {
        action.time = Math.min(time, action.getClip().duration)
        action.paused = true
      }
    })

    // Tick mixer at delta=0 to evaluate
    if (mixerRef.current) {
      mixerRef.current.update(0)
    }

    // Keep Blender camera synced
    const cam = blenderCamRef.current
    if (cam) {
      cam.updateMatrixWorld(true)
      cam.updateProjectionMatrix()
    }

    // Report progress to parent (throttled)
    const rounded = Math.round(progressRef.current * 100)
    if (rounded !== lastReportedRef.current) {
      lastReportedRef.current = rounded
      onProgress?.(progressRef.current)
    }
  })

  // ── 6. Fix PBR materials ─────────────────────────────────────────
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = false
        if (child.material) {
          child.material.needsUpdate = true
          const mat = child.material
          if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace
          if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace
        }
      }
    })
  }, [scene])

  return (
    <>
      {/* ★ HDRI Environment for realistic reflections & ambient lighting */}
      <Environment preset="warehouse" environmentIntensity={0.73} />
      <primitive object={scene} />
    </>
  )
}

// Preload both models
useGLTF.preload('/models/pc.glb')
useGLTF.preload('/models/phone.glb')

