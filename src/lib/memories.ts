import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION = 'memories';

export type MemoryType = 'trail' | 'summit' | 'park' | 'beach' | 'urban';

export interface Memory {
  id: string;
  title?: string;
  location?: string;
  lat: number;
  lng: number;
  date?: string;
  story: string;
  type: MemoryType;
  author?: string;
  imageUrl?: string | null;
  createdAt?: unknown;
}

export interface MapBounds {
  south: number;
  north: number;
  west: number;
  east: number;
}

export function subscribeToMemories(
  callback: (memories: Memory[]) => void,
  bounds?: MapBounds,
) {
  const q = bounds
    ? query(
        collection(db, COLLECTION),
        where('lat', '>=', bounds.south),
        where('lat', '<=', bounds.north),
        orderBy('lat', 'desc'),
      )
    : query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(q,
    (snapshot) => {
      let memories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Memory[];

      // Firestore only range-queries on lat; filter lng client-side
      if (bounds) {
        memories = memories.filter(
          (m) => m.lng >= bounds.west && m.lng <= bounds.east,
        );
      }

      callback(memories);
    },
    () => {
      // On any Firestore error (permissions, missing index, network) return
      // an empty list so the app exits the loading state instead of hanging.
      callback([]);
    },
  );
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const ext = file.name.split('.').pop();
    const path = `memories/${uuidv4()}.${ext}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (err) {
    throw new Error(`Image upload failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export interface AddMemoryInput {
  location?: string;
  lat: number;
  lng: number;
  date?: string;
  story: string;
  type: MemoryType;
  author?: string;
  imageFile?: File | null;
}

export async function addMemory(data: AddMemoryInput) {
  try {
    const { imageFile, ...fields } = data;
    const imageUrl = imageFile ? await uploadImage(imageFile) : null;

    // Firestore rejects undefined values — strip them before writing
    const doc = Object.fromEntries(
      Object.entries({ ...fields, imageUrl, createdAt: serverTimestamp() })
        .filter(([, v]) => v !== undefined),
    );

    return await addDoc(collection(db, COLLECTION), doc);
  } catch (err) {
    throw new Error(`Failed to save memory: ${err instanceof Error ? err.message : String(err)}`);
  }
}
