"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { formatPrice } from '@/lib/utils'

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-8">
            Adicione produtos incríveis ao seu carrinho e volte aqui para finalizar sua compra.
          </p>
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Explorar Produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {items.map(item => (
                <div key={item.id} className="p-4 lg:p-6 flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/produto/${item.id}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-primary font-semibold mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Mobile Quantity */}
                    <div className="flex items-center justify-between mt-3 lg:hidden">
                      <div className="flex items-center bg-secondary rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Quantity & Remove */}
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="flex items-center bg-secondary rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right w-28">
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping */}
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Continuar comprando
          </Link>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} itens)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-muted-foreground">Calculado no checkout</span>
              </div>
            </div>

            <hr className="border-border my-4" />

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-center flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              Finalizar Compra
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3">Formas de pagamento</p>
              <div className="flex items-center justify-center gap-4 text-muted-foreground">
                <span className="text-xs">Pix</span>
                <span className="text-xs">Cartão</span>
                <span className="text-xs">Boleto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
