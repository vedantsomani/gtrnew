import React from 'react'

export default function HUD({ scrollProgress = 0 }) {
  // Show the register button when scroll reaches ~95% (near last frame)
  const showRegister = scrollProgress >= 0.92

  return (
    <div className="hud-overlay">
      {/* ── Logo ── */}
      <div className="hud-top">
        <div className="hud-logo" id="site-logo">IoT &amp; Robotics Club</div>
      </div>

      {/* ── Register Button — pops up at the end of scroll ── */}
      <div className={`register-popup ${showRegister ? 'visible' : ''}`}>
        <a
          href="https://unstop.com/o/1mBACUO?lb=PTE7q0Dz&utm_medium=Share&utm_source=ctazqbso53950&utm_campaign=Competitions"
          target="_blank"
          rel="noopener noreferrer"
          className="register-btn"
          id="register-btn"
        >
          <span className="register-btn-glow" />
          <span className="register-btn-text">
            🏁 Register Now
          </span>
        </a>
      </div>
    </div>
  )
}
