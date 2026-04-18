import React, { useEffect, useRef, useState } from 'react'

/**
 * WebPSequence — Renders a sequence of 480 WebP frames on a canvas.
 * Driven by mouse scroll (desktop) or touch swipe (mobile).
 * Reports progress to parent for HUD triggers.
 */
export default function WebPSequence({ sequencePath = '/frames/pc/', onProgress, onLoaded, onLoadProgress }) {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const [isReady, setIsReady] = useState(false)
  const lastDrawableIndexRef = useRef(0)

  const progressRef = useRef(0)        // current (lerped)
  const targetProgressRef = useRef(0)  // target from scroll
  const lastReportedRef = useRef(-1)

  const TOTAL_FRAMES = 480
  const READY_FRAME_COUNT = 12
  const READY_TIMEOUT_MS = 15000

  // 1. Preload images
  useEffect(() => {
    console.log(`[WebPSequence] Preloading sequence from: ${sequencePath}`)

    // Reset state for new sequence
    setIsReady(false)
    lastDrawableIndexRef.current = 0
    imagesRef.current = []
    let loadedCount = 0
    const images = []
    let isCancelled = false
    let hasReportedReady = false

    const reportReady = () => {
      if (isCancelled || hasReportedReady) return
      hasReportedReady = true
      console.log('[WebPSequence] Initial frames are ready. Rendering started.')
      setIsReady(true)
      onLoaded?.()
    }

    const readyTimer = window.setTimeout(() => {
      console.warn('[WebPSequence] Ready timeout reached, continuing with partial frames.')
      reportReady()
    }, READY_TIMEOUT_MS)

    const handleSettled = () => {
      loadedCount++
      onLoadProgress?.(Math.round((loadedCount / TOTAL_FRAMES) * 100))

      if (!hasReportedReady && loadedCount >= READY_FRAME_COUNT) {
        reportReady()
      }

      if (loadedCount === TOTAL_FRAMES) {
        console.log(`[WebPSequence] Sequence "${sequencePath}" fully loaded.`)
        reportReady()
      }
    }

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      const frameStr = String(i).padStart(4, '0')
      img.src = `${sequencePath}${frameStr}.webp`

      img.onload = () => {
        handleSettled()
      }
      img.onerror = () => {
        console.error(`[WebPSequence] ✗ Failed to load frame: ${frameStr} in ${sequencePath}`)
        handleSettled()
      }
      images.push(img)
    }
    imagesRef.current = images

    return () => {
      isCancelled = true
      window.clearTimeout(readyTimer)
    }
  }, [sequencePath, onLoaded, onLoadProgress])

  // 2. Scroll/Touch Listeners (Same logic as Scene.jsx)
  useEffect(() => {
    const SCROLL_SENSITIVITY = 0.0008
    const TOUCH_SENSITIVITY = 0.003
    let touchStartY = 0

    const handleWheel = (e) => {
      e.preventDefault()
      targetProgressRef.current += e.deltaY * SCROLL_SENSITIVITY
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current))
    }

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

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

  // 3. Render Loop
  useEffect(() => {
    if (!isReady) return

    let animationFrameId
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const render = () => {
      // Smooth lerp
      const lerp = 0.1
      progressRef.current += (targetProgressRef.current - progressRef.current) * lerp

      // Calculate frame index (0-479)
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progressRef.current * TOTAL_FRAMES)
      )

      const img = imagesRef.current[frameIndex]
      const fallback = imagesRef.current[lastDrawableIndexRef.current]
      const drawable = img && img.complete && img.naturalWidth > 0
        ? img
        : (fallback && fallback.complete && fallback.naturalWidth > 0 ? fallback : null)

      if (drawable) {
        if (drawable === img) {
          lastDrawableIndexRef.current = frameIndex
        }

        // Clear and draw
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const canvasAspect = canvas.width / canvas.height
        const imgAspect = drawable.width / drawable.height

        let drawWidth, drawHeight, offsetX, offsetY

        // "Cover" logic: fill the screen, crop edges
        if (canvasAspect > imgAspect) {
          drawWidth = canvas.width
          drawHeight = canvas.width / imgAspect
          offsetX = 0
          offsetY = (canvas.height - drawHeight) / 2
        } else {
          drawWidth = canvas.height * imgAspect
          drawHeight = canvas.height
          offsetX = (canvas.width - drawWidth) / 2
          offsetY = 0
        }

        ctx.drawImage(drawable, offsetX, offsetY, drawWidth, drawHeight)
      }

      // Report progress to parent
      const rounded = Math.round(progressRef.current * 100)
      if (rounded !== lastReportedRef.current) {
        lastReportedRef.current = rounded
        onProgress?.(progressRef.current)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isReady, onProgress, TOTAL_FRAMES])

  // 4. Handle resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      // Set internal resolution matching logical pixels * scale
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'block',
        backgroundColor: '#050510',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1
      }}
    />
  )
}
