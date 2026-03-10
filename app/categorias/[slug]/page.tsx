import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product-card'
import { ChevronRight, ShoppingBag } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single()

  if (!category) {
    return { title: 'Categoria não encontrada' }
  }

  return {
    title: `${category.name} | Lua Rock Store`,
    description: `Produtos da categoria ${category.name}. Encontre os melhores itens geek e rock!`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('category_id', category.id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/categorias" className="hover:text-primary transition-colors">Categorias</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">
          {products?.length || 0} produtos encontrados
        </p>
      </div>

      {/* Products */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum produto nesta categoria</h3>
          <p className="text-muted-foreground mb-4">Em breve teremos novidades!</p>
          <Link
            href="/loja"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Ver todos os produtos
          </Link>
        </div>
      )}
    </div>
  )
}
