import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Tv, Music, Home, Gamepad2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
}

interface CategoryCardProps {
  category: Category
}

const categoryIcons: Record<string, typeof Sparkles> = {
  'animes': Sparkles,
  'series': Tv,
  'camisas-de-rock': Music,
  'decoracoes': Home,
  'geek-nerd': Gamepad2,
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug] || Sparkles

  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group relative flex flex-col items-center justify-center p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 min-h-[140px]"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

      {/* Icon or Image */}
      {category.image_url ? (
        <div className="relative w-16 h-16 mb-3 rounded-full overflow-hidden">
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-14 h-14 mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      )}

      {/* Name */}
      <h3 className="font-medium text-sm text-center group-hover:text-primary transition-colors">
        {category.name}
      </h3>
    </Link>
  )
}
