import './globals.css'
import { IBM_Plex_Mono } from 'next/font/google'

const font = IBM_Plex_Mono({ weight: ['300', '500'], subsets: ['latin'] })

export const metadata = {
  title: '⚔️ No Two Paths',
  description: 'Endless CYOA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
