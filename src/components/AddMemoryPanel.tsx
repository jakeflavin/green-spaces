import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import exifr from 'exifr'
import { addMemory, type MemoryType } from '../lib/memories'
import { TypePill } from './TypePill'

const TYPES: MemoryType[] = ['trail', 'summit', 'park', 'beach', 'urban']

const inputClass =
  'w-full bg-white dark:bg-gs-soft-dark border border-gs-border dark:border-gs-border-dark rounded-xl px-3.5 py-2.5 font-body text-sm text-gs-ink dark:text-gs-ink-dark placeholder:text-gs-muted/60 dark:placeholder:text-gs-muted-dark/70 focus:outline-none focus:ring-2 focus:ring-gs-deep/25 dark:focus:ring-gs-muted-dark/25 focus:border-gs-deep dark:focus:border-gs-muted-dark transition-all'

const labelClass = 'font-body font-medium text-xs text-gs-muted dark:text-gs-muted-dark block mb-1.5'

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

function LocationPicker({
  lat,
  lng,
  onPick,
  isDark,
}: {
  lat: number | null
  lng: number | null
  onPick: (lat: number, lng: number) => void
  isDark: boolean
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-gs-border dark:border-gs-border-dark" style={{ height: 180 }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'}
          url={isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'}
          subdomains="abcd"
        />
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

interface AddMemoryPanelProps {
  isDark: boolean
  onSaved: () => void
}

export default function AddMemoryPanel({ isDark, onSaved }: AddMemoryPanelProps) {
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
      const parsed = await exifr.parse(file, {
        gps: true,
        pick: ['DateTimeOriginal', 'GPSLatitude', 'GPSLongitude', 'GPSLatitudeRef', 'GPSLongitudeRef'],
      })
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
    <>
      <form onSubmit={handleSubmit} className="px-5 pt-4 pb-5 space-y-4">

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
                  ? 'bg-white/90 dark:bg-gs-surface-dark/90 text-gs-muted dark:text-gs-muted-dark'
                  : locationSource === 'exif'
                  ? 'bg-gs-deep/90 dark:bg-gs-soft-dark/90 text-white dark:text-gs-ink-dark'
                  : 'bg-white/90 dark:bg-gs-surface-dark/90 text-gs-muted dark:text-gs-muted-dark'
              }`}>
                {extracting && '⏳ Reading location…'}
                {!extracting && locationSource === 'exif' && `✓ Location found · ${lat!.toFixed(3)}, ${lng!.toFixed(3)}`}
                {!extracting && locationSource === 'manual' && '📍 No GPS — click map below to place pin'}
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white dark:bg-gs-surface-dark/90 dark:hover:bg-gs-surface-dark text-gs-ink dark:text-gs-ink-dark text-xs font-body font-medium px-2.5 py-1 rounded-full shadow transition-all cursor-pointer"
              >Remove</button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gs-border dark:border-gs-border-dark rounded-xl p-8 text-center cursor-pointer hover:border-gs-deep dark:hover:border-gs-muted-dark hover:bg-gs-soft dark:hover:bg-gs-soft-dark transition-all group">
              <span className="text-3xl group-hover:scale-110 transition-transform">📷</span>
              <div>
                <p className="font-body font-medium text-sm text-gs-ink dark:text-gs-ink-dark">Upload a photo</p>
                <p className="font-body text-xs text-gs-muted dark:text-gs-muted-dark mt-0.5">Location will be read from the photo automatically</p>
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
            <LocationPicker lat={lat} lng={lng} onPick={(la, lo) => { setLat(la); setLng(lo) }} isDark={isDark} />
            {lat !== null && (
              <p className="font-body text-xs text-gs-muted dark:text-gs-muted-dark mt-1.5">
                ✓ Placed at {lat.toFixed(4)}, {lng!.toFixed(4)}
              </p>
            )}
          </div>
        )}

        {/* ── Type selector ── */}
        <div className="grid grid-cols-3 gap-2 justify-center">
          {TYPES.map((t) => (
            <TypePill key={t} type={t} size="md" active={type === t} onClick={() => setType(t)} />
          ))}
        </div>

        {/* ── Form fields ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
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
          <div className="min-w-0">
            <label>
              <span className={labelClass}>Date visited</span>
              <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>
          <div className="sm:col-span-2">
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
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl px-3.5 py-2.5">
            <p className="font-body text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className="font-body font-medium text-sm text-white dark:text-gs-night bg-gs-deep dark:bg-gs-ink-dark px-5 py-2.5 rounded-xl hover:bg-gs-ink dark:hover:bg-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm w-full"
          >{saving ? '🌱 Saving…' : '📍 Pin this memory'}</button>
        </div>
      </form>
    </>
  )
}
