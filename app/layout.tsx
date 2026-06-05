import type {Metadata} from 'next'
import localFont from 'next/font/local'
import {ScrollReveal} from '@/components/ScrollReveal'
import {SmoothScroll} from '@/components/SmoothScroll'
import './globals.css'

const outfit = localFont({
  src: './fonts/Outfit-VariableFont_wght.ttf',
  display: 'swap',
  variable: '--font-outfit',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Wondering',
  description: 'Films, therapeutic storytelling and social campaigns.',
}

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <SmoothScroll />
        <ScrollReveal />
        {children}
      </body>
    </html>
  )
}
