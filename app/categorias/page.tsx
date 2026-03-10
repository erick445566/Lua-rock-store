import { createClient } from '@/lib/supabase/server'
import { CategoryCard } from '@/components/category-card'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Categorias | Lua Rock Store',
  description: 'Explore nossas categorias de produtos geek, animes, rock e cultura pop.',
}

export default async function CategoriasPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Explore</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Nossas Categorias</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Encontre produtos incríveis em cada universo. De animes a rock, temos tudo para você!
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {categories?.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
