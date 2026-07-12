'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type Comment = {
  id: string
  author_name: string
  content: string
  created_at: string
}

type Props = {
  recipeId: string
  /** Supabase user.id — null when logged out */
  userId: string | null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function Comments({ recipeId, userId }: Props) {
  const [comments, setComments]   = useState<Comment[]>([])
  const [loading, setLoading]     = useState(true)
  const [text, setText]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const textareaRef               = useRef<HTMLTextAreaElement>(null)

  // ── Load comments on mount ──────────────────────────────
  useEffect(() => {
    fetch(`/api/comments?recipeId=${recipeId}`)
      .then(r => r.json())
      .then((data: Comment[]) => {
        setComments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [recipeId])

  // ── Auto-resize textarea ────────────────────────────────
  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }

  // ── Submit ──────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, content: trimmed }),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body.error ?? 'Something went wrong.')
        return
      }

      const newComment: Comment = await res.json()
      setComments(prev => [newComment, ...prev])
      setText('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const charCount = text.length
  const overLimit = charCount > 2000

  return (
    <div style={{
      background: 'white',
      borderRadius: '14px',
      padding: '24px',
      border: '0.5px solid #E4DACB',
      marginBottom: '16px',
    }}>
      {/* Header */}
      <h2 style={{
        fontSize: '13px', fontWeight: 500, color: '#21201D',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginTop: 0, marginBottom: '20px',
      }}>
        Comments {!loading && comments.length > 0 && (
          <span style={{ color: '#7A7468', fontWeight: 400 }}>· {comments.length}</span>
        )}
      </h2>

      {/* Comment form — logged in */}
      {userId ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="Share a tip, question, or how it turned out…"
            rows={3}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #E4DACB',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '14px',
              fontFamily: 'inherit',
              color: '#21201D',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              background: '#F3EDE4',
              overflow: 'hidden',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = '#5C6B47' }}
            onBlur={e => { e.target.style.borderColor = '#E4DACB' }}
            maxLength={2100}
          />

          {/* Char counter + submit row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: overLimit ? '#c0392b' : '#7A7468' }}>
              {charCount}/2000
            </span>
            <button
              type="submit"
              disabled={submitting || !text.trim() || overLimit}
              style={{
                background: submitting || !text.trim() || overLimit ? '#E4DACB' : '#5C6B47',
                color: submitting || !text.trim() || overLimit ? '#7A7468' : '#F3EDE4',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: submitting || !text.trim() || overLimit ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {submitting ? 'Posting…' : 'Post comment'}
            </button>
          </div>

          {error && (
            <p style={{ fontSize: '13px', color: '#c0392b', marginTop: '8px', marginBottom: 0 }}>
              {error}
            </p>
          )}
        </form>
      ) : (
        /* Login nudge — guests */
        <div style={{
          background: '#F3EDE4',
          border: '0.5px solid #E4DACB',
          borderRadius: '10px',
          padding: '14px 16px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#5A564D',
        }}>
          <Link href="/signin" style={{ color: '#21201D', fontWeight: 600, textDecoration: 'underline' }}>
            Sign in
          </Link>
          {' '}to leave a comment.
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <p style={{ fontSize: '13px', color: '#7A7468', fontStyle: 'italic' }}>Loading…</p>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#7A7468', fontStyle: 'italic', margin: 0 }}>
          No comments yet. {userId ? 'Be the first!' : ''}
        </p>
      ) : (
        <div>
          {comments.map((c, i) => (
            <div
              key={c.id}
              style={{
                paddingTop: i === 0 ? 0 : '16px',
                paddingBottom: '16px',
                borderBottom: i < comments.length - 1 ? '0.5px solid #E4DACB' : 'none',
              }}
            >
              {/* Avatar + name + date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                {/* Initials avatar */}
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: '#5C6B47', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '11px', color: '#F3EDE4',
                  fontWeight: 600, flexShrink: 0, letterSpacing: '0.02em',
                }}>
                  {c.author_name
                    .split(' ')
                    .slice(0, 2)
                    .map(w => w[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#21201D' }}>
                    {c.author_name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#7A7468', marginLeft: '8px' }}>
                    {formatDate(c.created_at)}
                  </span>
                </div>
              </div>

              {/* Comment body */}
              <p style={{
                fontSize: '14px', color: '#5A564D', lineHeight: 1.65,
                margin: 0, paddingLeft: '40px',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
