"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save,
  LogIn,
  LogOut,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";

interface ContentData {
  calendar: {
    id: string;
    date: string;
    title: string;
    description: string;
    type: string;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
  }[];
  updates: {
    id: string;
    date: string;
    title: string;
    description: string;
    tags: string[];
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
  }[];
  [key: string]: unknown;
}

type Toast = { message: string; type: "success" | "error" } | null;

function formatAuditDate(date?: string) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleString("pt-BR");
  } catch {
    return date;
  }
}

export default function AdminPage() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [content, setContent] = useState<ContentData | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    calendar: true,
    updates: true,
  });

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setIsAuth(true);
        setCurrentUser(data.user?.username || "");
      })
      .catch(() => {
        setIsAuth(false);
        setCurrentUser("");
      })
      .finally(() => setIsCheckingAuth(false));
  }, []);

  useEffect(() => {
    if (isAuth) {
      fetch("/api/content", { cache: "no-store", credentials: "same-origin" })
        .then((r) => r.json())
        .then(setContent)
        .catch(() => showToast("Erro ao carregar conteúdo", "error"));
    }
  }, [isAuth, showToast]);

  useEffect(() => {
    if (!isAuth) {
      setContent(null);
    }
  }, [isAuth, showToast]);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        showToast("Usuário ou senha inválidos", "error");
        return;
      }

      const data = await res.json();
      setIsAuth(true);
      setCurrentUser(data.user?.username || username);
      setPassword("");
      showToast("Login efetuado com sucesso!", "success");
    } catch {
      showToast("Erro de conexão", "error");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuth(false);
    setUsername("");
    setPassword("");
    setCurrentUser("");
    setContent(null);
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      // Save updates to Supabase
      if (content.updates && content.updates.length > 0) {
        const updatesRes = await fetch("/api/updates", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ updates: content.updates }),
        });

        if (!updatesRes.ok) {
          const errorData = await updatesRes.json();
          console.error('Error saving updates to Supabase:', errorData);
          showToast("Erro ao salvar atualizações no Supabase", "error");
          setSaving(false);
          return;
        }
      }

      // Save other content (calendar, etc.) to existing JSON system
      const { updates, ...contentWithoutUpdates } = content;

      const res = await fetch("/api/content", {
        method: "PUT",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contentWithoutUpdates),
      });
      
      if (res.ok) {
        showToast("Conteúdo salvo com sucesso!", "success");
      } else if (res.status === 401 || res.status === 403) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        handleLogout();
      } else {
        showToast("Erro ao salvar conteúdo", "error");
      }
    } catch {
      showToast("Erro de conexão", "error");
    }
    setSaving(false);
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pt-24">
        <Loader2 size={32} className="text-accent animate-spin" />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-bg-card border border-border/50 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Shield size={32} className="text-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-text-primary text-center mb-2">
              Painel Admin
            </h1>
            <p className="text-text-secondary text-sm text-center mb-8">
              Acesso da equipe para gerenciar calendário e atualizações
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleLogin();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuário"
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-accent text-bg font-bold py-3 rounded-xl hover:bg-accent-dim transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pt-24">
        <Loader2 size={32} className="text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-20 px-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-accent/20 text-accent border border-accent/30"
              : "bg-amber-700/25 text-amber-300 border border-amber-700/40"
          }`}
        >
          {toast.type === "success" ? (
            <Check size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.message}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-text-primary">
              Painel Admin
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Usuário atual: <span className="text-text-primary">{currentUser}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-accent text-bg font-bold px-6 py-2.5 rounded-xl hover:bg-accent-dim transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Salvar
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-surface border border-border text-text-secondary px-4 py-2.5 rounded-xl hover:text-text-primary transition-all"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Calendar Section */}
          <SectionAccordion
            title="Calendário"
            isOpen={openSections.calendar}
            onToggle={() => toggleSection("calendar")}
          >
            <div className="space-y-4">
              {content.calendar.map((event, i) => (
                <div
                  key={event.id}
                  className="bg-bg rounded-xl p-5 border border-border/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-text-muted text-xs font-medium">
                      Evento #{i + 1}
                    </span>
                    <button
                      onClick={() => {
                        const updated = structuredClone(content);
                        updated.calendar.splice(i, 1);
                        setContent(updated);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-text-muted text-xs mb-3">
                    Criado por <span className="text-text-secondary">{event.createdBy || "—"}</span> em{" "}
                    <span className="text-text-secondary">{formatAuditDate(event.createdAt)}</span>
                    {" · "}
                    Última edição por{" "}
                    <span className="text-text-secondary">{event.updatedBy || "—"}</span> em{" "}
                    <span className="text-text-secondary">{formatAuditDate(event.updatedAt)}</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={event.title}
                      onChange={(e) => {
                        const updated = structuredClone(content);
                        updated.calendar[i].title = e.target.value;
                        setContent(updated);
                      }}
                      className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent/50"
                      placeholder="Título"
                    />
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => {
                        const updated = structuredClone(content);
                        updated.calendar[i].date = e.target.value;
                        setContent(updated);
                      }}
                      className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                    <select
                      value={event.type}
                      onChange={(e) => {
                        const updated = structuredClone(content);
                        updated.calendar[i].type = e.target.value;
                        setContent(updated);
                      }}
                      className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    >
                      <option value="evento">Evento</option>
                      <option value="competicao">Competição</option>
                      <option value="comunidade">Comunidade</option>
                      <option value="atualizacao">Atualização</option>
                    </select>
                    <div />
                    <textarea
                      value={event.description}
                      onChange={(e) => {
                        const updated = structuredClone(content);
                        updated.calendar[i].description = e.target.value;
                        setContent(updated);
                      }}
                      className="md:col-span-2 bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent/50 resize-none"
                      rows={2}
                      placeholder="Descrição"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const updated = structuredClone(content);
                  updated.calendar.push({
                    id: Date.now().toString(),
                    date: new Date().toISOString().split("T")[0],
                    title: "Novo Evento",
                    description: "",
                    type: "evento",
                  });
                  setContent(updated);
                }}
                className="flex items-center gap-2 text-accent text-sm font-medium hover:underline"
              >
                <Plus size={16} />
                Adicionar evento
              </button>
            </div>
          </SectionAccordion>

          {/* Updates Section */}
          <SectionAccordion
            title="Atualizações"
            isOpen={openSections.updates}
            onToggle={() => toggleSection("updates")}
          >
            <div className="space-y-4">
              {content.updates.map((update, i) => (
                <div
                  key={update.id}
                  className="bg-bg rounded-xl p-5 border border-border/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-text-muted text-xs font-medium">
                      Atualização #{i + 1}
                    </span>
                    <button
                      onClick={() => {
                        const updated = structuredClone(content);
                        updated.updates.splice(i, 1);
                        setContent(updated);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-text-muted text-xs mb-3">
                    Criado por <span className="text-text-secondary">{update.createdBy || "—"}</span> em{" "}
                    <span className="text-text-secondary">{formatAuditDate(update.createdAt)}</span>
                    {" · "}
                    Última edição por{" "}
                    <span className="text-text-secondary">{update.updatedBy || "—"}</span> em{" "}
                    <span className="text-text-secondary">{formatAuditDate(update.updatedAt)}</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      value={update.title}
                      onChange={(e) => {
                        const updated = structuredClone(content);
                        updated.updates[i].title = e.target.value;
                        setContent(updated);
                      }}
                      className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent/50"
                      placeholder="Título"
                    />
                    <input
                      type="date"
                      value={update.date}
                      onChange={(e) => {
                        const updated = structuredClone(content);
                        updated.updates[i].date = e.target.value;
                        setContent(updated);
                      }}
                      className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                    <textarea
                      value={update.description}
                      onChange={(e) => {
                        const updated = structuredClone(content);
                        updated.updates[i].description = e.target.value;
                        setContent(updated);
                      }}
                      className="md:col-span-2 bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent/50 resize-none"
                      rows={3}
                      placeholder="Descrição"
                    />
                    <input
                      value={update.tags.join(", ")}
                      onChange={(e) => {
                        const updated = structuredClone(content);
                        updated.updates[i].tags = e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean);
                        setContent(updated);
                      }}
                      className="md:col-span-2 bg-bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent/50"
                      placeholder="Tags (separadas por vírgula)"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const updated = structuredClone(content);
                  updated.updates.push({
                    id: Date.now().toString(),
                    date: new Date().toISOString().split("T")[0],
                    title: "Nova Atualização",
                    description: "",
                    tags: [],
                  });
                  setContent(updated);
                }}
                className="flex items-center gap-2 text-accent text-sm font-medium hover:underline"
              >
                <Plus size={16} />
                Adicionar atualização
              </button>
            </div>
          </SectionAccordion>
        </div>

        {/* Bottom Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-bg-card/90 backdrop-blur-xl border-t border-border/50 p-4 z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-text-muted text-sm">
              Alterações não salvas serão perdidas
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-accent text-bg font-bold px-8 py-2.5 rounded-xl hover:bg-accent-dim transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionAccordion({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-card border border-border/50 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-bg-elevated transition-colors"
      >
        <h2 className="text-text-primary font-bold text-lg">{title}</h2>
        {isOpen ? (
          <ChevronDown size={20} className="text-text-muted" />
        ) : (
          <ChevronRight size={20} className="text-text-muted" />
        )}
      </button>
      {isOpen && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}
