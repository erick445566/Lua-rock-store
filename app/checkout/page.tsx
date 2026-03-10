"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/cart-context'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ShoppingBag, CreditCard, QrCode, FileText, ChevronLeft, Truck, Check } from 'lucide-react'

type PaymentMethod = 'pix' | 'cartao' | 'boleto'

const shippingOptions = [
  { id: 'pac', name: 'PAC', days: '8-12 dias úteis', price: 25.90 },
  { id: 'sedex', name: 'SEDEX', days: '3-5 dias úteis', price: 45.90 },
  { id: 'gratis', name: 'Frete Grátis', days: '10-15 dias úteis', price: 0, minOrder: 199 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [selectedShipping, setSelectedShipping] = useState('pac')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  })

  const shippingPrice = shippingOptions.find(s => s.id === selectedShipping)?.price || 0
  const finalPrice = totalPrice + shippingPrice

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          status: 'pending',
          total: finalPrice,
          shipping_address: {
            ...formData,
            shipping_method: selectedShipping,
            shipping_price: shippingPrice,
          },
          payment_method: paymentMethod,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      toast.success('Pedido realizado com sucesso!')
      router.push(`/pedido/${order.id}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Erro ao processar pedido. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
        <Link
          href="/loja"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
        >
          Explorar Produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <Link
        href="/carrinho"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar ao carrinho
      </Link>

      <h1 className="text-3xl lg:text-4xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Dados Pessoais</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nome Completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Endereço de Entrega</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Complemento</label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione...</option>
                    {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Frete
              </h2>
              <div className="space-y-3">
                {shippingOptions.map(option => {
                  const isDisabled = option.minOrder && totalPrice < option.minOrder
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedShipping === option.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          disabled={isDisabled}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-muted-foreground">{option.days}</p>
                          {option.minOrder && (
                            <p className="text-xs text-primary">Acima de {formatPrice(option.minOrder)}</p>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold">
                        {option.price === 0 ? 'Grátis' : formatPrice(option.price)}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold mb-4">Forma de Pagamento</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { id: 'pix', label: 'Pix', icon: QrCode, discount: '5% de desconto' },
                  { id: 'cartao', label: 'Cartão', icon: CreditCard, discount: 'Até 12x' },
                  { id: 'boleto', label: 'Boleto', icon: FileText, discount: '' },
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-4 border rounded-xl text-center transition-colors ${
                      paymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <method.icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="font-medium">{method.label}</p>
                    {method.discount && (
                      <p className="text-xs text-primary mt-1">{method.discount}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 bg-secondary rounded overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 m-auto text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-border my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>{shippingPrice === 0 ? 'Grátis' : formatPrice(shippingPrice)}</span>
                </div>
                {paymentMethod === 'pix' && (
                  <div className="flex justify-between text-green-500">
                    <span>Desconto Pix (5%)</span>
                    <span>-{formatPrice(finalPrice * 0.05)}</span>
                  </div>
                )}
              </div>

              <hr className="border-border my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(paymentMethod === 'pix' ? finalPrice * 0.95 : finalPrice)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Processando...'
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Finalizar Pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
