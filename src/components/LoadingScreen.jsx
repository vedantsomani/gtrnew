import React, { useState, useEffect } from 'react'

export default function LoadingScreen({ onFinished }) {
  const [progress, setProgress] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Simulate a minimum loading delay so the screen doesn't flash
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setHidden(true)
            setTimeout(() => onFinished?.(), 800)
          }, 400)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [onFinished])

  return (
    <div className={`loading-screen ${hidden ? 'hidden' : ''}`}>
      <div className="loading-logo">IoT &amp; Robotics</div>
      <div className="loading-bar-track">
        <div
          className="loading-bar-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="loading-text">Loading Experience...</div>
    </div>
  )
}
