"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price: number | null
  image_url: string | null
  stock: number
  featured: boolean
  categories?: {
    name: string
    slug: string
  } | null
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const hasDiscount = product.original_price && product.original_price > product.price
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock <= 0) {
      toast.error('Produto esgotado')
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
    toast.success('Adicionado ao carrinho!')
  }

  return (
    <Link 
      href={`/produto/${product.slug}`}
      className="group relative flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-secondary/30 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12 opacity-20" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded">
              -{discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
              Destaque
            </span>
          )}
          {product.stock <= 0 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-bold rounded">
              Esgotado
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Adicionar aos favoritos"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button 
            className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Visualização rápida"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="absolute bottom-0 left-0 right-0 py-3 bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 disabled:bg-muted disabled:text-muted-foreground"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock <= 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {product.categories && (
          <span className="text-xs text-primary mb-1">{product.categories.name}</span>
        )}
        <h3 className="font-medium text-sm lg:text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-lg lg:text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.original_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
