"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Moon, Shield, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toast.error('Credenciais inválidas')
        return
      }

      // Check if user is admin
      const isAdmin = data.user?.user_metadata?.is_admin === true

      if (!isAdmin) {
        await supabase.auth.signOut()
        toast.error('Acesso não autorizado')
        return
      }

      toast.success('Bem-vindo ao painel administrativo!')
      router.push('/admin')
      router.refresh()
    } catch {
      toast.error('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Moon className="w-8 h-8 text-primary" />
            <span className="font-[var(--font-display)] text-2xl font-bold tracking-wider">
              <span className="text-primary">LUA</span>
              <span className="text-foreground"> ROCK</span>
            </span>
          </div>
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Acesso restrito a administradores
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
                placeholder="admin@luarockstore.com"
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
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>

        {/* Note */}
        <p className="text-center mt-6 text-xs text-muted-foreground">
          Para criar uma conta admin, registre-se normalmente e defina is_admin: true nos metadados do usuário.
        </p>
      </div>
    </div>
  )
}
