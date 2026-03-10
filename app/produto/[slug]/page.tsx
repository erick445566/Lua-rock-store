import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ProductCard } from '@/components/product-card'
import { ChevronRight, Truck, Shield, RefreshCw, ShoppingBag } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!product) {
    return { title: 'Produto não encontrado' }
  }

  return {
    title: `${product.name} | Lua Rock Store`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (!product) {
    notFound()
  }

  // Related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('category_id', product.category_id)
    .eq('active', true)
    .neq('id', product.id)
    .limit(4)

  const hasDiscount = product.original_price && product.original_price > product.price
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.original_price!) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/loja" className="hover:text-primary transition-colors">Loja</Link>
        {product.categories && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link 
              href={`/categorias/${product.categories.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product Info */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Image */}
        <div className="relative aspect-square bg-card rounded-2xl overflow-hidden border border-border">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <ShoppingBag className="w-24 h-24 opacity-20" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {hasDiscount && (
              <span className="px-3 py-1 bg-destructive text-destructive-foreground text-sm font-bold rounded-lg">
                -{discountPercent}%
              </span>
            )}
            {product.featured && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-lg">
                Destaque
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.categories && (
            <Link 
              href={`/categorias/${product.categories.slug}`}
              className="text-sm text-primary mb-2 hover:underline"
            >
              {product.categories.name}
            </Link>
          )}
          
          <h1 className="text-2xl lg:text-4xl font-bold mb-4">{product.name}</h1>
          
          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl lg:text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.original_price!)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-2 text-sm text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Em estoque ({product.stock} disponíveis)
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Produto esgotado
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-invert prose-sm max-w-none mb-8">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Envio Rápido</p>
                <p className="text-xs text-muted-foreground">Todo Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Compra Segura</p>
                <p className="text-xs text-muted-foreground">Dados protegidos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Troca Fácil</p>
                <p className="text-xs text-muted-foreground">7 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
