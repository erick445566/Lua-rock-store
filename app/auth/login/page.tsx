"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Moon, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message === 'Invalid login credentials') {
          toast.error('E-mail ou senha incorretos')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Login realizado com sucesso!')
      router.push('/conta')
      router.refresh()
    } catch {
      toast.error('Erro ao fazer login. Tente novamente.')
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
          <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
          <p className="text-muted-foreground mt-2">
            Acesse para gerenciar seus pedidos e favoritos
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6">
          <div className="space-y-4">
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
                  placeholder="Sua senha"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Lembrar de mim</span>
              </label>
              <Link href="/auth/recuperar-senha" className="text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              'Entrando...'
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link href="/auth/cadastro" className="text-primary font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
