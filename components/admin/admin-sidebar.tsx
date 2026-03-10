"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { 
  Moon, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface AdminSidebarProps {
  user: User
}

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/produtos', icon: Package, label: 'Produtos' },
  { href: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  { href: '/admin/clientes', icon: Users, label: 'Clientes' },
  { href: '/admin/categorias', icon: FolderOpen, label: 'Categorias' },
  { href: '/admin/mensagens', icon: MessageSquare, label: 'Mensagens' },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
        w-64 h-screen bg-card border-r border-border
        flex flex-col
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <Moon className="w-7 h-7 text-primary" />
            <div>
              <span className="font-bold text-lg">Lua Rock <span className="font-normal text-accent">Store</span></span>
              <span className="text-xs text-muted-foreground block">Admin Panel</span>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
