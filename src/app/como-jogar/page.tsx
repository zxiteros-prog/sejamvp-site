"use client";

import { motion } from "motion/react";
import {
  Download,
  MessageSquare,
  ClipboardCheck,
  Wifi,
  ArrowRight,
  ShoppingBag,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const steps = [
  {
    icon: Download,
    step: 1,
    title: "Baixe o FiveM",
    description: (
      <>
        Acesse{" "}
        <a
          href="https://fivem.net"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline underline-offset-4"
        >
          fivem.net
        </a>{" "}
        e faça o download do client. O FiveM é a plataforma que permite
        conectar a servidores customizados de GTA V. Certifique-se de ter o GTA
        V original instalado na sua máquina antes de prosseguir.
      </>
    ),
    color: "from-orange-500/20 to-amber-500/20",
  },
  {
    icon: MessageSquare,
    step: 2,
    title: "Entre no Discord",
    description: (
      <>
        Nosso{" "}
        <a
          href="https://discord.gg/mvpgg"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline underline-offset-4"
        >
          Discord
        </a>{" "}
        é o coração da comunidade. Lá você encontrará todas as informações sobre
        o servidor, canais de suporte, e poderá interagir com outros jogadores.
        É também onde o processo para liberar seu token acontece.
      </>
    ),
    color: "from-zinc-300/20 to-orange-500/15",
  },
  {
    icon: ClipboardCheck,
    step: 3,
    title: "Libere seu Token",
    description:
      "A liberação de token é um processo simples que garante que todos os jogadores entendam as regras e o estilo de roleplay do servidor. Siga as orientações com atenção e mostre que você está pronto para a cidade.",
    color: "from-stone-400/20 to-zinc-500/20",
  },
  {
    icon: Wifi,
    step: 4,
    title: "Conecte-se ao Servidor",
    description: (
      <>
        Após liberar seu token, basta abrir o FiveM,{" "}
        <a
          href="https://servers.fivem.net/servers/detail/qlyygz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline underline-offset-4"
        >
          entrar no servidor MVP
        </a>{" "}
        na busca de servidores ou usar nosso IP direto. Crie seu personagem e
        se divirta!
      </>
    ),
    color: "from-amber-600/20 to-orange-600/20",
  },
];

const requirements = [
  { icon: Monitor, label: "Windows 10/11", detail: "Sistema Operacional" },
  { icon: Cpu, label: "i5 ou equivalente", detail: "Processador" },
  { icon: MemoryStick, label: "8GB RAM", detail: "Memória" },
  { icon: HardDrive, label: "100GB livres", detail: "Armazenamento" },
];

export default function ComoJogar() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden noise-bg">
        <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-bg pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold uppercase tracking-widest mb-6"
          >
            Guia Completo
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-text-primary mb-6"
          >
            Como <span className="text-gradient">Jogar</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto"
          >
            Tudo o que você precisa saber para começar sua jornada no servidor
            MVP
          </motion.p>
        </div>
      </section>

      {/* Tutorial Video */}
      <section className="pb-4 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="bg-bg-card border border-border/50 rounded-2xl p-4 md:p-6">
              <video
                className="w-full rounded-xl border border-border/40"
                controls
                preload="metadata"
              >
                <source src="/videos/mvpcomojogar.mp4" type="video/mp4" />
                Seu navegador não suporta vídeo HTML5.
              </video>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {steps.map((step, i) => (
            <AnimatedSection key={step.step} delay={i * 0.1}>
              <div className="relative group">
                <div
                  className={`absolute inset-0 bg-linear-to-r ${step.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                />
                <div className="relative bg-bg-card border border-border/50 rounded-2xl p-8 md:p-10 hover:border-accent/30 transition-all duration-500">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                    <div className="shrink-0">
                      <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center relative">
                        <step.icon size={28} className="text-accent" />
                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-accent rounded-lg flex items-center justify-center font-black text-bg text-xs">
                          {step.step}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-text-primary font-bold text-2xl mb-3">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 px-6 bg-bg-card border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-4 block">
                Requisitos
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-text-primary">
                Requisitos Mínimos
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {requirements.map((req, i) => (
              <AnimatedSection key={req.label} delay={i * 0.1}>
                <div className="bg-bg border border-border/50 rounded-2xl p-6 text-center hover:border-accent/30 transition-all">
                  <req.icon
                    size={28}
                    className="text-accent mx-auto mb-4 opacity-70"
                  />
                  <p className="text-text-primary font-bold text-sm mb-1">
                    {req.label}
                  </p>
                  <p className="text-text-muted text-xs">{req.detail}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-text-primary mb-6">
              Pronto para <span className="text-gradient">começar</span>?
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-lg mx-auto">
              Junte-se a milhares de jogadores e comece a construir sua história
              na cidade SEJA MVP.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://discord.gg/mvpgg"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-accent text-bg font-bold px-10 py-4 rounded-xl text-lg hover:bg-accent-dim transition-all hover:scale-105 active:scale-95"
              >
                Entrar no Discord
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
              <a
                href="https://mvpgg.centralcart.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-surface border border-border text-text-primary font-semibold px-10 py-4 rounded-xl text-lg hover:bg-surface-hover transition-all hover:scale-105 active:scale-95"
              >
                <ShoppingBag size={20} />
                LOJA
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
