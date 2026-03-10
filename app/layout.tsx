import type { Metadata, Viewport } from 'next'
import { Orbitron, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { CartProvider } from '@/contexts/cart-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-display'
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body'
})

export const metadata: Metadata = {
  title: 'Lua Rock Store | Seu Universo Geek e Rock',
  description: 'Loja geek alternativa com produtos de animes, séries, filmes, decorações temáticas e camisas de rock. Envio para todo o Brasil!',
  keywords: ['geek', 'nerd', 'anime', 'rock', 'camisetas', 'decoração', 'cultura pop', 'loja online'],
  authors: [{ name: 'Lua Rock Store' }],
  openGraph: {
    title: 'Lua Rock Store | Seu Universo Geek e Rock',
    description: 'Loja geek alternativa com produtos de animes, séries, filmes, decorações temáticas e camisas de rock.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1025',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${orbitron.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <CartProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster 
            position="top-right" 
            theme="dark"
            toastOptions={{
              style: {
                background: 'oklch(0.15 0.02 280)',
                border: '1px solid oklch(0.25 0.03 280)',
                color: 'oklch(0.95 0 0)',
              }
            }}
          />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
