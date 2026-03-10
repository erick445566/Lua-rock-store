import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowRight,
  Clock
} from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get stats
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { count: totalCustomers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: ordersTotal } = await supabase
    .from('orders')
    .select('total')
    .not('status', 'eq', 'cancelled')

  const totalRevenue = ordersTotal?.reduce((sum, order) => sum + order.total, 0) || 0

  const { data: topProducts } = await supabase
    .from('order_items')
    .select('product_id, quantity, products(name)')
    .limit(5)

  const stats = [
    { 
      label: 'Receita Total', 
      value: formatPrice(totalRevenue), 
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      label: 'Pedidos', 
      value: totalOrders || 0, 
      icon: ShoppingCart,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Produtos', 
      value: totalProducts || 0, 
      icon: Package,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Clientes', 
      value: totalCustomers || 0, 
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
  ]

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-yellow-500/10 text-yellow-500' },
    processing: { label: 'Processando', color: 'bg-blue-500/10 text-blue-500' },
    shipped: { label: 'Enviado', color: 'bg-purple-500/10 text-purple-500' },
    delivered: { label: 'Entregue', color: 'bg-green-500/10 text-green-500' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/10 text-red-500' },
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua loja</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-bold">Pedidos Recentes</h2>
            <Link href="/admin/pedidos" className="text-sm text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map(order => {
                const status = statusLabels[order.status] || statusLabels.pending
                return (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                        {status.label}
                      </span>
                      <p className="text-sm font-medium mt-1">{formatPrice(order.total)}</p>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum pedido ainda
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold mb-4">Ações Rápidas</h2>
          <div className="grid gap-3">
            <Link
              href="/admin/produtos/novo"
              className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Adicionar Produto</p>
                <p className="text-sm text-muted-foreground">Cadastre um novo produto na loja</p>
              </div>
            </Link>
            <Link
              href="/admin/pedidos"
              className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Gerenciar Pedidos</p>
                <p className="text-sm text-muted-foreground">Atualize status dos pedidos</p>
              </div>
            </Link>
            <Link
              href="/admin/categorias"
              className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Categorias</p>
                <p className="text-sm text-muted-foreground">Organize as categorias da loja</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
