import Navbar from 'a/components/navbar'
import { Footer } from 'a/components/Footer'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextAuthProvider from 'a/components/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'musical-mash',
  description: 'private project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className={`${inter.className} bg-slate-800 font-sans`} >
        <NextAuthProvider>
          <Navbar />
        {children}
        </NextAuthProvider>
        <Footer />
      </body>
    </html>
  )
}
