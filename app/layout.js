import './globals.css'
// import { Stylish, Cinzel_Decorative } from 'next/font/google'
import { textFont } from "~/util/fonts";

// const stylish = Stylish({ weight: ['400'], subsets: ['latin'] })
// const cinzel = Cinzel_Decorative({ weight: ['400'], subsets: ['latin'] })

export const metadata = {
  title: '⚔️ No Two Paths',
  description: 'Endless CYOA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={textFont.className}>{children}</body>
    </html>
  )
}
