import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import type { LatLngBounds } from 'leaflet'
import type { Memory, MemoryType } from '../../types/memory'
import MemoryCard from './MemoryCard'

export type { LatLngBounds }

// Fix Leaflet's broken default icon in Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const PIN_CONFIG: Record<MemoryType, { color: string; emoji: string }> = {
  trail:  { color: '#7aaa8e', emoji: '🥾' },
  summit: { color: '#b0a08a', emoji: '⛰️' },
  park:   { color: '#7aaa8e', emoji: '🌳' },
  beach:  { color: '#8ab0be', emoji: '🌊' },
  urban:  { color: '#a898c0', emoji: '🏙️' },
}

function createPinIcon(type: MemoryType, highlighted = false): L.DivIcon {
  const { color, emoji } = PIN_CONFIG[type] ?? PIN_CONFIG.trail
  const svg = highlighted ? `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="54" viewBox="0 0 44 54">
      <defs>
        <filter id="glow" x="-40%" y="-20%" width="180%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="${color}" flood-opacity="0.55"/>
        </filter>
      </defs>
      <path d="M22 1 C11.5 1 3 9.5 3 20 C3 32.5 22 53 22 53 C22 53 41 32.5 41 20 C41 9.5 32.5 1 22 1 Z"
            fill="white" opacity="0.9"/>
      <path d="M22 4.5 C13.44 4.5 6.5 11.44 6.5 20 C6.5 30.5 22 49 22 49 C22 49 37.5 30.5 37.5 20 C37.5 11.44 30.56 4.5 22 4.5 Z"
            fill="${color}" filter="url(#glow)"/>
      <circle cx="22" cy="19" r="10" fill="rgba(255,255,255,0.95)"/>
      <text x="22" y="23.5" text-anchor="middle" font-size="13">${emoji}</text>
    </svg>` : `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
      </defs>
      <path d="M18 2 C9.16 2 2 9.16 2 18 C2 28.5 18 42 18 42 C18 42 34 28.5 34 18 C34 9.16 26.84 2 18 2 Z"
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="18" cy="17" r="9" fill="rgba(255,255,255,0.9)"/>
      <text x="18" y="21" text-anchor="middle" font-size="11">${emoji}</text>
    </svg>`
  const size: [number, number] = highlighted ? [44, 54] : [36, 44]
  const anchor: [number, number] = highlighted ? [22, 54] : [18, 44]
  return L.divIcon({
    html: svg,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -46],
    className: '',
  })
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])
  return null
}

function FlyToTarget({ target }: { target: Memory | null }) {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 10, { duration: 1.2 })
    }
  }, [target, map])
  return null
}

function BoundsTracker({ onBoundsChange }: { onBoundsChange: (b: LatLngBounds) => void }) {
  const map = useMap()
  useEffect(() => { onBoundsChange(map.getBounds()) }, [map, onBoundsChange])
  useMapEvents({ moveend: () => onBoundsChange(map.getBounds()) })
  return null
}

function MemoryMarker({
  memory,
  onSelect,
  highlighted,
  onHover,
}: {
  memory: Memory
  onSelect: () => void
  highlighted: boolean
  onHover: (id: string | null) => void
}) {
  const markerRef = useRef<L.Marker>(null)

  return (
    <Marker
      ref={markerRef}
      position={[memory.lat, memory.lng]}
      icon={createPinIcon(memory.type, highlighted)}
      eventHandlers={{
        mouseover: () => { markerRef.current?.openPopup(); onHover(memory.id) },
        mouseout:  () => { markerRef.current?.closePopup(); onHover(null) },
        click:     () => { markerRef.current?.closePopup(); onSelect() },
      }}
    >
      <Popup className="memory-popup" minWidth={220} maxWidth={260} closeButton={false} autoPan={false}>
        <MemoryCard memory={memory} compact={true} />
      </Popup>
    </Marker>
  )
}

interface MapViewProps {
  isDark: boolean
  memories: Memory[]
  onSelectMemory: (memory: Memory) => void
  flyTarget: Memory | null
  onBoundsChange: (b: LatLngBounds) => void
  hoveredId: string | null
  onHoverMemory: (id: string | null) => void
}

export default function MapView({ isDark, memories, onSelectMemory, flyTarget, onBoundsChange, hoveredId, onHoverMemory }: MapViewProps) {
  return (
    <div className="flex-1 relative z-0">
      <MapContainer
        center={[40.5, -77.5]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'}
          url={isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'}
          subdomains="abcd"
        />

        <MapResizer />
        <BoundsTracker onBoundsChange={onBoundsChange} />
        <FlyToTarget target={flyTarget} />
        {memories.map((memory) => (
          <MemoryMarker
            key={memory.id}
            memory={memory}
            onSelect={() => onSelectMemory(memory)}
            highlighted={hoveredId === memory.id}
            onHover={onHoverMemory}
          />
        ))}
      </MapContainer>
    </div>
  )
}
