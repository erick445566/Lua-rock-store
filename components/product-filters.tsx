"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState, useTransition } from 'react'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState(searchParams.get('busca') || '')

  const currentCategory = searchParams.get('categoria')
  const currentOrder = searchParams.get('ordem')

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    startTransition(() => {
      router.push(`/loja?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters('busca', search || null)
  }

  const clearFilters = () => {
    setSearch('')
    startTransition(() => {
      router.push('/loja')
    })
  }

  const hasFilters = currentCategory || currentOrder || searchParams.get('busca')

  return (
    <div className="mb-8">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Buscar
          </button>
        </form>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors sm:w-auto"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filtros</span>
          {hasFilters && (
            <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-card border border-border rounded-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Categories */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateFilters('categoria', null)}
                  disabled={isPending}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    !currentCategory 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  Todas
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilters('categoria', cat.slug)}
                    disabled={isPending}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentCategory === cat.slug 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <label className="text-sm font-medium mb-2 block">Ordenar por</label>
              <select
                value={currentOrder || ''}
                onChange={(e) => updateFilters('ordem', e.target.value || null)}
                disabled={isPending}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Mais Recentes</option>
                <option value="preco-asc">Menor Preço</option>
                <option value="preco-desc">Maior Preço</option>
                <option value="nome">Nome A-Z</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <div className="mt-4 pt-4 border-t border-border">
              <button
                onClick={clearFilters}
                disabled={isPending}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
