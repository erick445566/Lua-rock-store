import Link from 'next/link'
import { Moon, Instagram, MessageCircle, Mail, MapPin, CreditCard, Truck } from 'lucide-react'

const footerLinks = {
  loja: [
    { href: '/loja', label: 'Todos os Produtos' },
    { href: '/categorias/animes', label: 'Animes' },
    { href: '/categorias/series', label: 'Séries' },
    { href: '/categorias/rock', label: 'Camisas de Rock' },
    { href: '/categorias/decoracoes', label: 'Decorações' },
  ],
  ajuda: [
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/contato', label: 'Contato' },
    { href: '/faq', label: 'Perguntas Frequentes' },
    { href: '/trocas', label: 'Trocas e Devoluções' },
    { href: '/privacidade', label: 'Política de Privacidade' },
  ],
  conta: [
    { href: '/auth/login', label: 'Entrar' },
    { href: '/auth/cadastro', label: 'Criar Conta' },
    { href: '/conta/pedidos', label: 'Meus Pedidos' },
    { href: '/conta/enderecos', label: 'Endereços' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* Features Banner */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Envio para todo Brasil</p>
                <p className="text-xs text-muted-foreground">Frete calculado no checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Pagamento Seguro</p>
                <p className="text-xs text-muted-foreground">Pix, Cartão e Boleto</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-end">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Suporte via WhatsApp</p>
                <p className="text-xs text-muted-foreground">Resposta rápida</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Moon className="w-8 h-8 text-primary" />
              <span className="font-[var(--font-display)] text-xl font-bold tracking-wider">
                <span className="text-primary">LUA ROCK</span>
                <span className="text-accent font-normal ml-1">store</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Seu universo geek e rock em um só lugar. Produtos exclusivos de animes, séries, rock e cultura pop.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/luarockstore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/5575990568677"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@luarockstore.com"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Loja</h3>
            <ul className="space-y-2">
              {footerLinks.loja.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-2">
              {footerLinks.ajuda.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Minha Conta</h3>
            <ul className="space-y-2">
              {footerLinks.conta.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Lua Rock Store. Todos os direitos reservados.</p>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Envio para todo o Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
