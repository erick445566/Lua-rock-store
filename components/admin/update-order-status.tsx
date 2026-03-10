"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface UpdateOrderStatusProps {
  orderId: string
  currentStatus: string
}

const statuses = [
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Em processamento' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
]

export function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    if (status === currentStatus) return
    
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error

      toast.success('Status atualizado com sucesso!')
      router.refresh()
    } catch {
      toast.error('Erro ao atualizar status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {statuses.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={isLoading || status === currentStatus}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Salvando...' : 'Atualizar'}
      </button>
    </div>
  )
}
