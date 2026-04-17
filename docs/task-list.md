# Green Spaces Memory Map — Task List

> Tasks are ordered by dependency. Complete each section before moving to the next.

---

## 1. Firebase Project Setup

- [X] **Create the Firebase project**
       Go to [console.firebase.google.com](https://console.firebase.google.com) → "Add project" → name it `green-spaces` → disable Google Analytics (not needed) → Create project. Wait for provisioning to complete.

- [X] **Register a Web App**
       Inside the project dashboard → Project Overview → click the `</>` Web icon → register app name as `green-spaces-web` → do NOT enable Firebase Hosting yet (we'll do that via CLI). Copy the `firebaseConfig` object that appears — you'll paste this into `src/lib/firebase.ts`.

- [X] **Enable Firestore**
       Firebase Console → Build → Firestore Database → Create database → choose "Start in test mode" → select a region closest to you (e.g. `us-east1`) → Enable. Test mode gives open read/write for 30 days — fine for a hackathon. We'll tighten rules after.

- [X] **Enable Firebase Storage**
       Firebase Console → Build → Storage → Get started → Start in test mode → use the same region as Firestore → Done.

- [X] **Apply Firestore security rules**
       In the Firestore console → Rules tab → replace the default rules with the following, then Publish:
       ```
       rules_version = '2';
       service cloud.firestore {
         match /databases/{database}/documents {
           match /memories/{memoryId} {
             allow read: if true;
             allow create: if request.resource.data.keys().hasAll(['title','story','lat','lng'])
                           && request.resource.data.title is string
                           && request.resource.data.title.size() <= 100
                           && request.resource.data.story is string
                           && request.resource.data.story.size() <= 2000;
             allow update, delete: if false;
           }
         }
       }
       ```

- [X] **Apply Storage security rules**
       In the Storage console → Rules tab → replace the default rules with the following, then Publish:
       ```
       rules_version = '2';
       service firebase.storage {
         match /b/{bucket}/o {
           match /memories/{imageId} {
             allow read: if true;
             allow write: if request.resource.size < 5 * 1024 * 1024
                          && request.resource.contentType.matches('image/.*');
           }
         }
       }
       ```

- [X] **Set up Firebase Hosting via CLI**
       Install the Firebase CLI if you don't have it: `npm install -g firebase-tools`. Then run `firebase login` to authenticate. Inside the project root (once scaffolded), run `firebase init hosting` → select your project → public directory: `dist` → configure as single-page app: `yes` → overwrite `dist/index.html`: `no`. This creates `firebase.json` and `.firebaserc`.

---

## 2. Project Scaffold

- [X] **Create the Vite + React project**
       Run `npm create vite@latest green-spaces -- --template react-ts` in your projects directory. `cd green-spaces`. Verify it runs with `npm install && npm run dev` before touching anything.

- [X] **Install all dependencies**
       Run:
       ```bash
       npm install firebase react-leaflet leaflet uuid
       npm install -D tailwindcss@3 postcss autoprefixer
       ```
       Verify all four are listed in `package.json` under `dependencies` and the three dev deps are under `devDependencies`.

- [X] **Initialise Tailwind**
       Run `npx tailwindcss init -p`. This creates `tailwind.config.js` and `postcss.config.js`. Verify both files exist in the project root.

- [X] **Configure Tailwind content paths**
       Open `tailwind.config.js` and set the `content` array to:
       ```js
       content: ['./index.html', './src/**/*.{ts,tsx}']
       ```
       This tells Tailwind which files to scan for class names so unused styles are purged in the production build.

- [X] **Add custom theme tokens to Tailwind config**
       In `tailwind.config.js`, extend the theme with the `gs` colour namespace and custom font families:
       ```js
       theme: {
         extend: {
           colors: {
             gs: {
               forest:    '#2d4a2d',
               moss:      '#4a7c59',
               sage:      '#8aab8a',
               cream:     '#f5f0e8',
               parchment: '#ede4d0',
               bark:      '#7c6a4a',
               soil:      '#3d2e1e',
               dusk:      '#c4a882',
               water:     '#4a7a8c',
             }
           },
           fontFamily: {
             display: ['"Playfair Display"', 'Georgia', 'serif'],
             body:    ['Lora', 'Georgia', 'serif'],
           }
         }
       }
       ```

- [X] **Replace `src/index.css` with Tailwind directives**
       Delete all content in `src/index.css` and replace with exactly:
       ```css
       @tailwind base;
       @tailwind components;
       @tailwind utilities;
       ```
       Leaflet's own CSS will be imported separately in `App.tsx`.

- [X] **Update `index.html` with Google Fonts and metadata**
       In the `<head>` of `index.html`: update the `<title>` to `Green Spaces — Memory Map`, update the favicon to the 🌿 emoji SVG, and add the Google Fonts preconnect + stylesheet link for Playfair Display (weights 400, 700, italic) and Lora (weights 400, 500):
       ```html
       <link rel="preconnect" href="https://fonts.googleapis.com">
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
       <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
       ```

- [X] **Create the full `src/` folder structure**
       Create the following empty directories and placeholder files:
       ```
       src/lib/firebase.ts
       src/lib/memories.ts
       src/hooks/useMemories.ts
       src/components/AddMemoryModal.tsx
       src/components/MemoryCard.tsx
       src/components/Sidebar.tsx
       src/data/             (empty folder)
       scripts/              (empty folder)
       ```

- [X] **Verify Tailwind is working**
       In `App.tsx`, replace all content with a simple `<div className="bg-gs-forest text-gs-cream p-8 font-display text-2xl">Green Spaces</div>`. Run `npm run dev`. You should see dark green background with cream text in Playfair Display. If the custom colours don't apply, re-check `tailwind.config.js` content paths.

---

## 3. Firebase Configuration

- [X] **Populate `src/lib/firebase.ts`**
       Paste the `firebaseConfig` object copied during Firebase Web App registration. Export `db` from `getFirestore(app)` and `storage` from `getStorage(app)`. The file should export exactly those two named exports — everything else in the codebase imports from here.

- [X] **Verify Firebase connection in browser**
       Temporarily add a quick Firestore write test in `App.tsx` (import `addDoc`, `collection` from firebase/firestore and `db` from your firebase lib, call `addDoc(collection(db, 'test'), { ping: true })`). Open the browser console — there should be no CORS or permission errors. Check the Firebase Firestore console to confirm the `test` document appeared. Delete the test code and the `test` collection when done.

---

## 4. Seed Data
OBE — seed memories will be entered manually into Firestore via the app's Add Memory flow after the app is built and deployed. No scraper or bundled fixture data needed.

---

## 5. Data Layer

- [X] **Write `src/lib/memories.ts` — imports and constants**
       At the top of the file: import Firestore functions (`collection`, `addDoc`, `onSnapshot`, `query`, `orderBy`, `serverTimestamp`) from `firebase/firestore`. Import Storage functions (`ref`, `uploadBytes`, `getDownloadURL`) from `firebase/storage`. Import `db` and `storage` from `./firebase`. Import `{ v4 as uuidv4 }` from `uuid`. Define `const COLLECTION = 'memories'`.

- [X] **Write `subscribeToMemories(callback)`**
       Export a function that takes a callback. Inside, build a Firestore query: `query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))`. Call `onSnapshot` on the query. In the snapshot handler: map each doc to `{ id: doc.id, ...doc.data() }`. Pass the resulting array to the callback. Return the unsubscribe function returned by `onSnapshot` so callers can clean up on unmount.

- [X] **Write `uploadImage(file)`**
       Export an async function that takes a `File` object. Generate a UUID for the filename. Extract the file extension from `file.name`. Build the storage path: `memories/${uuid}.${ext}`. Create a storage ref with `ref(storage, path)`. Call `uploadBytes(storageRef, file)` and await it. Call `getDownloadURL(storageRef)` and return the result. Wrap in try/catch and re-throw with a descriptive error message.

- [X] **Write `addMemory(data)`**
       Export an async function that accepts a plain object with the Memory fields plus an optional `imageFile` (File object). If `imageFile` is present, call `uploadImage(imageFile)` and store the result as `imageUrl`, otherwise `imageUrl = null`. Call `addDoc(collection(db, COLLECTION), { ...fields, imageUrl, createdAt: serverTimestamp() })`. Return the resulting Firestore `DocumentReference`. Wrap in try/catch.

- [X] **Write `src/hooks/useMemories.ts`**
       Create a custom hook that: initialises state with `useState([])`, sets up a `useEffect` that calls `subscribeToMemories` and in the callback calls `setMemories(liveDocs)`. Set `loading` to `false` after the first snapshot fires. Return the `unsubscribe` function from `useEffect`'s cleanup. Return `{ memories, loading }` from the hook.

---

## 6. Map Foundation

- [X] **Fix Leaflet's broken default icon in Vite**
       At the top of `App.tsx`, after importing Leaflet, add the following fix (Vite's bundler breaks Leaflet's default marker icon URL resolution):
       ```js
       import L from 'leaflet'
       import 'leaflet/dist/leaflet.css'
       delete L.Icon.Default.prototype._getIconUrl
       L.Icon.Default.mergeOptions({
         iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
         iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
         shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
       })
       ```
       Test that a marker renders without a broken image.

- [X] **Render the base `MapContainer`**
       In `App.tsx`, render a `<MapContainer>` from `react-leaflet` with: `center={[40.5, -77.5]}` (centre of Pennsylvania), `zoom={7}`, `style={{ height: '100%', width: '100%' }}`, `zoomControl={false}`. Wrap it in a `div` that fills the remaining viewport height (use Tailwind `h-full flex-1`). Add a `<TileLayer>` with the OpenStreetMap URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` and the required attribution string. Confirm the map tiles load and you can pan/zoom.

- [X] **Write the `createPinIcon(type)` function**
       Above the component, write a function that takes a `type` string and returns an `L.divIcon`. The icon HTML should be an inline SVG teardrop shape: a `<path>` forming the teardrop, a `<circle>` for the white inset, and a `<text>` element with the emoji. Use a `<filter>` with `feDropShadow` for the shadow. Map each type to its colour and emoji (from the design spec). Set `iconSize: [36, 44]`, `iconAnchor: [18, 44]`, `popupAnchor: [0, -46]`, `className: ''` (empty string prevents Leaflet adding its own background styles).

- [X] **Render markers from Firestore**
       Import `useMemories` and call it in `App.tsx`. Map over `memories` and render a `<Marker>` for each, using `[memory.lat, memory.lng]` as `position` and `createPinIcon(memory.type)` as `icon`. Use `memory.id` as the React `key`. The map will be empty until seed data is added manually in section 17.

- [X] **Write the `MapClickHandler` component**
       Create a small internal component (can live in `App.tsx`) that uses `useMapEvents` from `react-leaflet`. Register a `click` event handler that receives the Leaflet event `e` and calls a prop `onMapClick(e.latlng)`. Render `<MapClickHandler onMapClick={...} />` inside `<MapContainer>`. In `App.tsx` state, add `pendingLatLng` (initially `null`). The click handler should call `setPendingLatLng(latlng)`. Verify by clicking the map and `console.log`-ing the coordinates.

---

## 7. App Shell & Header

- [X] **Build the app shell layout**
       Replace the `App.tsx` return with the full layout structure. Use Tailwind flex classes to create a full-viewport-height column: a fixed-height header, then a `flex-1 flex overflow-hidden` row containing the sidebar and map. The overall shell should be `className="flex flex-col h-screen bg-gs-forest"`. Confirm the layout takes up the full window with no scroll on the outer shell.

- [X] **Build the `Header` component**
       Create `src/components/Header.tsx`. It receives `memoryCount` as a prop. Render a `<header>` with `className="flex items-center justify-between px-6 py-3 bg-gs-forest border-b border-gs-moss/30 flex-shrink-0"`. Left side: 🌿 emoji + `<h1>` with `font-display font-bold text-2xl text-gs-cream` + an italic tagline in `font-body italic text-sm text-gs-sage`. Right side: a pin count string in `text-gs-sage font-body text-sm italic` + a non-interactive hint pill with `border border-gs-moss/50 text-gs-sage font-body italic text-xs px-4 py-1 rounded-full`. Wire `memoryCount` from the `memories.length` in `App.tsx`.

---

## 8. Sidebar

- [X] **Build `FilterBar` (inside Sidebar)**
       Inside `Sidebar.tsx`, render a `<div>` with `className="flex flex-wrap gap-1.5 p-3 bg-gs-cream border-b border-gs-dusk/30"`. Map over the `FILTERS` array (All / Trail / Summit / Park / Beach / Urban, each with an emoji label). Render each as a `<button>`. Default style: `border border-gs-dusk text-gs-bark font-body text-xs px-3 py-1 rounded-full`. Active style (when `activeFilter === filter.value`): `bg-gs-moss border-gs-moss text-white`. Call `onFilterChange(filter.value)` on click. Ensure "All" is active by default on first render.

- [X] **Build the `MemoryListItem` (inside Sidebar)**
       Inside `Sidebar.tsx`, render each memory as a `<button>` with `className="flex items-center gap-2.5 w-full text-left p-2.5 rounded-md mb-1.5 transition-all"`. If `selectedId === memory.id`, add `bg-gs-moss/10 border-l-2 border-gs-moss`. On hover, add `translate-x-0.5`. Left: if `memory.imageUrl` exists, render a `44×44px` `<img>` with `object-cover rounded`. Body: `<p>` for title in `font-display text-sm font-bold text-gs-soil` and `<p>` for location in `font-body italic text-xs text-gs-bark mt-0.5`. Clicking calls `onSelectMemory(memory)`.

- [X] **Build the `Sidebar` component shell**
       `Sidebar.tsx` receives `memories`, `activeFilter`, `onFilterChange`, `onSelectMemory`, `selectedId` as props. Render a `<aside>` with `className="w-72 flex-shrink-0 bg-gs-parchment flex flex-col overflow-hidden border-r border-gs-dusk/30"`. Inside: `<FilterBar>` at the top, then a scrollable `<div className="flex-1 overflow-y-auto p-2">` containing the memory list. Add an empty state message (`font-body italic text-sm text-gs-bark text-center p-8`) shown when `memories.length === 0`.

- [X] **Wire Sidebar filtering in `App.tsx`**
       Add `activeFilter` state (default `'all'`). Derive `filteredMemories` by filtering `memories` — if `activeFilter === 'all'` return all, otherwise return `memories.filter(m => m.type === activeFilter)`. Pass `filteredMemories` to both `<Sidebar>` and the map markers. Confirm that clicking a filter button updates both the sidebar list and the pins on the map simultaneously.

---

## 9. Memory Cards

- [X] **Build `MemoryCard` — compact variant**
       In `MemoryCard.tsx`, export a component that accepts `memory` and `compact` props. When `compact={true}`, render a `<div className="flex gap-2.5 p-2 font-body max-w-[260px]">`. Left: `<img>` at `70×70px` with `rounded object-cover flex-shrink-0` (only if `memory.imageUrl` exists). Right: a type badge (small pill with `bg-gs-moss text-white text-[10px] px-2 py-0.5 rounded-full`), then title in `font-display font-bold text-sm text-gs-soil`, then location in `italic text-xs text-gs-bark`, then story truncated to 100 characters with an ellipsis in `text-xs text-gs-bark leading-relaxed mt-1`.

- [X] **Build `MemoryCard` — full variant**
       When `compact={false}` (default), render the full card. If `memory.imageUrl` exists, render `<img className="w-full h-52 object-cover">` at the top with no padding. Then a `<div className="p-5 font-body">` containing: a row with the type badge and formatted date string (`toLocaleDateString` with `{ year: 'numeric', month: 'long', day: 'numeric' }`); title in `font-display font-bold text-2xl text-gs-forest mt-2`; location with a 📍 prefix in `italic text-sm text-gs-bark mt-1`; story in `text-sm text-gs-soil leading-relaxed mt-3`; author prefixed with `—` in `italic text-xs text-gs-bark mt-4`.

- [X] **Add `<Popup>` to map markers**
       In `App.tsx`, wrap each `<Marker>` with a `<Popup className="memory-popup" maxWidth={280}>`. Inside render `<MemoryCard memory={memory} compact={true} />`. Add a small global CSS override (in `index.css`, after the `@tailwind` directives) to remove Leaflet's default popup padding:
       ```css
       .memory-popup .leaflet-popup-content-wrapper { padding: 0; border-radius: 10px; overflow: hidden; }
       .memory-popup .leaflet-popup-content { margin: 0; }
       ```

---

## 10. Memory Detail Overlay

- [X] **Build `MemoryDetailOverlay` component**
       Create `src/components/MemoryDetailOverlay.tsx`. It receives `memory` and `onClose` as props. Render a fixed full-screen backdrop: `<div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-gs-forest/60 backdrop-blur-sm">`. Clicking the backdrop calls `onClose`. Inside, render a panel `<div className="relative bg-gs-cream rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">` that stops click propagation. Position a close button (✕) absolutely at `top-3 right-3` with `bg-white/80 rounded-full w-7 h-7 flex items-center justify-center text-gs-bark hover:bg-white transition-colors`. Render `<MemoryCard memory={memory} />` inside the panel.

- [X] **Wire detail overlay in `App.tsx`**
       Add `selectedMemory` state (initially `null`). Add an `eventHandlers` prop to each `<Marker>` with a `click` handler that calls `setSelectedMemory(memory)` and `setPendingLatLng(null)` (to prevent the modal opening simultaneously). Render `{selectedMemory && <MemoryDetailOverlay memory={selectedMemory} onClose={() => setSelectedMemory(null)} />}` in the tsx. Also wire sidebar item clicks to set `selectedMemory`. Clicking a sidebar item should also fly the map to that pin — use a `useRef` on the `MapContainer` and call `mapRef.current.flyTo([memory.lat, memory.lng], 10, { duration: 1.2 })`.

---

## 11. Add Memory Modal

- [X] **Build `AddMemoryModal` — layout and type selector**
       Create `src/components/AddMemoryModal.tsx`. It receives `latlng` and `onClose` and `onSaved` as props. Render the same fixed backdrop pattern as the detail overlay but `z-[600]`. Inner modal panel: `max-w-lg w-full bg-gs-cream rounded-xl max-h-[90vh] overflow-y-auto border border-gs-dusk`. Modal header section: title "Pin a Memory" in `font-display font-bold text-xl text-gs-forest`, coordinates display `(lat.toFixed(4), lng.toFixed(4))` in `font-mono text-xs text-gs-bark mt-1`, close button top-right. Below header: type selector row — map over all 5 types, render pill buttons. Default type is `'trail'`. Active type gets `bg-gs-moss text-white border-gs-moss`, inactive gets `bg-white border-gs-dusk text-gs-bark`. Clicking sets `type` in form state.

- [X] **Build `AddMemoryModal` — form fields**
       Below the type selector, render a 2-column grid (`grid grid-cols-2 gap-3`) containing four fields: Title (full width — `col-span-2`), Location name, Date visited (`<input type="date">`), Author name. Each field: a `<label>` with a `<span>` for the label text in `font-body text-xs font-medium text-gs-bark uppercase tracking-wide block mb-1` and an `<input>` with `w-full bg-white border border-gs-dusk/60 rounded-md px-3 py-2 font-body text-sm text-gs-soil focus:outline-none focus:border-gs-moss`. Below the grid, a full-width Story `<textarea>` with `rows={4}` and the same input styles plus `resize-y`. Title and Story are marked as required with a `*` in the label.

- [X] **Build `AddMemoryModal` — image upload**
       Below the story textarea, render an image upload area. If no image is selected: a dashed border box `border-2 border-dashed border-gs-dusk rounded-lg p-6 text-center cursor-pointer hover:border-gs-moss transition-colors` containing a `📷` emoji and "Click to upload a photo" in `font-body italic text-sm text-gs-bark`. Wrap in a `<label>` with a hidden `<input type="file" accept="image/*">`. On file selection, call `URL.createObjectURL(file)` and store as `preview` state. If a preview exists, replace the dashed area with the preview `<img>` at `h-40 w-full object-cover rounded-lg` and a small "Remove" button overlaid top-right.

- [X] **Build `AddMemoryModal` — submit logic**
       Add form state with `useState` for all fields (title, location, date, story, type, author) and separate state for `imageFile`, `preview`, `saving`, and `error`. The submit handler: validate that `title.trim()` and `story.trim()` are non-empty — if not, set `error` and return early. Set `saving = true`, clear `error`. Call `addMemory({ ...formFields, lat: latlng.lat, lng: latlng.lng, imageFile })` imported from `../lib/memories`. On success call `onSaved()`. On error catch the exception, set `error = 'Failed to save. Check your Firebase config.'` and `saving = false`. The footer renders a "Cancel" button and a "📍 Pin this memory" submit button. Submit button: `disabled={saving}`, text changes to "🌱 Saving…" when `saving` is true. Error message renders in `text-red-600 font-body text-sm italic` above the footer.

---

## 12. Loading & Empty States

- [X] **Add map loading overlay**
       In `App.tsx`, use the `loading` value from `useMemories`. When `loading` is true, render an absolutely positioned overlay inside the map wrapper: `<div className="absolute inset-0 z-[400] flex items-center justify-center bg-gs-cream/80">` containing "🌱 Loading memories…" in `font-display italic text-lg text-gs-forest`. Set `loading` to `false` once the first `onSnapshot` callback fires.

- [X] **Add sidebar empty state**
       In `Sidebar.tsx`, when `memories.length === 0` (after filtering), render: `<div className="p-8 text-center"><p className="font-display italic text-gs-bark text-sm">No {activeFilter === 'all' ? '' : activeFilter} memories yet.</p><p className="font-body text-xs text-gs-bark/70 mt-1">Click anywhere on the map to add yours!</p></div>`.

---

## 13. Integration & Wiring

- [ ] **Full state wiring audit in `App.tsx`**
       Walk through every user interaction from the design spec's interaction table and verify each is wired end-to-end: (1) Click sidebar item → `selectedMemory` set → detail overlay opens → map flies to pin. (2) Click empty map → `pendingLatLng` set → modal opens. (3) Click pin → popup appears with compact card. (4) Submit modal → `addMemory` called → modal closes → new pin appears in real time. (5) Click filter → `activeFilter` changes → both sidebar list and map markers update. (6) Click backdrop or ✕ on modal/overlay → dismissed, state cleared.

- [ ] **Prevent modal and detail overlay from opening simultaneously**
       When `setPendingLatLng` is called (map click), also call `setSelectedMemory(null)`. When `setSelectedMemory` is called, also call `setPendingLatLng(null)`. Add a guard in `MapClickHandler` — if the click target is a marker (check `e.originalEvent.target` for SVG elements), do not fire `onMapClick`.

- [X] **Test real-time sync**
       Open the app in two browser tabs side by side. In tab 1, click the map and add a new memory with a title and story (no image for speed). Submit. Verify: (1) the pin appears in tab 1 immediately, (2) the pin appears in tab 2 without a page refresh, (3) the memory appears at the top of the sidebar list in both tabs. This confirms `onSnapshot` is working correctly.

---

## 14. Styling Polish

- [ ] **Polish the map tile layer**
       Confirm OpenStreetMap tiles look good at the default zoom over Pennsylvania. Consider switching the tile URL to the `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png` CartoDB Voyager style — it has a cleaner, more editorial look that complements the earthy aesthetic better than the default OSM style. Requires attribution: `&copy; OpenStreetMap contributors &copy; CARTO`. Test at zoom levels 3 (world), 7 (state), 12 (city).

- [ ] **Style Leaflet popup chrome**
       The Leaflet popup has a white border, shadow, and tip by default. Add CSS overrides in `index.css` (below the `@tailwind` directives) to style the popup wrapper with the cream background and dusk border, and tint the popup tip to match. Also increase the popup's `z-index` to sit above the sidebar but below modals.

- [ ] **Review Tailwind class consistency**
       Do a pass over all components and ensure: no raw `#hex` colours in `className` props (all colours via `gs-*` Tailwind tokens), no `style={{}}` props except where unavoidable (the map container height), no `font-sans` anywhere, all interactive elements have `transition-colors` or `transition-all` for hover feedback, all buttons have `cursor-pointer`.

- [ ] **Test font rendering**
       Confirm Playfair Display is rendering on: the header title, card titles, the modal heading, and empty state text. Confirm Lora is rendering on: form labels, sidebar list items, body text in cards, the type badge text. If fonts look like fallback Georgia, check the Google Fonts `<link>` tag is in `index.html` and the Tailwind `fontFamily` config matches the exact font names.

---

## 15. Firebase Hosting & Deployment

- [ ] **Verify `firebase.json` is correct**
       Confirm `firebase.json` exists in the project root with `"public": "dist"` and the SPA rewrite rule (`{ "source": "**", "destination": "/index.html" }`). Confirm `.firebaserc` exists and contains your project ID.

- [ ] **Production build test**
       Run `npm run build`. Verify the `dist/` folder is created and contains `index.html`, a `assets/` folder with hashed JS and CSS files. Check the terminal for any build errors or warnings. Open `dist/index.html` in a browser (via `npm run preview`) and confirm the app loads correctly.

- [ ] **Deploy to Firebase Hosting**
       Run `firebase deploy --only hosting`. When complete, Firebase will output a URL like `https://green-spaces-XXXXX.web.app`. Open it in an incognito window (to rule out cache). Confirm: map loads, clicking a pin shows the popup, and the add memory flow works end-to-end.

- [ ] **Test deployed app on a second device**
       Open the deployed URL on your phone or a second computer. Add a pin on one device, verify it appears on the other device in real time. This is your demo money shot — confirm it works before recording.

