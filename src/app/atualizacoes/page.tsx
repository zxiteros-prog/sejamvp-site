"use client";

import { motion } from "motion/react";
import { FileText, Tag, Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useEffect, useState } from "react";

interface Update {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Atualizacoes() {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setUpdates(data.updates || []))
      .catch(() => {});
  }, []);

  const sorted = [...updates].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <section className="relative pt-40 pb-20 px-6 overflow-hidden noise-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-bg pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold uppercase tracking-widest mb-6"
          >
            Changelog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-text-primary mb-6"
          >
            <span className="text-gradient">Atualizações</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto"
          >
            Acompanhe todas as novidades e melhorias do servidor
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border/50" />

            <div className="space-y-8">
              {sorted.map((update, i) => (
                <AnimatedSection key={update.id} delay={i * 0.08}>
                  <div className="relative pl-12 md:pl-20">
                    <div className="absolute left-[10px] md:left-[26px] top-8 w-3 h-3 bg-accent rounded-full ring-4 ring-bg" />

                    <div className="group bg-bg-card border border-border/50 rounded-2xl p-6 md:p-8 hover:border-accent/30 transition-all duration-500">
                      <div className="flex items-center gap-2 text-text-muted text-xs mb-4">
                        <Calendar size={14} />
                        <span>{formatDate(update.date)}</span>
                      </div>

                      <h3 className="text-text-primary font-bold text-xl md:text-2xl mb-3 group-hover:text-accent transition-colors">
                        {update.title}
                      </h3>

                      <p className="text-text-secondary leading-relaxed mb-4">
  {update.description.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))}
</p>

                      <div className="flex flex-wrap gap-2">
                        {update.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-surface border border-border/50 rounded-full text-xs text-text-muted"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {sorted.length === 0 && (
              <div className="text-center py-20">
                <FileText size={48} className="text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary text-lg">
                  Nenhuma atualização disponível no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
