import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { MessageSquare, Mail, Clock } from 'lucide-react'

export default async function AdminMensagensPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mensagens</h1>
        <p className="text-muted-foreground">Mensagens recebidas pelo formulário de contato</p>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages && messages.length > 0 ? (
          messages.map(message => (
            <div key={message.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold">{message.subject}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {message.name} ({message.email})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                </div>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  message.read 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {message.read ? 'Lida' : 'Nova'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {message.message}
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <a 
                  href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                  className="text-sm text-primary hover:underline"
                >
                  Responder por email
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">Nenhuma mensagem recebida</p>
          </div>
        )}
      </div>
    </div>
  )
}
