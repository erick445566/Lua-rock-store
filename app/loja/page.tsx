import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product-card'
import { ProductFilters } from '@/components/product-filters'
import { ShoppingBag } from 'lucide-react'

interface SearchParams {
  categoria?: string
  ordem?: string
  busca?: string
  destaque?: string
}

export const metadata = {
  title: 'Loja | Lua Rock Store',
  description: 'Explore nossa coleção de produtos geek, animes, séries e rock.',
}

async function ProductGrid({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('active', true)

  if (searchParams.categoria) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', searchParams.categoria)
      .single()
    
    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  if (searchParams.destaque === 'true') {
    query = query.eq('featured', true)
  }

  if (searchParams.busca) {
    query = query.ilike('name', `%${searchParams.busca}%`)
  }

  switch (searchParams.ordem) {
    case 'preco-asc':
      query = query.order('price', { ascending: true })
      break
    case 'preco-desc':
      query = query.order('price', { ascending: false })
      break
    case 'recentes':
      query = query.order('created_at', { ascending: false })
      break
    case 'nome':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: products, error } = await query

  if (error || !products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground">Tente ajustar os filtros ou buscar por outro termo.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Nossa Loja</h1>
        <p className="text-muted-foreground">
          Explore nossa coleção completa de produtos geek e rock
        </p>
      </div>

      {/* Filters */}
      <ProductFilters categories={categories || []} />

      {/* Products */}
      <Suspense fallback={
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      }>
        <ProductGrid searchParams={params} />
      </Suspense>
    </div>
  )
}
