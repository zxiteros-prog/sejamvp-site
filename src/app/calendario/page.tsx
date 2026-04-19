"use client";

import { motion } from "motion/react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useEffect, useState } from "react";

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: string;
}

const typeColors: Record<string, string> = {
  evento: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  competicao: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  comunidade: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  atualizacao: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  dominacao: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  sabadobro: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const filterColors: Record<string, { active: string; idle: string }> = {
  all: {
    active: "bg-accent text-bg border border-accent",
    idle: "bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/30",
  },
  evento: {
    active: "bg-pink-500/25 text-pink-200 border border-pink-400/60",
    idle: "bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/15",
  },
  competicao: {
    active: "bg-amber-500/25 text-amber-200 border border-amber-400/60",
    idle: "bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/15",
  },
  comunidade: {
    active: "bg-blue-500/25 text-blue-200 border border-blue-400/60",
    idle: "bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/15",
  },
  atualizacao: {
    active: "bg-emerald-500/25 text-emerald-200 border border-emerald-400/60",
    idle:
      "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15",
  },
};

const dayHighlightColors: Record<string, { card: string; dot: string }> = {
  evento: {
    card: "border-pink-500/40 bg-pink-500/5 hover:border-pink-500/60",
    dot: "bg-pink-400",
  },
  competicao: {
    card: "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60",
    dot: "bg-amber-400",
  },
  comunidade: {
    card: "border-blue-500/40 bg-blue-500/5 hover:border-blue-500/60",
    dot: "bg-blue-400",
  },
  atualizacao: {
    card: "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60",
    dot: "bg-emerald-400",
  },
  dominacao: {
    card: "border-orange-500/40 bg-orange-500/5 hover:border-orange-500/60",
    dot: "bg-orange-400",
  },
  sabadobro: {
    card: "border-orange-500/40 bg-orange-500/5 hover:border-orange-500/60",
    dot: "bg-orange-400",
  },
};

const typeLabels: Record<string, string> = {
  evento: "Evento",
  competicao: "Competição",
  comunidade: "Comunidade",
  atualizacao: "Atualização",
  dominacao: "Dominação",
  sabadobro: "Sabadobro",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function parseEventDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00");
}

function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function buildRecurringEventsForMonth(monthDate: Date): CalendarEvent[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const monthDays = new Date(year, month + 1, 0).getDate();
  const generated: CalendarEvent[] = [];

  for (let day = 1; day <= monthDays; day++) {
    const date = new Date(year, month, day);
    const key = dateKey(date);
    const weekDay = date.getDay();

    if (weekDay === 2) {
      generated.push({
        id: `dominacao-${key}`,
        date: key,
        title: "Dominação de Facções",
        description:
          "Disputa entre as facções rivais por um item de maior valor de cada facção. Confira o produto com as respectivas facções campeãs.",
        type: "dominacao",
      });
    }

    if (weekDay === 6) {
      generated.push({
        id: `sabadobro-${key}`,
        date: key,
        title: "Sabadobro",
        description:
          "O dobro de recompensa de farm para a facção que dominar o local determinado em conflito com a facção rival.",
        type: "sabadobro",
      });
    }

    if (weekDay === 0) {
      const sundayOccurrence = Math.floor((day - 1) / 7) + 1;
      if (sundayOccurrence !== 2 && sundayOccurrence !== 4) continue;
      generated.push({
        id: `atualizacao-semanal-${key}`,
        date: key,
        title: "Atualizações",
        description:
          "Domingo de atualizações com novidades, ajustes e melhorias para manter a experiência da cidade sempre evoluindo.",
        type: "atualizacao",
      });
    }
  }

  return generated;
}

export default function Calendario() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    fetch("/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const loadedEvents = data.calendar || [];
        setEvents(loadedEvents);
        if (loadedEvents.length > 0) {
          const firstEventDate = [...loadedEvents]
            .sort(
              (a: CalendarEvent, b: CalendarEvent) =>
                parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime()
            )[0]
            .date;
          setSelectedDate(firstEventDate);
        }
      })
      .catch(() => {});
  }, []);

  const recurringEvents = buildRecurringEventsForMonth(currentMonth);
  const combinedEvents = [...events, ...recurringEvents];
  const filteredEvents =
    filter === "all"
      ? combinedEvents
      : combinedEvents.filter((event) => event.type === filter);

  const eventsByDate = filteredEvents.reduce<Record<string, CalendarEvent[]>>(
    (acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    },
    {}
  );
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  const firstWeekday = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const leading = (firstWeekday + 6) % 7; // segunda=0
  const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;

  return (
    <>
      <section className="relative pt-40 pb-20 px-6 overflow-hidden noise-bg">
        <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-bg pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold uppercase tracking-widest mb-6"
          >
            Próximos Eventos
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-text-primary mb-6"
          >
            <span className="text-gradient">Calendário</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto"
          >
            Fique por dentro de tudo o que acontece na cidade
          </motion.p>
        </div>
      </section>

      <section className="pt-4 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Filters */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {[
                { key: "all", label: "Todos" },
                { key: "evento", label: "Eventos" },
                { key: "competicao", label: "Competições" },
                { key: "comunidade", label: "Comunidade" },
                { key: "atualizacao", label: "Atualizações" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f.key
                      ? filterColors[f.key]?.active || filterColors.all.active
                      : filterColors[f.key]?.idle || filterColors.all.idle
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Calendar Grid */}
          <AnimatedSection>
            <div className="bg-bg-card border border-border/50 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                        1
                      )
                    )
                  }
                  className="w-10 h-10 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/30 transition-colors flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-text-primary font-bold text-lg md:text-xl capitalize">
                  {monthLabel(currentMonth)}
                </h2>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                        1
                      )
                    )
                  }
                  className="w-10 h-10 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-accent/30 transition-colors flex items-center justify-center"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: totalCells }).map((_, index) => {
                  const dayNumber = index - leading + 1;
                  const isInMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                  const date = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    dayNumber
                  );
                  const key = dateKey(date);
                  const dayEvents = eventsByDate[key] || [];
                  const hasEvents = isInMonth && Boolean(dayEvents.length);
                  const hasDominas =
                    isInMonth &&
                    Boolean(dayEvents.some((event) => event.type === "dominacao"));
                  const hasSabadobro =
                    isInMonth &&
                    Boolean(dayEvents.some((event) => event.type === "sabadobro"));
                  const highlightType = dayEvents[0]?.type || "evento";
                  const highlight = dayHighlightColors[highlightType];
                  const isSelected = isInMonth && key === selectedDate;
                  const isToday = key === dateKey(new Date());

                  return (
                    <button
                      key={index}
                      onClick={() => isInMonth && setSelectedDate(key)}
                      disabled={!isInMonth}
                      className={`relative min-h-20 rounded-xl border text-sm transition-all ${
                        !isInMonth
                          ? "border-transparent bg-transparent cursor-default"
                          : isSelected
                            ? "border-accent bg-accent/15 text-accent"
                            : hasEvents
                              ? `${highlight?.card || "border-accent/40 bg-accent/5 hover:border-accent/60"} text-text-primary`
                              : "border-border/50 bg-bg hover:border-accent/30 text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {isInMonth && (
                        <>
                          <span
                            className={`absolute top-2 left-2 text-xs font-semibold ${
                              isToday ? "text-accent" : ""
                            }`}
                          >
                            {dayNumber}
                          </span>
                          {hasEvents && (
                            <span
                              className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${highlight?.dot || "bg-accent"}`}
                            />
                          )}
                          {(hasDominas || hasSabadobro) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
                              {hasDominas && (
                                <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[9px] leading-none">
                                  Dominas
                                </span>
                              )}
                              {hasSabadobro && (
                                <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[9px] leading-none">
                                  Sabadobro
                                </span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* Selected Day Events */}
          <AnimatedSection delay={0.08}>
            <div className="mt-8 bg-bg-card border border-border/50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
                <Calendar size={16} />
                <span>
                  {selectedDate
                    ? formatDate(selectedDate)
                    : "Selecione um dia no calendário"}
                </span>
              </div>
              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-bg border border-border/40 rounded-xl p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeColors[event.type] || typeColors.evento}`}
                      >
                        <Tag size={12} />
                        {typeLabels[event.type] || event.type}
                      </span>
                    </div>
                    <h3 className="text-text-primary font-bold text-lg mb-1">
                      {event.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                ))}

                {selectedDate && selectedEvents.length === 0 && (
                  <div className="text-center py-6">
                    <Clock size={32} className="text-text-muted mx-auto mb-2" />
                    <p className="text-text-secondary text-sm">
                      Nenhum evento marcado para esta data.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
