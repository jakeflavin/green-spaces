export type MemoryType = 'trail' | 'summit' | 'park' | 'beach' | 'urban'

export type FilterValue = 'all' | MemoryType

export interface Memory {
  id: string
  location?: string
  lat: number
  lng: number
  date?: string
  story: string
  type: MemoryType
  author?: string
  imageUrl?: string | null
  createdAt?: unknown
}

export interface MapBounds {
  south: number
  north: number
  west: number
  east: number
}

export interface AddMemoryInput {
  location?: string
  lat: number
  lng: number
  date?: string
  story: string
  type: MemoryType
  author?: string
  imageFile?: File | null
}
