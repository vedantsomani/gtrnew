import React, { useState, useEffect } from 'react'

export default function LoadingScreen({ progress = 0, onFinished }) {
  const [shouldHide, setShouldHide] = useState(false)

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setShouldHide(true)
        setTimeout(() => onFinished?.(), 800)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [progress, onFinished])

  return (
    <div className={`loading-screen ${shouldHide ? 'hidden' : ''}`}>
      <div className="loading-logo">IoT &amp; Robotics</div>
      <div className="loading-bar-track">
        <div
          className="loading-bar-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="loading-text">Loading Assets {progress}%</div>
    </div>
  )
}
