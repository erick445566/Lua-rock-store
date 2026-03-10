import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false
  return user.user_metadata?.is_admin === true
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { id, status } = body
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Order update error:', error)
      return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
