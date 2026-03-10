"use client"

import Link from 'next/link'
import { Moon, Sparkles, ChevronRight } from 'lucide-react'

export function HeroBanner() {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(oklch(0.65 0.25 290 / 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, oklch(0.65 0.25 290 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Novidades toda semana</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
            <span className="block">Seu Universo</span>
            <span className="block mt-2">
              <span className="text-primary">Geek</span> e{' '}
              <span className="text-accent">Rock</span>
            </span>
            <span className="block text-muted-foreground text-2xl sm:text-3xl lg:text-4xl mt-4 font-normal">
              em um só lugar
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
            Produtos exclusivos de animes, séries, filmes, decorações temáticas e camisas de rock. 
            Envio para todo o Brasil!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
            <Link
              href="/loja"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105"
            >
              Comprar Agora
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/categorias"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-semibold text-lg hover:bg-secondary/80 transition-all border border-border"
            >
              Explorar Categorias
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Produtos</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-accent">5000+</p>
              <p className="text-sm text-muted-foreground">Clientes</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-bold">Brasil</p>
              <p className="text-sm text-muted-foreground">Envio Nacional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Moon */}
      <div className="absolute top-10 right-10 lg:top-20 lg:right-20 opacity-20">
        <Moon className="w-32 h-32 lg:w-48 lg:h-48 text-primary" />
      </div>
    </section>
  )
}
