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
  image.src = imageSrc
  await new Promise((resolve) => { image.onload = resolve })

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
  const [message, setMessage] = useState('')
  const [editingSrc, setEditingSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // A "user photo" is anything stored in our Supabase bucket.
  // We don't display imported source photos (CloudFront, etc.) — only owner uploads.
  const hasUserPhoto = currentPhoto && currentPhoto.includes('supabase')

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

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
        setCurrentPhoto(data.photo_url)
        setEditingSrc(null)
      } else {
        setMessage(data.error || 'Upload failed. Please try again.')
      }
    } catch {
      setMessage('Upload failed. Please try again.')
    }
    setUploading(false)
  }

  function handleCancelCrop() {
    setEditingSrc(null)
    setMessage('')
  }

  // CROP MODAL (only owners can reach this)
  if (editingSrc) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid rgba(151,196,89,0.3)' }}>
          <button onClick={handleCancelCrop} disabled={uploading} style={{ background: 'none', border: 'none', color: '#97C459', fontSize: '14px', cursor: 'pointer', padding: '4px 8px' }}>Cancel</button>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontStyle: 'italic', color: '#C0DD97' }}>Position your photo</div>
          <button onClick={handleSaveCrop} disabled={uploading} style={{ background: '#97C459', border: 'none', color: '#27500A', fontSize: '13px', fontWeight: 600, cursor: uploading ? 'wait' : 'pointer', padding: '6px 14px', borderRadius: '6px' }}>{uploading ? 'Saving...' : 'Save'}</button>
        </div>
        <div style={{ position: 'relative', flex: 1, background: '#000' }}>
          <Cropper image={editingSrc} crop={crop} zoom={zoom} aspect={16 / 10} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} objectFit="contain" showGrid={false} />
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', borderTop: '0.5px solid rgba(151,196,89,0.3)' }}>
          <div style={{ fontSize: '12px', color: '#97C459', textAlign: 'center' }}>Drag to reposition · Pinch or use slider to zoom</div>
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: '100%', maxWidth: '300px', accentColor: '#97C459' }} />
          {message && <div style={{ fontSize: '12px', color: '#FFB4B4' }}>{message}</div>}
        </div>
      </div>
    )
  }

  // PHOTO EXISTS (uploaded by owner) — show to everyone, change-button only for owner
  if (hasUserPhoto) {
    return (
      <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: '#3B6D11' }}>
        <img src={currentPhoto!} alt={recipeTitle} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {isOwner && (
          <>
            <label htmlFor={`photo-input-${recipeId}`} style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(39,80,10,0.85)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#C0DD97', cursor: 'pointer', display: 'inline-block' }}>Change photo</label>
            <input id={`photo-input-${recipeId}`} type="file" accept="image/*" onChange={handleFilePick} style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }} />
          </>
        )}
      </div>
    )
  }

  // NO PHOTO + OWNER — show upload UI
  if (isOwner) {
    return (
      <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: '12px', background: '#3B6D11', border: '0.5px solid #639922', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', position: 'relative' }}>
        <svg viewBox="0 0 24 24" fill="none" width="32" height="32" style={{ marginBottom: '12px' }}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#97C459" strokeWidth="1.5"/>
          <circle cx="8" cy="10" r="2" stroke="#97C459" strokeWidth="1.5"/>
          <path d="M3 16l5-4 4 3 3-4 6 5" stroke="#97C459" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ fontSize: '13px', color: '#C0DD97', fontWeight: 500, marginBottom: '4px' }}>Add a photo of your dish</div>
        <div style={{ fontSize: '11px', color: '#97C459', lineHeight: 1.5, marginBottom: '14px', maxWidth: '320px' }}>Show off what you made. Your photo replaces this placeholder for everyone viewing this recipe.</div>
        <label htmlFor={`photo-input-${recipeId}`} style={{ display: 'inline-block', background: '#EAF3DE', color: '#27500A', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>+ Add photo</label>
        <input id={`photo-input-${recipeId}`} type="file" accept="image/*" onChange={handleFilePick} style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }} />
        {message && <div style={{ fontSize: '11px', color: '#FFB4B4', marginTop: '10px' }}>{message}</div>}
      </div>
    )
  }

  // NO PHOTO + NOT OWNER — clean placeholder, no button
  return (
    <div style={{ width: '100%', aspectRatio: '16 / 10', borderRadius: '12px', background: '#3B6D11', border: '0.5px solid #639922', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32" style={{ marginBottom: '12px', opacity: 0.5 }}>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#97C459" strokeWidth="1.5"/>
        <circle cx="8" cy="10" r="2" stroke="#97C459" strokeWidth="1.5"/>
        <path d="M3 16l5-4 4 3 3-4 6 5" stroke="#97C459" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontSize: '12px', color: '#97C459', fontStyle: 'italic' }}>Photo coming soon</div>
    </div>
  )
}