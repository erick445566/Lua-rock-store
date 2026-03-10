import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

export default function VerificarEmailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-bold mb-4">Verifique seu e-mail</h1>
        
        <p className="text-muted-foreground mb-6">
          Enviamos um link de confirmação para o seu e-mail. 
          Clique no link para ativar sua conta e começar a explorar a Lua Rock Store!
        </p>

        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground">
            Não recebeu o e-mail? Verifique sua pasta de spam ou solicite um novo link.
          </p>
        </div>

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
