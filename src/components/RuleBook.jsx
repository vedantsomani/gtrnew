import React, { useState, useEffect, useRef } from 'react'
import { RULEBOOK_SECTIONS } from '../data/chatbotData.js'

/**
 * RuleBook — Full-screen modal overlay with TOC and scrollable sections.
 */
export default function RuleBook({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('overview')
  const contentRef = useRef(null)
  const sectionRefs = useRef({})

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setActiveSection('overview')
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

  const scrollToSection = (id) => {
    setActiveSection(id)
    const el = sectionRefs.current[id]
    if (el && contentRef.current) {
      contentRef.current.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth'
      })
    }
  }

  // Track active section on scroll
  useEffect(() => {
    const container = contentRef.current
    if (!container || !isOpen) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop + 100
      let current = 'overview'
      for (const section of RULEBOOK_SECTIONS) {
        const el = sectionRefs.current[section.id]
        if (el && el.offsetTop <= scrollTop) {
          current = section.id
        }
      }
      setActiveSection(current)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [isOpen])

  /** Render markdown-like bold text */
  const renderText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className={`rulebook-overlay ${isOpen ? 'rulebook-open' : ''}`}>
      <div className="rulebook-backdrop" onClick={onClose} />
      <div className="rulebook-panel">
        {/* Header */}
        <div className="rulebook-header">
          <h2 className="rulebook-title">📖 Rule Book</h2>
          <button className="overlay-close-btn" onClick={onClose} aria-label="Close Rule Book">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="rulebook-body">
          {/* TOC Sidebar */}
          <aside className="rulebook-toc">
            <div className="rulebook-toc-title">Contents</div>
            {RULEBOOK_SECTIONS.map(section => (
              <button
                key={section.id}
                className={`rulebook-toc-item ${activeSection === section.id ? 'toc-active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                <span className="toc-icon">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="rulebook-content" ref={contentRef}>
            {RULEBOOK_SECTIONS.map(section => (
              <section
                key={section.id}
                ref={el => sectionRefs.current[section.id] = el}
                className="rulebook-section"
                id={`rule-${section.id}`}
              >
                <h3 className="rulebook-section-title">
                  <span className="section-icon">{section.icon}</span>
                  {section.title}
                </h3>
                <div className="rulebook-section-body">
                  {section.content.map((line, i) => (
                    <p key={i} className="rulebook-line">
                      {renderText(line)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
