import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Plus, Package, Edit, Eye, EyeOff, Search } from 'lucide-react'

export default async function AdminProdutosPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">Gerencie os produtos da loja</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 font-medium text-sm">Produto</th>
                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Categoria</th>
                <th className="text-left p-4 font-medium text-sm">Preço</th>
                <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Estoque</th>
                <th className="text-left p-4 font-medium text-sm hidden sm:table-cell">Status</th>
                <th className="text-right p-4 font-medium text-sm">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products && products.length > 0 ? (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm">{product.categories?.name || '-'}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-primary">{formatPrice(product.price)}</p>
                        {product.original_price && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.original_price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className={`text-sm ${product.stock <= 5 ? 'text-red-500' : ''}`}>
                        {product.stock} un
                      </span>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                        product.active 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {product.active ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Inativo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/produtos/${product.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhum produto cadastrado</p>
                    <Link
                      href="/admin/produtos/novo"
                      className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar primeiro produto
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
