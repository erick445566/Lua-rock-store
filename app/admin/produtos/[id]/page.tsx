'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  original_price: number | null
  category_id: string
  image_url: string
  images: string[]
  stock: number
  featured: boolean
  active: boolean
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      
      const [productRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', params.id).single(),
        supabase.from('categories').select('*').order('name')
      ])
      
      if (productRes.data) setProduct(productRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }
    loadData()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      })

      if (!res.ok) throw new Error('Erro ao atualizar produto')

      toast.success('Produto atualizado com sucesso!')
      router.push('/admin/produtos')
    } catch (error) {
      toast.error('Erro ao atualizar produto')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products?id=${params.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Erro ao excluir produto')

      toast.success('Produto excluido com sucesso!')
      router.push('/admin/produtos')
    } catch (error) {
      toast.error('Erro ao excluir produto')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Produto nao encontrado</p>
        <Link href="/admin/produtos">
          <Button className="mt-4">Voltar para Produtos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/produtos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Editar Produto</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
          Excluir
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={product.slug}
              onChange={(e) => setProduct({ ...product, slug: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descricao</Label>
          <Textarea
            id="description"
            value={product.description || ''}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">Preco (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="original_price">Preco Original (R$)</Label>
            <Input
              id="original_price"
              type="number"
              step="0.01"
              value={product.original_price || ''}
              onChange={(e) => setProduct({ ...product, original_price: e.target.value ? parseFloat(e.target.value) : null })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Estoque</Label>
            <Input
              id="stock"
              type="number"
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={product.category_id}
            onValueChange={(value) => setProduct({ ...product, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image_url">URL da Imagem Principal</Label>
          <Input
            id="image_url"
            value={product.image_url || ''}
            onChange={(e) => setProduct({ ...product, image_url: e.target.value })}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Switch
              id="featured"
              checked={product.featured}
              onCheckedChange={(checked) => setProduct({ ...product, featured: checked })}
            />
            <Label htmlFor="featured">Produto em Destaque</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="active"
              checked={product.active}
              onCheckedChange={(checked) => setProduct({ ...product, active: checked })}
            />
            <Label htmlFor="active">Produto Ativo</Label>
          </div>
        </div>

        <Button type="submit" disabled={saving} className="w-full md:w-auto">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar Alteracoes
        </Button>
      </form>
    </div>
  )
}
