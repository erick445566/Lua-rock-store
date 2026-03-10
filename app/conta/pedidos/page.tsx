import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'

export const metadata = {
  title: 'Meus Pedidos | Lua Rock Store',
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-muted text-muted-foreground' },
  processing: { label: 'Em processamento', color: 'bg-yellow-500/10 text-yellow-500' },
  shipped: { label: 'Enviado', color: 'bg-blue-500/10 text-blue-500' },
  delivered: { label: 'Entregue', color: 'bg-green-500/10 text-green-500' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/10 text-red-500' },
}

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        products(name, image_url)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Breadcrumb */}
      <Link
        href="/conta"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar para minha conta
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-primary" />
        <h1 className="text-3xl lg:text-4xl font-bold">Meus Pedidos</h1>
      </div>

      {/* Orders List */}
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusLabels[order.status] || statusLabels.pending
            return (
              <Link
                key={order.id}
                href={`/pedido/${order.id}`}
                className="block bg-card border border-border rounded-xl p-4 lg:p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {order.order_items?.slice(0, 3).map((item: { id: string; products: { image_url: string | null } | null }) => (
                      <div
                        key={item.id}
                        className="w-12 h-12 rounded-lg bg-secondary border-2 border-card overflow-hidden"
                      >
                        {item.products?.image_url ? (
                          <img src={item.products.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {(order.order_items?.length || 0) > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium">
                        +{(order.order_items?.length || 0) - 3}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'item' : 'itens'}
                  </p>
                  <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground mb-6">Você ainda não fez nenhum pedido.</p>
          <Link
            href="/loja"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Explorar produtos
          </Link>
        </div>
      )}
    </div>
  )
}
