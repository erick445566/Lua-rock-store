import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { items, shipping_address, payment_method, shipping_cost } = body

    const subtotal = items.reduce((acc: number, item: { price: number; quantity: number }) => 
      acc + (item.price * item.quantity), 0
    )
    const total = subtotal + (shipping_cost || 0)

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total,
        shipping_address,
        payment_method,
        shipping_cost: shipping_cost || 0,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order error:', orderError)
      return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: { product_id: string; quantity: number; price: number }) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Items error:', itemsError)
      return NextResponse.json({ error: 'Erro ao criar itens do pedido' }, { status: 500 })
    }

    // Clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    return NextResponse.json({ order_id: order.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
