"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'
import { ChevronLeft, Save, Upload, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NovoProdutoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    stock: '10',
    category_id: '',
    image_url: '',
    featured: false,
    active: true,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('*').order('name')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: slugify(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase.from('products').insert({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock),
        category_id: formData.category_id || null,
        image_url: formData.image_url || null,
        featured: formData.featured,
        active: formData.active,
      })

      if (error) throw error

      toast.success('Produto criado com sucesso!')
      router.push('/admin/produtos')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Erro ao criar produto')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Link
        href="/admin/produtos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar para produtos
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Novo Produto</h1>
        <p className="text-muted-foreground">Cadastre um novo produto na loja</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nome do Produto *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Ex: Camiseta Naruto Akatsuki"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="camiseta-naruto-akatsuki"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">URL amigável do produto</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Descreva o produto..."
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Preço *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="99.90"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Preço Original</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                placeholder="129.90"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">Preço antes do desconto (opcional)</p>
            </div>
          </div>

          {/* Category & Stock */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Categoria</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Estoque</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">URL da Imagem</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Cole a URL de uma imagem externa</p>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm">Produto em destaque</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm">Produto ativo (visível na loja)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Link
            href="/admin/produtos"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  )
}
