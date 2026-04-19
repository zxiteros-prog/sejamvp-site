import Link from "next/link";
import { Instagram, MessageCircle, Music2, Youtube } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Início" },
  { href: "/como-jogar", label: "Como Jogar" },
  { href: "/calendario", label: "Calendário" },
  { href: "/atualizacoes", label: "Atualizações" },
];

const socialLinks = [
  { href: "https://discord.gg/mvpgg", label: "Discord", icon: MessageCircle },
  { href: "https://instagram.com/joguemvp", label: "Instagram", icon: Instagram },
  { href: "https://youtube.com/@grindelxd", label: "YouTube", icon: Youtube },
  { href: "https://tiktok.com/@joguemvp", label: "TikTok", icon: Music2 },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-bg">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-black text-bg text-sm tracking-tighter">
                MVP
              </div>
              <span className="text-text-primary font-bold text-lg tracking-tight">
                SEJA MVP
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              A cidade que você merece. Academy imersiva com uma comunidade
              incrível e sistemas únicos.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="w-10 h-10 rounded-xl bg-bg border border-border/50 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-bg-card border border-border/60 rounded-2xl px-5 py-3 md:px-6 md:py-3 flex items-center gap-4 md:gap-6 min-h-[72px]">
              <div className="flex-1">
                <h4 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                  Classificação Indicativa
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Sangue e violência gráfica, violência intensa, humor maduro,
                  nudez, linguagem forte, conteúdo sexual intenso, uso de drogas
                  e álcool.
                </p>
                <p className="text-text-muted text-[11px] leading-relaxed mt-2">
                  Compras dentro do jogo, interação entre usuários.
                </p>
              </div>
              <div className="w-14 h-16 md:w-16 md:h-20 rounded-xl bg-black border border-border/80 flex items-center justify-center">
                <span className="text-text-primary font-black text-xl md:text-2xl leading-none">
                  18
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} SEJA MVP. Todos os direitos reservados.
          </p>
          <p className="text-text-muted text-xs">Academy — Domínio SEJAMVP</p>
        </div>
      </div>
    </footer>
  );
}
