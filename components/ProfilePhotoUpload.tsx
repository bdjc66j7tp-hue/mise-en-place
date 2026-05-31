'use client'

import { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'

interface Props {
  currentPhotoUrl: string | null
  onUploaded: (newUrl: string) => void
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

export default function ProfilePhotoUpload({ currentPhotoUrl, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [editingSrc, setEditingSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

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
      formData.append('file', blob, 'profile.jpg')
      const response = await fetch('/api/upload-profile-photo', { method: 'POST', body: formData })
      const data = await response.json()
      if (data.profile_photo_url) {
        onUploaded(data.profile_photo_url)
        setEditingSrc(null)
      } else {
        setMessage('Upload failed. Please try again.')
      }
    } catch (err) {
      setMessage('Upload failed. Please try again.')
    }
    setUploading(false)
  }

  if (editingSrc) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '0.5px solid rgba(151,196,89,0.3)' }}>
          <button onClick={() => setEditingSrc(null)} disabled={uploading} style={{ background: 'none', border: 'none', color: '#97C459', fontSize: '14px', cursor: 'pointer', padding: '4px 8px' }}>Cancel</button>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', fontStyle: 'italic', color: '#C0DD97' }}>Profile photo</div>
          <button onClick={handleSaveCrop} disabled={uploading} style={{ background: '#97C459', border: 'none', color: '#27500A', fontSize: '13px', fontWeight: '600', cursor: uploading ? 'wait' : 'pointer', padding: '6px 14px', borderRadius: '6px' }}>{uploading ? 'Saving...' : 'Save'}</button>
        </div>
        <div style={{ position: 'relative', flex: 1, background: '#000' }}>
          <Cropper image={editingSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round" onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} objectFit="contain" showGrid={false} />
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', borderTop: '0.5px solid rgba(151,196,89,0.3)' }}>
          <div style={{ fontSize: '12px', color: '#97C459', textAlign: 'center' }}>Drag to reposition · Pinch or use slider to zoom</div>
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: '100%', maxWidth: '300px', accentColor: '#97C459' }} />
          {message && <div style={{ fontSize: '12px', color: '#FFB4B4' }}>{message}</div>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#27500A', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '0.5px solid #C0DD97' }}>
        {currentPhotoUrl ? (
          <img src={currentPhotoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#97C459" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>
      <div>
        <label htmlFor="profile-photo-input" style={{ display: 'inline-block', background: 'white', color: '#3B6D11', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: '0.5px solid #C0DD97' }}>
          {currentPhotoUrl ? 'Change photo' : 'Add photo'}
        </label>
        <input id="profile-photo-input" type="file" accept="image/*" onChange={handleFilePick} style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }} />
        {message && <div style={{ fontSize: '11px', color: '#B33', marginTop: '6px' }}>{message}</div>}
      </div>
    </div>
  )
}