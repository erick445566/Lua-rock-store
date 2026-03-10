import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Moon } from 'lucide-react'

export const metadata = {
  title: 'Admin | Lua Rock Store',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Check if user is admin
  const isAdmin = user.user_metadata?.is_admin === true

  if (!isAdmin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar user={user} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="lg:hidden flex items-center gap-2">
              <Moon className="w-6 h-6 text-primary" />
              <span className="font-bold">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver loja
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
