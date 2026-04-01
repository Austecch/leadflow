import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadFlow AI — AI-Powered Lead Generation & Outreach',
  description: 'Discover, qualify, and convert leads at scale with AI-personalized multi-channel outreach.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
