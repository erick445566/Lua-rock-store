"use client"

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  stock: number
}

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Produto esgotado')
      return
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      })
    }

    setAdded(true)
    toast.success(`${quantity} ${quantity === 1 ? 'item adicionado' : 'itens adicionados'} ao carrinho!`)
    
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="w-full py-4 bg-muted text-muted-foreground rounded-xl font-semibold text-lg cursor-not-allowed"
      >
        Produto Esgotado
      </button>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center justify-center bg-secondary rounded-xl">
        <button
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
          className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
          aria-label="Diminuir quantidade"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= product.stock}
          className="w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
          aria-label="Aumentar quantidade"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={added}
        className={`flex-1 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {added ? (
          <>
            <Check className="w-6 h-6" />
            Adicionado!
          </>
        ) : (
          <>
            <ShoppingCart className="w-6 h-6" />
            Adicionar ao Carrinho
          </>
        )}
      </button>
    </div>
  )
}
