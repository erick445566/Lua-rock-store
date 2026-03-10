"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Mail, MessageCircle, Instagram, MapPin, Send, Phone } from 'lucide-react'

export default function ContatoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        })

      if (error) throw error

      toast.success('Mensagem enviada com sucesso! Responderemos em breve.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Fale Conosco</h1>
        <p className="text-muted-foreground">
          Tem dúvidas, sugestões ou precisa de ajuda? Estamos aqui para você!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-bold mb-4">Canais de Atendimento</h2>
            
            <div className="space-y-4">
              <a
                href="https://wa.me/5575990568677"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">(75) 99056-8677</p>
                </div>
              </a>

              <a
                href="mailto:contato@luarockstore.com"
                className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-sm text-muted-foreground">contato@luarockstore.com</p>
                </div>
              </a>

              <a
                href="https://instagram.com/luarockstore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="font-medium">Instagram</p>
                  <p className="text-sm text-muted-foreground">@luarockstore</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-3">Horário de Atendimento</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Segunda a Sexta: 9h às 18h</p>
              <p>Sábado: 9h às 13h</p>
              <p>Domingo e Feriados: Fechado</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Envio</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Enviamos para todo o Brasil via Correios e transportadoras parceiras.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-6">Envie sua mensagem</h2>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-1.5 block">Assunto</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione um assunto</option>
                <option value="duvida">Dúvida sobre produto</option>
                <option value="pedido">Informação sobre pedido</option>
                <option value="troca">Troca ou devolução</option>
                <option value="parceria">Proposta de parceria</option>
                <option value="outro">Outro assunto</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium mb-1.5 block">Mensagem</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                placeholder="Escreva sua mensagem..."
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                'Enviando...'
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Mensagem
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
