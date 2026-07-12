'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  recipeId: string
  initialFavorited: boolean
  userId: string | null
  // 'card'   — small circular overlay for gallery/grid thumbnails
  // 'detail' — labeled pill button for the single recipe page
  variant?: 'card' | 'detail'
}

export default function FavoriteButton({ recipeId, initialFavorited, userId, variant = 'detail' }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()   // cards are wrapped in a <Link> — don't navigate
    e.stopPropagation()

    if (!userId) {
      router.push('/signin')
      return
    }
    if (pending) return

    const next = !favorited
    setFavorited(next) // optimistic
    setPending(true)

    try {
      const res = next
        ? await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipe_id: recipeId }),
          })
        : await fetch(`/api/favorites?recipe_id=${recipeId}`, { method: 'DELETE' })

      if (!res.ok) throw new Error('Favorite request failed')
    } catch (err) {
      console.error(err)
      setFavorited(!next) // revert on failure
    } finally {
      setPending(false)
    }
  }

  const heart = (
    <svg
      width={variant === 'card' ? 16 : 18}
      height={variant === 'card' ? 16 : 18}
      viewBox="0 0 24 24"
      fill={favorited ? '#E0554F' : 'none'}
      stroke={favorited ? '#E0554F' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  )

  if (variant === 'card') {
    return (
      <button
        onClick={toggle}
        aria-label={favorited ? 'Remove from favorites' : 'Save recipe'}
        title={favorited ? 'Remove from favorites' : 'Save recipe'}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 2,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(33, 32, 29, 0.55)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#F3EDE4',
        }}
      >
        {heart}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      aria-label={favorited ? 'Remove from favorites' : 'Save recipe'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: favorited ? '#5C6B47' : 'transparent',
        border: favorited ? '0.5px solid #5C6B47' : '0.5px solid #D6C9AF',
        borderRadius: '8px',
        padding: '8px 14px',
        cursor: 'pointer',
        color: favorited ? '#F3EDE4' : '#5C6B47',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'inherit',
      }}
    >
      {heart}
      {favorited ? 'Saved' : 'Save'}
    </button>
  )
}
