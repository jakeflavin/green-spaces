/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gs: {
          ink:     '#2a3830',
          deep:    '#4a6358',
          surface: '#ffffff',
          soft:    '#f2f5f3',
          border:  '#e8ebe9',
          muted:   '#8a9890',
          subtle:  '#edf2ee',
          night:   '#0f1714',
          'surface-dark': '#18211d',
          'soft-dark':    '#22302a',
          'border-dark':  '#31423a',
          'muted-dark':   '#9fb0a6',
          'subtle-dark':  '#293731',
          'ink-dark':     '#edf3ef',
          // Type-specific badge colours
          trail:        '#e0eae4',
          'trail-text': '#3a5244',
          summit:        '#eae4d8',
          'summit-text': '#6a4a28',
          park:          '#e0eae4',
          'park-text':   '#3a5244',
          beach:         '#d8e8ee',
          'beach-text':  '#2a4858',
          urban:         '#e4e0ee',
          'urban-text':  '#44385e',
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card':       '0 1px 3px rgba(42,56,48,0.08), 0 4px 12px rgba(42,56,48,0.06)',
        'card-hover': '0 4px 8px rgba(42,56,48,0.10), 0 12px 24px rgba(42,56,48,0.10)',
        'modal':      '0 8px 32px rgba(42,56,48,0.18), 0 2px 8px rgba(42,56,48,0.10)',
      }
    }
  },
  plugins: [],
}
