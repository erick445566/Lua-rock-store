import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { Users, Mail, Calendar } from 'lucide-react'

export default async function AdminClientesPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <p className="text-muted-foreground">Lista de clientes cadastrados</p>
      </div>

      {/* Clients Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-4 font-medium text-sm">Cliente</th>
                <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Telefone</th>
                <th className="text-left p-4 font-medium text-sm">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles && profiles.length > 0 ? (
                profiles.map(profile => (
                  <tr key={profile.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {profile.full_name?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{profile.full_name || 'Sem nome'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {profile.email || '-'}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{profile.phone || '-'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(profile.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhum cliente cadastrado</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
