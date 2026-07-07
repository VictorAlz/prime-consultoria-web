import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import attendantAvatar from "@/assets/attendant-avatar.jpg";

type Step = {
  key: "name" | "email" | "phone" | "company" | "position" | "notes";
  question: string;
  placeholder: string;
  optional?: boolean;
  validate?: (v: string) => string | null;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const steps: Step[] = [
  {
    key: "name",
    question: "Ótimo! Para começar, qual é o seu nome?",
    placeholder: "Seu nome completo",
    validate: (v) => (v.trim().length < 2 ? "Digite seu nome completo" : null),
  },
  {
    key: "email",
    question: "Perfeito {name} 👋 Qual o melhor e-mail para contato?",
    placeholder: "voce@empresa.com",
    validate: (v) => (!emailRe.test(v.trim()) ? "E-mail inválido" : null),
  },
  {
    key: "phone",
    question: "E um telefone/WhatsApp para retorno? (com DDD)",
    placeholder: "(22) 99999-9999",
    validate: (v) => (v.replace(/\D/g, "").length < 10 ? "Telefone inválido" : null),
  },
  {
    key: "company",
    question: "Qual o nome da sua empresa?",
    placeholder: "Nome da empresa",
    optional: true,
  },
  {
    key: "position",
    question: "E qual o seu cargo por lá?",
    placeholder: "Ex.: Diretor, Sócio, Gerente",
    optional: true,
  },
  {
    key: "notes",
    question: "Por fim, me conta rapidinho sobre o seu projeto ou desafio.",
    placeholder: "Descreva sua necessidade...",
    optional: true,
  },
];

type Msg = { role: "bot" | "user"; text: string };

const schema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(255),
  phone: z.string().min(8).max(40),
  company: z.string().max(200).optional(),
  position: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
});

const ChatFunnelBot = () => {
  const { pathname } = useLocation();
  const hiddenRoutes = [
    "/membro",
    "/admin/dashboard",
    "/admin/login",
    "/login",
    "/convite",
    "/contratos",
    "/contrato",
  ];
  const hidden = hiddenRoutes.some((r) => pathname.startsWith(r));

  const [open, setOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Olá! Sou o assistente da CaseEJ 🤖 Vou te fazer algumas perguntas rápidas para conectar você a um especialista.",
    },
    { role: "bot", text: steps[0].question },
  ]);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  useEffect(() => {
    if (open && !done) inputRef.current?.focus();
  }, [open, stepIdx, done]);

  if (hidden) return null;

  const currentStep = steps[stepIdx];

  function interpolate(text: string) {
    return text.replace(/\{(\w+)\}/g, (_, k) => answers[k] ?? "");
  }

  async function submitAll(finalAnswers: Record<string, string>) {
    setSending(true);
    try {
      const parsed = schema.safeParse(finalAnswers);
      if (!parsed.success) {
        setMessages((m) => [
          ...m,
          { role: "bot", text: "Alguma informação ficou inválida. Vamos tentar de novo?" },
        ]);
        setSending(false);
        return;
      }

      // Save lead locally
      await supabase.from("leads").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        service_type: "chatbot-funil",
        message: [
          parsed.data.company && `Empresa: ${parsed.data.company}`,
          parsed.data.position && `Cargo: ${parsed.data.position}`,
          parsed.data.notes && `\n${parsed.data.notes}`,
        ]
          .filter(Boolean)
          .join("\n") || null,
      });

      // Forward to external CRM via signed webhook
      const { error: fnError } = await supabase.functions.invoke("crm-lead", {
        body: {
          contact: {
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            company: parsed.data.company,
            position: parsed.data.position,
            source: "caseej-site-chatbot",
            notes: parsed.data.notes || "Lead vindo do chatbot funil do site",
          },
        },
      });

      if (fnError) {
        console.error("crm-lead invoke error", fnError);
      }

      setDone(true);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `Prontinho, ${parsed.data.name.split(" ")[0]}! ✅ Suas informações foram enviadas ao nosso time. Um especialista vai te chamar em breve.`,
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Ops, tive um problema ao enviar. Tente novamente em instantes." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (done || sending) return;
    const value = input.trim();
    if (!value) {
      if (currentStep.optional) {
        advance("—", "");
      } else {
        setError("Este campo é obrigatório");
      }
      return;
    }
    if (currentStep.validate) {
      const err = currentStep.validate(value);
      if (err) {
        setError(err);
        return;
      }
    }
    advance(value, value);
  }

  function advance(displayValue: string, storedValue: string) {
    setError(null);
    const nextAnswers = { ...answers, [currentStep.key]: storedValue };
    setAnswers(nextAnswers);
    setMessages((m) => [...m, { role: "user", text: displayValue }]);
    setInput("");

    const nextIdx = stepIdx + 1;
    if (nextIdx < steps.length) {
      const next = steps[nextIdx];
      setStepIdx(nextIdx);
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { role: "bot", text: interpolateWith(next.question, nextAnswers) },
        ]);
      }, 350);
    } else {
      submitAll(nextAnswers);
    }
  }

  function interpolateWith(text: string, ans: Record<string, string>) {
    return text.replace(/\{(\w+)\}/g, (_, k) => (ans[k] || "").split(" ")[0]);
  }

  function reset() {
    setStepIdx(0);
    setAnswers({});
    setInput("");
    setError(null);
    setDone(false);
    setMessages([
      {
        role: "bot",
        text: "Vamos começar de novo! Qual é o seu nome?",
      },
    ]);
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir chat com especialista"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-highlight text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold hidden sm:inline">Falar com especialista</span>
          <span className="text-sm font-semibold sm:hidden">Chat</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[380px] sm:h-[560px] h-[85vh] flex flex-col bg-background border border-border sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Assistente CaseEJ</p>
                <p className="text-[11px] opacity-80 leading-tight">Online agora</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
              className="p-1.5 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/30">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-background border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-background border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Enviando ao nosso time...
                </div>
              </div>
            )}
          </div>

          {!done ? (
            <form
              onSubmit={handleSend}
              className="border-t border-border bg-background px-3 py-3 space-y-1.5"
            >
              {error && <p className="text-xs text-destructive px-1">{error}</p>}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={currentStep.placeholder}
                  disabled={sending}
                  className="flex-1 h-10 px-3.5 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={sending}
                  aria-label="Enviar"
                  className="w-10 h-10 rounded-full bg-highlight text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              {currentStep.optional && (
                <button
                  type="button"
                  onClick={() => advance("Pular", "")}
                  className="text-[11px] text-muted-foreground hover:text-foreground px-1"
                >
                  Pular esta pergunta
                </button>
              )}
            </form>
          ) : (
            <div className="border-t border-border bg-background px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Enviado com sucesso
              </div>
              <button
                onClick={reset}
                className="text-xs font-medium text-primary hover:underline"
              >
                Nova conversa
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatFunnelBot;