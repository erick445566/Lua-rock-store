import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'
import { UpdateOrderStatus } from '@/components/admin/update-order-status'
import { ChevronLeft, ShoppingBag, MapPin, CreditCard, User } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminPedidoPage({ params }: PageProps) {
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

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar para pedidos
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pedido #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">
            Realizado em {formatDate(order.created_at)}
          </p>
        </div>
        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                    <p className="font-medium">{item.products?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          {order.shipping_address && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="font-bold">Cliente</h2>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_address.nome}</p>
                  <p className="text-muted-foreground">{order.shipping_address.email}</p>
                  <p className="text-muted-foreground">{order.shipping_address.telefone}</p>
                  <p className="text-muted-foreground">CPF: {order.shipping_address.cpf}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-bold">Endereço de Entrega</h2>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{order.shipping_address.endereco}, {order.shipping_address.numero}</p>
                  {order.shipping_address.complemento && <p>{order.shipping_address.complemento}</p>}
                  <p>{order.shipping_address.bairro}</p>
                  <p>{order.shipping_address.cidade} - {order.shipping_address.estado}</p>
                  <p>CEP: {order.shipping_address.cep}</p>
                </div>
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
                <span className="text-muted-foreground">Método de Envio</span>
                <span className="capitalize">{order.shipping_address?.shipping_method || '-'}</span>
              </div>
            </div>

            <hr className="border-border my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>

            <hr className="border-border my-4" />

            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Pagamento:</span>
              <span className="capitalize font-medium">{order.payment_method}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
