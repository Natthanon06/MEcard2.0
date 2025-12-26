// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '@/context/LanguageContext' // ✅ นำเข้า

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MEcard',
  description: 'Digital Business Card Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ ครอบ LanguageProvider ไว้ชั้นนอกสุด */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}