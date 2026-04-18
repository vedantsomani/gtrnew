import React, { useState, useEffect, useRef } from 'react'
import { FAQ_DATA } from '../data/chatbotData.js'

/**
 * FAQ — Full-screen overlay with animated accordion sections.
 */
export default function FAQ({ isOpen, onClose }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const overlayRef = useRef(null)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setActiveIndex(null)
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleToggle = (idx) => {
    setActiveIndex(prev => prev === idx ? null : idx)
  }

  // Build flat list with global index
  let globalIdx = 0
  const sections = FAQ_DATA.map((cat) => ({
    category: cat.category,
    items: cat.items.map((item) => ({ ...item, idx: globalIdx++ }))
  }))

  return (
    <div className={`faq-overlay ${isOpen ? 'faq-open' : ''}`} ref={overlayRef}>
      <div className="faq-backdrop" onClick={onClose} />
      <div className="faq-panel">
        {/* Header */}
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <button className="overlay-close-btn" onClick={onClose} aria-label="Close FAQ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="faq-content">
          {sections.map((section) => (
            <div className="faq-section" key={section.category}>
              <div className="faq-category-label">{section.category}</div>
              {section.items.map((item) => {
                const isActive = activeIndex === item.idx
                return (
                  <div
                    className={`faq-item ${isActive ? 'faq-item-active' : ''}`}
                    key={item.idx}
                  >
                    <button
                      className="faq-question"
                      onClick={() => handleToggle(item.idx)}
                      aria-expanded={isActive}
                    >
                      <span>{item.q}</span>
                      <svg
                        className="faq-chevron"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div className="faq-answer-wrapper">
                      <div className="faq-answer">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
