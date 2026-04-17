import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import exifr from 'exifr'
import { addMemory, type MemoryType } from '../lib/memories'
import { TypePill } from './TypePill'

const TYPES: MemoryType[] = ['trail', 'summit', 'park', 'beach', 'urban']

const inputClass =
  'w-full bg-gs-soft border border-gs-border rounded-xl px-3.5 py-2.5 font-body text-sm text-gs-ink placeholder:text-gs-muted/60 focus:outline-none focus:ring-2 focus:ring-gs-deep/25 focus:border-gs-deep transition-all'

const labelClass = 'font-body font-medium text-xs text-gs-muted block mb-1.5'

const dotIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;background:#4a6358;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  className: '',
})

function MapPickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng) } })
  return null
}

function LocationPicker({ lat, lng, onPick }: { lat: number | null; lng: number | null; onPick: (lat: number, lng: number) => void }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gs-border" style={{ height: 180 }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapPickHandler onPick={onPick} />
        {lat !== null && lng !== null && (
          <Marker position={[lat, lng]} icon={dotIcon} />
        )}
      </MapContainer>
    </div>
  )
}

function formatDateForInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

interface AddMemoryModalProps {
  onClose: () => void
  onSaved: () => void
}

export default function AddMemoryModal({ onClose, onSaved }: AddMemoryModalProps) {
  const [type, setType]         = useState<MemoryType>('trail')
  const [title, setTitle]       = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate]         = useState('')
  const [author, setAuthor]     = useState('')
  const [story, setStory]       = useState('')

  const [imageFile, setImageFile]         = useState<File | null>(null)
  const [preview, setPreview]             = useState<string | null>(null)
  const [lat, setLat]                     = useState<number | null>(null)
  const [lng, setLng]                     = useState<number | null>(null)
  const [locationSource, setLocationSource] = useState<'exif' | 'manual' | null>(null)
  const [extracting, setExtracting]       = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setLat(null)
    setLng(null)
    setLocationSource(null)
    setExtracting(true)

    try {
      const parsed = await exifr.parse(file, { gps: true, pick: ['DateTimeOriginal'] })
      if (parsed?.latitude != null && parsed?.longitude != null) {
        setLat(parsed.latitude)
        setLng(parsed.longitude)
        setLocationSource('exif')
      } else {
        setLocationSource('manual')
      }
      if (parsed?.DateTimeOriginal instanceof Date) {
        setDate(formatDateForInput(parsed.DateTimeOriginal))
      }
    } catch {
      setLocationSource('manual')
    } finally {
      setExtracting(false)
    }
  }

  function removeImage() {
    setImageFile(null)
    setPreview(null)
    setLat(null)
    setLng(null)
    setLocationSource(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !story.trim()) { setError('Title and story are required.'); return }
    if (!imageFile)                      { setError('A photo is required.'); return }
    if (lat === null || lng === null)    { setError('Location is required — click the map below to place your pin.'); return }

    setSaving(true)
    setError(null)
    try {
      await addMemory({
        title: title.trim(),
        location: location.trim() || undefined,
        lat,
        lng,
        date: date || undefined,
        story: story.trim(),
        type,
        author: author.trim() || undefined,
        imageFile,
      })
      onSaved()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(`Failed to save: ${msg}`)
      setSaving(false)
    }
  }

  const canSubmit = !!imageFile && lat !== null && lng !== null && !saving

  return (
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center p-0 sm:p-6 bg-gs-ink/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-white max-h-[100dvh] sm:max-h-[90vh] sm:rounded-2xl overflow-y-auto shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Lime accent bar */}
        <div className="h-1 bg-gs-deep rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3">
          <div>
            <h2 className="font-display font-bold text-xl text-gs-ink leading-tight">Pin a memory</h2>
            <p className="font-body text-xs text-gs-muted mt-0.5">Share a place that matters to you</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gs-soft hover:bg-gs-subtle border border-gs-border rounded-full flex items-center justify-center text-gs-muted hover:text-gs-ink transition-all cursor-pointer flex-shrink-0 text-sm font-body font-medium mt-0.5"
            aria-label="Close"
          >✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4">

          {/* ── Step 1: Photo (mandatory) ── */}
          <div>
            <span className={labelClass}>
              Photo <span className="text-red-400">*</span>
            </span>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={preview} alt="Preview" className="h-44 w-full object-cover" />
                {/* Location status badge */}
                <div className={`absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-body font-medium ${
                  extracting
                    ? 'bg-white/90 text-gs-muted'
                    : locationSource === 'exif'
                    ? 'bg-gs-deep/90 text-white'
                    : 'bg-white/90 text-gs-muted'
                }`}>
                  {extracting && '⏳ Reading location…'}
                  {!extracting && locationSource === 'exif' && `✓ Location found · ${lat!.toFixed(3)}, ${lng!.toFixed(3)}`}
                  {!extracting && locationSource === 'manual' && '📍 No GPS — click map below to place pin'}
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gs-ink text-xs font-body font-medium px-2.5 py-1 rounded-full shadow transition-all cursor-pointer"
                >Remove</button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gs-border rounded-xl p-8 text-center cursor-pointer hover:border-gs-deep hover:bg-gs-soft transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">📷</span>
                <div>
                  <p className="font-body font-medium text-sm text-gs-ink">Upload a photo</p>
                  <p className="font-body text-xs text-gs-muted mt-0.5">Location will be read from the photo automatically</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* ── Manual location picker (shown when no EXIF GPS) ── */}
          {locationSource === 'manual' && (
            <div>
              <span className={labelClass}>
                Place your pin <span className="text-red-400">*</span>
              </span>
              <LocationPicker lat={lat} lng={lng} onPick={(la, lo) => { setLat(la); setLng(lo) }} />
              {lat !== null && (
                <p className="font-body text-xs text-gs-muted mt-1.5">
                  ✓ Placed at {lat.toFixed(4)}, {lng!.toFixed(4)}
                </p>
              )}
            </div>
          )}

          {/* ── Type selector ── */}
          <div className="grid grid-cols-5 gap-2">
            {TYPES.map((t) => (
              <TypePill key={t} type={t} size="md" active={type === t} onClick={() => setType(t)} />
            ))}
          </div>

          {/* ── Form fields ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label>
                <span className={labelClass}>Title <span className="text-red-400">*</span></span>
                <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} placeholder="What do you call this place?" />
              </label>
            </div>
            <div>
              <label>
                <span className={labelClass}>Location name</span>
                <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Banff, Canada" />
              </label>
            </div>
            <div>
              <label>
                <span className={labelClass}>Date visited</span>
                <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>
            <div className="col-span-2">
              <label>
                <span className={labelClass}>Your name</span>
                <input className={inputClass} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Anonymous Explorer" />
              </label>
            </div>
          </div>

          {/* ── Story ── */}
          <div>
            <label>
              <span className={labelClass}>Story <span className="text-red-400">*</span></span>
              <textarea className={`${inputClass} resize-y`} rows={4} value={story} onChange={(e) => setStory(e.target.value)} maxLength={2000} placeholder="Why does this place matter to you?" />
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="font-body font-medium text-sm text-gs-muted px-4 py-2.5 rounded-xl border border-gs-border hover:bg-gs-soft hover:text-gs-ink transition-all cursor-pointer"
            >Cancel</button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="font-body font-medium text-sm text-white bg-gs-deep px-5 py-2.5 rounded-xl hover:bg-gs-ink transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >{saving ? '🌱 Saving…' : '📍 Pin this memory'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
