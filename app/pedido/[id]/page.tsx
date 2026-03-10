import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'
import { ChevronLeft, Package, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

const statusSteps = [
  { status: 'pending', label: 'Pedido Recebido', icon: Clock },
  { status: 'processing', label: 'Em Processamento', icon: Package },
  { status: 'shipped', label: 'Enviado', icon: Truck },
  { status: 'delivered', label: 'Entregue', icon: CheckCircle },
]

export default async function PedidoPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        products(name, slug, image_url)
      )
    `)
    .eq('id', id)
    .single()

  if (!order) {
    notFound()
  }

  const currentStatusIndex = statusSteps.findIndex(s => s.status === order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Back */}
      <Link
        href="/conta/pedidos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar para meus pedidos
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">Pedido #{order.id.slice(0, 8)}</h1>
        <p className="text-muted-foreground">
          Realizado em {formatDate(order.created_at)}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          {!isCancelled ? (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-bold mb-6">Status do Pedido</h2>
              <div className="relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
                <div 
                  className="absolute top-5 left-5 h-0.5 bg-primary transition-all"
                  style={{ width: `${Math.max(0, currentStatusIndex) * 33.33}%` }}
                />
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStatusIndex
                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-card border-2 border-border'
                        }`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs mt-2 text-center ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-destructive" />
                <div>
                  <h2 className="font-bold">Pedido Cancelado</h2>
                  <p className="text-sm text-muted-foreground">Este pedido foi cancelado.</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-border">
              <h2 className="font-bold">Itens do Pedido</h2>
            </div>
            <div className="divide-y divide-border">
              {order.order_items?.map((item: { id: string; quantity: number; price: number; products: { name: string; slug: string; image_url: string | null } | null }) => (
                <div key={item.id} className="p-4 lg:p-6 flex gap-4">
                  <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {item.products?.image_url ? (
                      <Image
                        src={item.products.image_url}
                        alt={item.products.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link 
                      href={`/produto/${item.products?.slug}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.products?.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} cada
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-card border border-border rounded-xl p-4 lg:p-6">
              <h2 className="font-bold mb-4">Endereço de Entrega</h2>
              <div className="text-sm text-muted-foreground">
                <p className="text-foreground font-medium">{order.shipping_address.nome}</p>
                <p>{order.shipping_address.endereco}, {order.shipping_address.numero}</p>
                {order.shipping_address.complemento && <p>{order.shipping_address.complemento}</p>}
                <p>{order.shipping_address.bairro}</p>
                <p>{order.shipping_address.cidade} - {order.shipping_address.estado}</p>
                <p>CEP: {order.shipping_address.cep}</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="font-bold mb-4">Resumo</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.total - (order.shipping_address?.shipping_price || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>
                  {order.shipping_address?.shipping_price 
                    ? formatPrice(order.shipping_address.shipping_price) 
                    : 'Grátis'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pagamento</span>
                <span className="capitalize">{order.payment_method}</span>
              </div>
            </div>

            <hr className="border-border my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
