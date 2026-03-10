"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingCart, User, Search, Moon } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/loja', label: 'Loja' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const { totalItems } = useCart()

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-primary/5' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Moon className="w-8 h-8 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-[var(--font-display)] text-xl lg:text-2xl font-bold tracking-wider">
              <span className="text-primary">LUA ROCK</span>
              <span className="text-accent font-normal ml-1">store</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Link
              href="/loja"
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/carrinho"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <Link
              href={user ? '/conta' : '/auth/login'}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label={user ? 'Minha conta' : 'Entrar'}
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href={user ? '/conta' : '/auth/login'}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              {user ? 'Minha Conta' : 'Entrar'}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border animate-in slide-in-from-top">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-border my-2" />
            <Link
              href={user ? '/conta' : '/auth/login'}
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg text-center"
            >
              {user ? 'Minha Conta' : 'Entrar / Cadastrar'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
