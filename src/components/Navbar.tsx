"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/como-jogar", label: "Como Jogar" },
  { href: "/calendario", label: "Calendário" },
  { href: "/atualizacoes", label: "Atualizações" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-bg/70 backdrop-blur-2xl border-b border-border/40 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 md:w-12 md:h-12 bg-accent rounded-xl flex items-center justify-center font-black text-bg text-base tracking-tighter transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/30">
                MVP
              </div>
              <div className="absolute -inset-1 bg-accent/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-text-primary font-black text-lg tracking-tight">
                SEJA MVP
              </span>
              <span className="text-accent text-[11px] font-semibold uppercase tracking-widest mt-0.5">
                Academy
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-surface/40 border border-border/30 rounded-xl px-2 py-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2.5 text-[15px] font-medium rounded-lg transition-all ${
                    isActive
                      ? "text-accent bg-accent/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="fivem://connect/sejamvp.com"
              className="hidden sm:inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent font-semibold px-5 py-2.5 rounded-xl text-[15px] hover:bg-accent/20 transition-all hover:scale-105 active:scale-95"
            >
              <Gamepad2 size={16} />
              JOGAR
            </a>
            <a
              href="https://mvpgg.centralcart.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-bg font-bold px-6 py-3 rounded-xl text-[15px] hover:bg-accent-dim transition-all hover:scale-105 active:scale-95 shadow-md shadow-accent/20"
            >
              <ShoppingBag size={16} />
              LOJA
            </a>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`text-3xl font-bold transition-colors ${
                        isActive ? "text-accent" : "text-text-primary hover:text-accent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="flex flex-col items-center gap-3 mt-4"
              >
                <a
                  href="fivem://connect/sejamvp.com"
                  className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent font-bold px-10 py-4 rounded-xl text-xl hover:bg-accent/20 transition-all"
                >
                  <Gamepad2 size={22} />
                  JOGAR
                </a>
                <a
                  href="https://mvpgg.centralcart.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-bg font-bold px-10 py-4 rounded-xl text-xl hover:bg-accent-dim transition-all"
                >
                  <ShoppingBag size={22} />
                  LOJA
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
