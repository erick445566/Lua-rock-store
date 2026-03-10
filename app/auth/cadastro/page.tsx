"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Moon, Eye, EyeOff, UserPlus } from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nome,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/conta`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Conta criada! Verifique seu e-mail para confirmar.')
      router.push('/auth/verificar-email')
    } catch {
      toast.error('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold">Criar sua conta</h1>
          <p className="text-muted-foreground mt-2">
            Junte-se à comunidade Lua Rock!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nome Completo</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                placeholder="Seu nome"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">E-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Confirmar Senha</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Repita a senha"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              'Criando conta...'
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Criar Conta
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>
            {' '}e{' '}
            <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
          </p>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
