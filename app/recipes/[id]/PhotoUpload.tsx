'use client'

import { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'

interface Props {
  recipeId: string
  photoUrl: string | null
  recipeTitle: string
  isOwner: boolean
}

async function getCroppedImage(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = imageSrc
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('Image failed to load'))
  })

  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No canvas context')

  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => { if (blob) resolve(blob); else reject(new Error('Canvas is empty')) }, 'image/jpeg', 0.92)
  })
}

export default function PhotoUpload({ recipeId, photoUrl, recipeTitle, isOwner }: Props) {
  const [currentPhoto, setCurrentPhoto] = useState(photoUrl)
  const [uploading, setUploading] = useState(false)
  const [loadingForEdit, setLoadingForEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [editingSrc, setEditingSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const hasPhoto = !!currentPhoto

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  // Fetches the current photo (through image-proxy if cross-origin),
  // converts to a blob URL, and opens the cropper. Blob URLs are
  // same-origin so the cropper canvas can read them without CORS issues.
  async function openCropperWithCurrentPhoto() {
    if (!currentPhoto) return
    setLoadingForEdit(true)
    setMessage('Loading photo...')

    try {
      let fetchUrl = currentPhoto
      try {
        const parsed = new URL(currentPhoto)
        const sameOrigin =
          parsed.hostname.includes('supabase') ||
          parsed.hostname === window.location.hostname
        if (!sameOrigin) {
          fetchUrl = `/api/image-proxy?url=${encodeURIComponent(currentPhoto)}`
        }
      } catch {
        setMessage('Invalid photo URL')
        setLoadingForEdit(false)
        return
      }

      const response = await fetch(fetchUrl)
      if (!response.ok) {
        setMessage(`Fetch failed: status ${response.status}`)
        setLoadingForEdit(false)
        return
      }
      const blob = await response.blob()
      if (blob.size === 0) {
        setMessage('Photo loaded but is empty')
        setLoadingForEdit(false)
        return
      }
      const blobUrl = URL.createObjectURL(blob)
      setEditingSrc(blobUrl)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setMessage('')
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : 'unknown'}`)
    }
    setLoadingForEdit(false)
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setEditingSrc(reader.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setMessage('')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function handleSaveCrop() {
    if (!editingSrc || !croppedAreaPixels) return
    setUploading(true)
    setMessage('')
    try {
      const blob = await getCroppedImage(editingSrc, croppedAreaPixels)
      const formData = new FormData()
      formData.append('file', blob, 'photo.jpg')
      formData.append('recipeId', recipeId)
      const response = await fetch('/api/upload-photo', { method: 'POST', body: formData })
      const data = await response.json()
      if (response.ok && data.photo_url) {
        // Revoke blob URL to free memory
        if (editingSrc.startsWith('blob:')) URL.revokeObjectURL(editingSrc)
        setCurrentPhoto(data.photo_url)
        setEditingSrc(null)
      } else {
        setMessage(data.error || 'Save failed. Please try again.')
      }
    } catch {
      setMessage('Save failed. Please try again.')
    }
    setUploading(false)
  }

  function handleCancelCrop() {
    if (editingSrc && editingSrc.startsWith('blob:')) URL.revokeObjectURL(editingSrc)
    setEditingSrc(null)
    setMessage('')
  }

  // CROP MODAL (only owners reach this)
  if (editingSrc) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid rgba(220,224,210,0.3)' }}>
          <button onClick={handleCancelCrop} disabled={uploading} style={{ background: 'none', border: 'none', color: '#DCE0D2', fontSize: '14px', cursor: 'pointer', padding: '4px 8px' }}>Cancel</button>
          <div style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '15px', color: '#F3EDE4' }}>Position your photo</div>
          <button onClick={handleSaveCrop} disabled={uploading} style={{ background: '#C99A3D', border: 'none', color: '#21201D', fontSize: '13px', fontWeight: 600, cursor: uploading ? 'wait' : 'pointer', padding: '6px 14px', borderRadius: '6px' }}>{uploading ? 'Saving...' : 'Save'}</button>
        </div>
        <div style={{ position: 'relative', flex: 1, background: '#000' }}>
          <Cropper image={editingSrc} crop={crop} zoom={zoom} aspect={16 / 10} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} objectFit="contain" showGrid={false} />
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', borderTop: '0.5px solid rgba(220,224,210,0.3)' }}>
          <div style={{ fontSize: '12px', color: '#DCE0D2', textAlign: 'center' }}>Drag to reposition · Pinch or use slider to zoom</div>
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: '100%', maxWidth: '300px', accentColor: '#C99A3D' }} />
          <label htmlFor={`photo-input-${recipeId}`} style={{ fontSize: '12px', color: '#DCE0D2', textDecoration: 'underline', cursor: 'pointer', marginTop: '4px' }}>
            Use a different photo
          </label>
          <input id={`photo-input-${recipeId}`} type="file" accept="image/*" onChange={handleFilePick} style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }} />
          {message && <div style={{ fontSize: '12px', color: '#FFB4B4' }}>{message}</div>}
        </div>
      </div>
    )
  }

  // PHOTO EXISTS — show to everyone, "Edit photo" button only for owner
  if (hasPhoto) {
    return (
      <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: '#5C6B47' }}>
        <img src={currentPhoto!} alt={recipeTitle} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {isOwner && (
          <button
            onClick={openCropperWithCurrentPhoto}
            disabled={loadingForEdit}
            style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(33,32,29,0.85)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#F3EDE4', cursor: loadingForEdit ? 'wait' : 'pointer', border: 'none', fontFamily: 'inherit' }}
          >
            {loadingForEdit ? 'Loading...' : 'Edit photo'}
          </button>
        )}
        {message && <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.8)', color: '#FFB4B4', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>{message}</div>}
      </div>
    )
  }

  // NO PHOTO + OWNER — upload UI
  if (isOwner) {
    return (
      <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: '12px', background: '#5C6B47', border: '0.5px solid #4A5639', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', position: 'relative' }}>
        <svg viewBox="0 0 24 24" fill="none" width="32" height="32" style={{ marginBottom: '12px' }}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#F3EDE4" strokeWidth="1.5"/>
          <circle cx="8" cy="10" r="2" stroke="#F3EDE4" strokeWidth="1.5"/>
          <path d="M3 16l5-4 4 3 3-4 6 5" stroke="#F3EDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ fontSize: '13px', color: '#F3EDE4', fontWeight: 500, marginBottom: '4px' }}>Add a photo of your dish</div>
        <div style={{ fontSize: '11px', color: '#DCE0D2', lineHeight: 1.5, marginBottom: '14px', maxWidth: '320px' }}>Show off what you made. Your photo replaces this placeholder for everyone viewing this recipe.</div>
        <label htmlFor={`photo-input-${recipeId}`} style={{ display: 'inline-block', background: '#F3EDE4', color: '#21201D', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+ Add photo</label>
        <input id={`photo-input-${recipeId}`} type="file" accept="image/*" onChange={handleFilePick} style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }} />
        {message && <div style={{ fontSize: '11px', color: '#FFB4B4', marginTop: '10px' }}>{message}</div>}
      </div>
    )
  }

  // NO PHOTO + NOT OWNER
  return (
    <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: '12px', background: '#5C6B47', border: '0.5px solid #4A5639', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32" style={{ marginBottom: '12px', opacity: 0.5 }}>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#F3EDE4" strokeWidth="1.5"/>
        <circle cx="8" cy="10" r="2" stroke="#F3EDE4" strokeWidth="1.5"/>
        <path d="M3 16l5-4 4 3 3-4 6 5" stroke="#F3EDE4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontSize: '12px', color: '#DCE0D2', fontStyle: 'italic' }}>Photo coming soon</div>
    </div>
  )
}