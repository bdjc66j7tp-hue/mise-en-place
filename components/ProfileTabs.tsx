'use client'
import { useState } from 'react'
import Link from 'next/link'

type Recipe = {
  id: string
  title: string
  photo_url: string | null
  visibility?: string
}

type Props = {
  addedRecipes: Recipe[]
  savedRecipes: Recipe[] | null // null = don't show the Saved tab at all (viewing someone else's profile)
  isOwnProfile: boolean
}

function RecipeGrid({ recipes, isOwnProfile, emptyTitle, emptySubtitle }: {
  recipes: Recipe[]
  isOwnProfile: boolean
  emptyTitle: string
  emptySubtitle: string
}) {
  if (recipes.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: '14px', padding: '40px 24px', border: '0.5px solid #E4DACB', textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '17px', color: '#21201D', marginBottom: '6px' }}>{emptyTitle}</div>
        <div style={{ fontSize: '12px', color: '#7A7468' }}>{emptySubtitle}</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
      {recipes.map((recipe) => {
        const hasPhoto = !!recipe.photo_url
        return (
          <Link key={recipe.id} href={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '0.5px solid #E4DACB', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '100%', height: '160px', background: '#5C6B47', overflow: 'hidden' }}>
                {hasPhoto ? (
                  <img src={recipe.photo_url!} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" fill="none" width="36" height="36">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#F3EDE4" strokeWidth="1.5"/>
                      <circle cx="8" cy="10" r="2" stroke="#F3EDE4" strokeWidth="1.5"/>
                      <path d="M3 16l5-4 4 3 3-4 6 5" stroke="#F3EDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div style={{ padding: '14px 16px 16px', flex: 1 }}>
                {isOwnProfile && recipe.visibility && recipe.visibility !== 'public' && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ display: 'inline-block', fontSize: '9px', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.06em', background: recipe.visibility === 'draft' ? '#F5E6C8' : '#E8D5A8', color: '#21201D', border: '0.5px solid #E4DACB' }}>
                      {recipe.visibility === 'draft' ? 'Draft' : 'Private'}
                    </span>
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '17px', color: '#21201D', fontWeight: '400', marginBottom: '4px', lineHeight: '1.3' }}>{recipe.title}</h3>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function ProfileTabs({ addedRecipes, savedRecipes, isOwnProfile }: Props) {
  const showSavedTab = savedRecipes !== null
  const [tab, setTab] = useState<'added' | 'saved'>('added')

  return (
    <div>
      {showSavedTab && (
        <div style={{ display: 'flex', gap: '4px', background: '#F3EDE4', borderRadius: '10px', padding: '4px', width: 'fit-content', marginBottom: '20px' }}>
          <button
            onClick={() => setTab('added')}
            style={{
              padding: '8px 18px', fontSize: '13px', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontWeight: tab === 'added' ? 600 : 400, fontFamily: 'inherit',
              background: tab === 'added' ? '#5C6B47' : 'transparent',
              color: tab === 'added' ? '#F3EDE4' : '#5C6B47',
            }}
          >
            Added ({addedRecipes.length})
          </button>
          <button
            onClick={() => setTab('saved')}
            style={{
              padding: '8px 18px', fontSize: '13px', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontWeight: tab === 'saved' ? 600 : 400, fontFamily: 'inherit',
              background: tab === 'saved' ? '#5C6B47' : 'transparent',
              color: tab === 'saved' ? '#F3EDE4' : '#5C6B47',
            }}
          >
            Saved ({savedRecipes.length})
          </button>
        </div>
      )}

      {(!showSavedTab || tab === 'added') && (
        <RecipeGrid
          recipes={addedRecipes}
          isOwnProfile={isOwnProfile}
          emptyTitle="No recipes yet"
          emptySubtitle={isOwnProfile ? 'Import your first recipe to get started.' : "This cook hasn't added any recipes."}
        />
      )}

      {showSavedTab && tab === 'saved' && (
        <RecipeGrid
          recipes={savedRecipes}
          isOwnProfile={isOwnProfile}
          emptyTitle="No saved recipes yet"
          emptySubtitle="Tap the heart on any recipe to save it here for quick access."
        />
      )}
    </div>
  )
}
