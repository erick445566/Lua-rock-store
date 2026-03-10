import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { User, Package, MapPin, LogOut, ChevronRight, ShoppingBag, Settings } from 'lucide-react'

export const metadata = {
  title: 'Minha Conta | Lua Rock Store',
}

export default async function ContaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const menuItems = [
    { href: '/conta/perfil', icon: User, label: 'Meu Perfil', description: 'Dados pessoais e preferências' },
    { href: '/conta/pedidos', icon: Package, label: 'Meus Pedidos', description: 'Histórico e acompanhamento' },
    { href: '/conta/enderecos', icon: MapPin, label: 'Endereços', description: 'Gerenciar endereços de entrega' },
    { href: '/conta/configuracoes', icon: Settings, label: 'Configurações', description: 'Senha e preferências' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Minha Conta</h1>
        <p className="text-muted-foreground">
          Olá, <span className="text-foreground font-medium">{profile?.full_name || user.email}</span>!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Menu */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {menuItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium group-hover:text-primary transition-colors">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Pedidos Recentes</h2>
              <Link href="/conta/pedidos" className="text-sm text-primary hover:underline">
                Ver todos
              </Link>
            </div>

            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <Link
                    key={order.id}
                    href={`/pedido/${order.id}`}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                        order.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {order.status === 'pending' && 'Pendente'}
                        {order.status === 'processing' && 'Em processamento'}
                        {order.status === 'shipped' && 'Enviado'}
                        {order.status === 'delivered' && 'Entregue'}
                        {order.status === 'cancelled' && 'Cancelado'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-card border border-border rounded-xl text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
                <Link
                  href="/loja"
                  className="inline-flex px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  Explorar produtos
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-bold">{profile?.full_name || 'Usuário'}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <hr className="border-border my-4" />

            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair da conta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
