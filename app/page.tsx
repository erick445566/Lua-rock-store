import Link from 'next/link'
import { ArrowRight, Sparkles, Flame, Zap, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/product-card'
import { CategoryCard } from '@/components/category-card'
import { HeroBanner } from '@/components/hero-banner'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('featured', true)
    .eq('active', true)
    .limit(4)

  const { data: newProducts } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroBanner />

      {/* Categories */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-2xl lg:text-3xl font-bold">Categorias</h2>
            </div>
            <Link 
              href="/categorias" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories?.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-12 lg:py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl lg:text-3xl font-bold">Em Destaque</h2>
              </div>
              <Link 
                href="/loja?destaque=true" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 p-8 lg:p-12">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent">Oferta Especial</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-balance">
                  Frete Grátis em compras acima de R$ 199
                </h3>
                <p className="text-muted-foreground">Aproveite para montar sua coleção!</p>
              </div>
              <Link
                href="/loja"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Comprar Agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 lg:py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl lg:text-3xl font-bold">Novidades</h2>
            </div>
            <Link 
              href="/loja?ordem=recentes" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {newProducts?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Fique por dentro das novidades!
            </h3>
            <p className="text-muted-foreground mb-6">
              Cadastre-se e receba ofertas exclusivas, lançamentos e promoções diretamente no seu e-mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
