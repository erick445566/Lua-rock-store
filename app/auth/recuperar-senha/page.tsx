"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Moon, ArrowLeft, Send } from 'lucide-react'

export default function RecuperarSenhaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/nova-senha`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setSent(true)
      toast.success('E-mail enviado! Verifique sua caixa de entrada.')
    } catch {
      toast.error('Erro ao enviar e-mail. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">E-mail enviado!</h1>
          <p className="text-muted-foreground mb-6">
            Enviamos um link para redefinir sua senha para <strong>{email}</strong>. 
            Verifique sua caixa de entrada.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Moon className="w-10 h-10 text-primary" />
            <span className="font-[var(--font-display)] text-2xl font-bold tracking-wider">
              <span className="text-primary">LUA</span>
              <span className="text-foreground"> ROCK</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Recuperar senha</h1>
          <p className="text-muted-foreground mt-2">
            Digite seu e-mail para receber um link de recuperação
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6">
          <div>
            <label className="text-sm font-medium mb-1.5 block">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        {/* Back Link */}
        <p className="text-center mt-6">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}
