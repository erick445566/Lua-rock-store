import { Moon, Sparkles, Truck, Shield, Heart, Users } from 'lucide-react'

export const metadata = {
  title: 'Sobre Nós | Lua Rock Store',
  description: 'Conheça a Lua Rock Store, sua loja geek e rock favorita. Produtos de animes, séries, rock e cultura pop.',
}

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
          <Moon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Nossa História</span>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
          Bem-vindo à <span className="text-primary">Lua Rock Store</span>
        </h1>
        
        <p className="text-lg text-muted-foreground leading-relaxed">
          Somos uma loja geek alternativa apaixonada por animes, séries, filmes, rock e toda a cultura pop. 
          Nossa missão é trazer produtos únicos e de qualidade para você expressar seu estilo e paixões.
        </p>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: Sparkles,
            title: 'Produtos Exclusivos',
            description: 'Selecionamos cuidadosamente cada item para garantir qualidade e originalidade.',
          },
          {
            icon: Truck,
            title: 'Envio para Todo Brasil',
            description: 'Entregamos em qualquer lugar do país com segurança e rastreamento.',
          },
          {
            icon: Shield,
            title: 'Compra Segura',
            description: 'Seus dados estão protegidos e oferecemos diversas formas de pagamento.',
          },
          {
            icon: Heart,
            title: 'Feito com Amor',
            description: 'Cada pedido é preparado com carinho especial para nossos clientes.',
          },
          {
            icon: Users,
            title: 'Comunidade',
            description: 'Fazemos parte da comunidade geek e entendemos suas paixões.',
          },
          {
            icon: Moon,
            title: 'Estilo Alternativo',
            description: 'Celebramos a cultura alternativa, do rock ao anime, sem limites.',
          },
        ].map((value) => (
          <div
            key={value.title}
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <value.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{value.title}</h3>
            <p className="text-muted-foreground text-sm">{value.description}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 lg:p-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Nossa História</h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Lua Rock Store nasceu da paixão por dois universos que parecem diferentes, mas se complementam perfeitamente: 
              o mundo geek e a cultura rock. Começamos como um pequeno projeto entre amigos que compartilhavam o amor por 
              animes, séries, quadrinhos e música pesada.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-4">
              Com o tempo, percebemos que havia muitas pessoas como nós, buscando produtos que representassem suas paixões 
              de forma autêntica e com qualidade. Foi assim que decidimos transformar nosso hobby em uma loja completa, 
              trazendo o melhor da cultura pop e alternativa para todo o Brasil.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Hoje, a Lua Rock Store é mais do que uma loja - somos uma comunidade. Cada produto que vendemos carrega 
              um pedaço da nossa história e da cultura que tanto amamos. Seja você fã de anime, rocker de carteirinha 
              ou simplesmente alguém que aprecia o diferente, você é bem-vindo aqui.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-primary font-medium text-lg">
              Seu universo geek e rock em um só lugar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
