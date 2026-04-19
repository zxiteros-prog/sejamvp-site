"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  ShoppingBag,
  Gamepad2,
  Users,
  Cpu,
  Headset,
  Download,
  MessageSquare,
  MessageCircle,
  Instagram,
  Youtube,
  Music2,
  ClipboardCheck,
  Wifi,
} from "lucide-react";
import { Marquee } from "@/components/Marquee";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

const features = [
  {
    icon: Gamepad2,
    title: "Jogabilidade Única",
    description:
      "Mecanica completa para uma experiencia confortavel e inesquecivel",
  },
  {
    icon: Users,
    title: "Comunidade Ativa",
    description:
      "Milhares de jogadores criando histórias e experiências únicas todos os dias.",
  },
  {
    icon: Cpu,
    title: "Sistemas Exclusivos",
    description:
      "Mecânicas próprias desenvolvidas para a melhor experiência de FiveM.",
  },
  {
    icon: Headset,
    title: "Suporte 24/7",
    description:
      "Equipe dedicada para garantir a melhor experiência para todos os jogadores.",
  },
];

const steps = [
  {
    icon: Download,
    step: 1,
    title: "Baixe o FiveM",
    description:
      "Faça o download do FiveM em fivem.net e instale no seu computador.",
  },
  {
    icon: MessageSquare,
    step: 2,
    title: "Entre no Discord",
    description:
      "Acesse nosso Discord para liberar seu acesso e conhecer a comunidade.",
  },
  {
    icon: ClipboardCheck,
    step: 3,
    title: "Libere seu Token",
    description:
      "Complete o processo de autenticação, liberando seu token exclusivo no Discord.",
  },
  {
    icon: Wifi,
    step: 4,
    title: "Conecte-se",
    description:
      "Use o IP do servidor no FiveM e comece sua nova vida na cidade.",
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setUpdates(data.updates || []))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-bg pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold uppercase tracking-widest">
              Academy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none mb-6"
          >
            <span className="text-gradient glow-text">SEJA</span>
            <br />
            <span className="text-text-primary">MVP</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Se divirta em um servidor de FiveM do jeito que tem que ser, seja
            você mesmo, não um outro alguém, aqui é um jogo, não a sua segunda
            vida.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="fivem://connect/sejamvp.com"
              className="group flex items-center gap-3 bg-accent text-bg font-bold px-10 py-4 rounded-xl text-lg hover:bg-accent-dim transition-all hover:scale-105 active:scale-95 glow"
            >
              JOGAR
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-text-muted rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-accent rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="py-6 border-y border-border/30 bg-bg-card">
        <Marquee
          text="SEJA MVP • ACADEMY • FIVEM • ENTRE AGORA"
          className="text-text-muted/40 font-bold text-sm tracking-widest uppercase"
        />
      </div>

      {/* About */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="max-w-3xl mb-20">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
                Sobre a Cidade
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary mb-6 leading-tight">
                De jogadores <br />
                <span className="text-gradient">para jogadores</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                MVP é um servidor onde cada jogador constrói sua
                própria história. Com sistemas únicos, jogabilidade justa e uma
                comunidade acolhedora, oferecemos a experiência definitiva.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <div className="group bg-bg-card border border-border/50 rounded-2xl p-8 hover:border-accent/30 transition-all duration-500 hover:bg-bg-elevated h-full">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <feature.icon size={24} className="text-accent" />
                  </div>
                  <h3 className="text-text-primary font-bold text-lg mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Preview */}
      <section className="py-32 px-6 bg-bg-card border-y border-border/30 noise-bg">
        <div className="relative z-10 max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
                Primeiros Passos
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary mb-6">
                Como Jogar
              </h2>
              <p className="text-text-secondary text-lg">
                Siga estes passos simples e comece sua jornada na cidade
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.15}>
                <div className="relative group">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-black text-bg text-sm z-10">
                    {step.step}
                  </div>
                  <div className="bg-bg border border-border/50 rounded-2xl p-8 pt-10 hover:border-accent/30 transition-all duration-500 h-full">
                    <step.icon
                      size={32}
                      className="text-accent mb-6 opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <h3 className="text-text-primary font-bold text-lg mb-3">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5}>
            <div className="text-center mt-12">
              <Link
                href="/como-jogar"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:underline underline-offset-4"
              >
                Ver guia completo
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Store CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="relative overflow-hidden bg-gradient-to-br from-accent/10 via-bg-card to-bg-elevated border border-accent/20 rounded-3xl p-12 md:p-20 text-center">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
                  MVP LOJA
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-text-primary mb-6">
                  Confira nossa
                  <br />
                  <span className="text-gradient">Loja Oficial</span>
                </h2>
                <p className="text-text-secondary text-lg max-w-lg mx-auto mb-10">
                  Itens exclusivos, veículos limitados e muito mais para turbinar
                  sua experiência na cidade.
                </p>
                <a
                  href="https://mvpgg.centralcart.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-accent text-bg font-bold px-12 py-5 rounded-xl text-xl hover:bg-accent-dim transition-all hover:scale-105 active:scale-95 glow"
                >
                  <ShoppingBag size={24} />
                  VISITAR LOJA
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Social / Latest Updates */}
      <section className="py-32 px-6 bg-bg-card border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <AnimatedSection>
              <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
                Fique por dentro
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-8">
                Redes Sociais
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "Discord",
                    href: "https://discord.gg/mvpgg",
                    icon: MessageCircle,
                  },
                  {
                    name: "Instagram",
                    href: "https://instagram.com/joguemvp",
                    icon: Instagram,
                  },
                  {
                    name: "YouTube",
                    href: "https://www.youtube.com/@grindelxd",
                    icon: Youtube,
                  },
                  {
                    name: "TikTok",
                    href: "https://www.tiktok.com/@joguemvp",
                    icon: Music2,
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-bg border border-border/50 rounded-xl p-6 hover:border-accent/30 transition-all group flex items-center gap-3"
                  >
                    <span className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors">
                      <social.icon size={17} />
                    </span>
                    <span className="text-text-primary font-bold group-hover:text-accent transition-colors">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
                Novidades
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-8">
                Atualizações
              </h2>
              <div className="space-y-4">
                {updates.map((update) => (
                  <Link
                    key={update.id}
                    href="/atualizacoes"
                    className="block bg-bg border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-all group"
                  >
                    <p className="text-text-secondary text-xs mb-1">
                      {formatDate(update.date)}
                    </p>
                    <p className="text-text-primary font-semibold group-hover:text-accent transition-colors text-sm">
                      {update.title}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                href="/atualizacoes"
                className="inline-flex items-center gap-2 text-accent font-semibold mt-6 hover:underline underline-offset-4 text-sm"
              >
                Ver todas as atualizações
                <ArrowRight size={14} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Bottom Marquee */}
      <div className="py-6 border-t border-border/30 bg-bg">
        <Marquee
          text="SEJA MVP • ROLEPLAY • COMUNIDADE • IMERSÃO • DIVERSÃO • GTA V"
          reverse
          className="text-text-muted/30 font-bold text-sm tracking-widest uppercase"
        />
      </div>
    </>
  );
}
