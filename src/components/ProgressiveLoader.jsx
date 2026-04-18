import React, { useState, useEffect, useRef } from 'react'

export default function ProgressiveLoader({ progress = 0, isReady = false }) {
  const [shouldHide, setShouldHide] = useState(false)
  const [removed, setRemoved] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (isReady) {
      const t1 = setTimeout(() => setShouldHide(true), 300)
      const t2 = setTimeout(() => setRemoved(true), 1200)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isReady])

  if (removed) return null

  return (
    <div
      ref={containerRef}
      className={`progressive-loader ${shouldHide ? 'fade-out' : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: '#050510',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.8s ease, visibility 0.8s ease'
      }}
    >
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 800,
        fontSize: '3rem',
        letterSpacing: '0.2em',
        color: 'white',
        marginBottom: '20px',
        animation: 'pulse 2s infinite'
      }}>
        GTR <span style={{ color: '#00cec9' }}>2026</span>
      </div>
      
      <div style={{
        width: '280px',
        height: '2px',
        background: 'rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${Math.min(progress, 100)}%`,
          background: 'linear-gradient(90deg, #6c5ce7, #00cec9)',
          transition: 'width 0.2s ease',
          boxShadow: '0 0 10px rgba(0, 206, 201, 0.5)'
        }} />
      </div>

      <div style={{
        marginTop: '16px',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.8rem',
        letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase'
      }}>
        Initializing Engine — {Math.round(progress)}%
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; text-shadow: 0 0 20px rgba(0, 206, 201, 0.3); }
        }
        .fade-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
