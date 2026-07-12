// components/TechniqueGallery.tsx
'use client'

import { useState, useMemo } from 'react'
import {
  TECHNIQUES,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type Technique,
} from '@/lib/techniques'

// Palette pulled directly from Education.tsx so this page matches
// the homepage's "Learn culinary technique" section.
const COLORS = {
  bgDeep: '#21201D',
  bgMid: '#5C6B47',
  cream: '#F3EDE4',
  sage: '#7A7468',
  chipText: '#F3EDE4',
  border: '#5C6B47',
}

interface TechniqueGalleryProps {
  selectable?: boolean
  selectedIds?: string[]
  suggestedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  filterIds?: string[]
}

export default function TechniqueGallery({
  selectable = false,
  selectedIds = [],
  suggestedIds = [],
  onSelectionChange,
  filterIds,
}: TechniqueGalleryProps) {
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds))

  const baseList = useMemo(
    () => (filterIds ? TECHNIQUES.filter((t) => filterIds.includes(t.id)) : TECHNIQUES),
    [filterIds]
  )

  const filtered = useMemo(() => {
    if (!query.trim()) return baseList
    const q = query.toLowerCase()
    return baseList.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    )
  }, [query, baseList])

  function toggle(id: string) {
    if (!selectable) {
      setOpenId(openId === id ? null : id)
      return
    }
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
    onSelectionChange?.(Array.from(next))
  }

  function openDefinition(id: string) {
    setOpenId(id)
  }

  const openTechnique = openId ? TECHNIQUES.find((t) => t.id === openId) : null

  return (
    <div style={{ fontFamily: 'var(--font-montserrat), Arial, Helvetica, sans-serif' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto 40px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search techniques..."
          style={{
            width: '100%',
            padding: '12px 18px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.border}`,
            background: '#FFFFFF',
            fontSize: '14px',
            color: COLORS.bgDeep,
            outline: 'none',
          }}
        />
      </div>

      {selectable && (
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto 28px',
            textAlign: 'center',
            fontSize: '13px',
            color: COLORS.sage,
          }}
        >
          {suggestedIds.length > 0 && (
            <p style={{ marginBottom: '4px' }}>
              We picked out a few techniques that look like a strong match for this recipe -- check the ones that fit, uncheck anything that doesn't, and add any more from the list below.
            </p>
          )}
        </div>
      )}

      {CATEGORY_ORDER.map((category) => {
        const items = filtered.filter((t) => t.category === category)
        if (items.length === 0) return null

        return (
          <section key={category} style={{ marginBottom: '36px' }}>
            <p
              style={{
                fontSize: '12px',
                color: COLORS.bgDeep,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                marginBottom: '12px',
                textAlign: 'center',
              }}
            >
              {CATEGORY_LABELS[category]}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '7px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {items.map((t) => (
                <TechniquePill
                  key={t.id}
                  technique={t}
                  selectable={selectable}
                  isSelected={selected.has(t.id)}
                  isSuggested={suggestedIds.includes(t.id)}
                  onToggle={() => toggle(t.id)}
                  onOpenDefinition={() => openDefinition(t.id)}
                />
              ))}
            </div>
          </section>
        )
      })}

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: COLORS.sage, fontSize: '14px' }}>
          No techniques match "{query}".
        </p>
      )}

      {openTechnique && (
        <TechniquePopup
          technique={openTechnique}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  )
}

function TechniquePill({
  technique,
  selectable,
  isSelected,
  isSuggested,
  onToggle,
  onOpenDefinition,
}: {
  technique: Technique
  selectable: boolean
  isSelected: boolean
  isSuggested: boolean
  onToggle: () => void
  onOpenDefinition: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: isSelected ? COLORS.border : COLORS.bgDeep,
        color: isSelected ? '#FFFFFF' : COLORS.chipText,
        fontSize: '12px',
        padding: '6px 8px 6px 13px',
        borderRadius: '20px',
        border: `0.5px solid ${isSuggested && !isSelected ? COLORS.cream : COLORS.border}`,
        cursor: 'pointer',
      }}
    >
      {selectable && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          style={{ cursor: 'pointer', accentColor: COLORS.border }}
          aria-label={`Select ${technique.name}`}
        />
      )}
      <button
        type="button"
        onClick={onOpenDefinition}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          font: 'inherit',
          cursor: 'pointer',
          padding: '4px 6px',
        }}
      >
        {technique.name}
      </button>
    </div>
  )
}

function TechniquePopup({
  technique,
  onClose,
}: {
  technique: Technique
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={technique.name}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(33, 32, 29, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '82vh',
          overflowY: 'auto',
          padding: '32px 28px',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: COLORS.sage,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '24px',
            color: COLORS.bgDeep,
            marginBottom: '6px',
            paddingRight: '24px',
          }}
        >
          {technique.name}
        </h3>

        {/* Category label */}
        <p style={{ fontSize: '11px', color: COLORS.border, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px', fontWeight: 600 }}>
          {CATEGORY_LABELS[technique.category]}
        </p>

        {/* Definition */}
        <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#3A3A3A', marginBottom: '22px' }}>
          {technique.definition}
        </p>

        {/* How-to steps */}
        {technique.steps && technique.steps.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: COLORS.bgMid, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '12px' }}>
              How to do it
            </p>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {technique.steps.map((step, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: COLORS.bgDeep,
                      color: '#F3EDE4',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: 1.65, color: '#3A3A3A' }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Often confused with */}
        {technique.confusedWith && (
          <div
            style={{
              fontSize: '13px',
              lineHeight: 1.6,
              color: COLORS.bgDeep,
              background: '#F3EDE4',
              borderLeft: `3px solid ${COLORS.border}`,
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: technique.videoUrl ? '16px' : '0',
            }}
          >
            <strong>Often confused with:</strong> {technique.confusedWith}
          </div>
        )}

        {/* Video link */}
        {technique.videoUrl && (
          <a
            href={technique.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: technique.confusedWith ? '14px' : '4px',
              fontSize: '13px',
              fontWeight: 600,
              color: COLORS.bgDeep,
              background: '#F3EDE4',
              padding: '8px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
              border: `1px solid ${COLORS.border}`,
            }}
          >
            ▶ Watch how to do it
            {technique.videoSourceLabel ? ` — ${technique.videoSourceLabel}` : ''}
          </a>
        )}
      </div>
    </div>
  )
}