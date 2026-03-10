import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false
  return user.user_metadata?.is_admin === true
}

export async function POST(request: Request) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const supabase = await createClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Product create error:', error)
      return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Product error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Product update error:', error)
      return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Product error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID do produto não fornecido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Product delete error:', error)
      return NextResponse.json({ error: 'Erro ao excluir produto' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product error:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
