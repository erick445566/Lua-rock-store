import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'
import { ShoppingCart, ChevronRight, Clock } from 'lucide-react'

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-500/10 text-yellow-500' },
  processing: { label: 'Em processamento', color: 'bg-blue-500/10 text-blue-500' },
  shipped: { label: 'Enviado', color: 'bg-purple-500/10 text-purple-500' },
  delivered: { label: 'Entregue', color: 'bg-green-500/10 text-green-500' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/10 text-red-500' },
}

export default async function AdminPedidosPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground">Gerencie os pedidos da loja</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(statusLabels).map(([key, value]) => (
          <button
            key={key}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${value.color}`}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 font-medium text-sm">Pedido</th>
                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Data</th>
                <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Cliente</th>
                <th className="text-left p-4 font-medium text-sm">Total</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-right p-4 font-medium text-sm">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders && orders.length > 0 ? (
                orders.map(order => {
                  const status = statusLabels[order.status] || statusLabels.pending
                  return (
                    <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {formatDate(order.created_at)}
                        </p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {formatDate(order.created_at)}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <p className="text-sm">{order.shipping_address?.nome || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{order.shipping_address?.email || ''}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-primary">{formatPrice(order.total)}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                        >
                          Detalhes
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhum pedido encontrado</p>
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
