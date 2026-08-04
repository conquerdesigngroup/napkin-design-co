import localFont from 'next/font/local';

/* Archivo variable. The wdth axis (110 to 125) does the display duty through
   font-variation-settings in globals.css, so the whole wght range ships here. */
export const archivo = localFont({
  src: '../assets/fonts/ArchivoVariable-latin.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-archivo',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

/* JetBrains Mono, only where real data appears. */
export const jetbrains = localFont({
  src: [
    { path: '../assets/fonts/JetBrainsMono-400-latin.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/JetBrainsMono-700-latin.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-jetbrains',
  fallback: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
});
