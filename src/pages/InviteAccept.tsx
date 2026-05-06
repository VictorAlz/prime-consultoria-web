import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";

const ALLOWED_DOMAIN = "@caseej.com";

const InviteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const { data, error } = await supabase
        .from("project_invites")
        .select("*")
        .eq("token", token)
        .maybeSingle();
      if (error || !data) {
        setError("Convite não encontrado.");
      } else if (data.status === "usado") {
        setError("Este convite já foi utilizado.");
      } else if (new Date(data.expires_at) < new Date()) {
        setError("Este convite expirou.");
      } else {
        setInvite(data);
        if (data.email) setEmail(data.email);
      }
      setLoading(false);
    };
    load();
  }, [token]);

  const finalizeAccept = async (uid: string) => {
    const { error: upErr } = await supabase
      .from("project_invites")
      .update({ status: "usado", used_by: uid, used_at: new Date().toISOString() })
      .eq("token", token!);
    if (upErr) throw upErr;
    await supabase.from("profiles").update({ project_role: invite.cargo }).eq("user_id", uid);
    toast({ title: "Bem-vindo ao Hub!", description: `Acesso liberado como ${invite.cargo}.` });
    navigate("/membro");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith(ALLOWED_DOMAIN)) {
      toast({ title: "Email inválido", description: `Use seu email ${ALLOWED_DOMAIN}`, variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Senha curta", description: "Mínimo de 6 caracteres.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let uid: string | null = user?.id || null;
      if (mode === "signup") {
        const { data, error: sErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/convite/${token}`,
            data: { full_name: invite.recipient_name || email.split("@")[0] },
          },
        });
        if (sErr) throw sErr;
        uid = data.user?.id || null;
        if (!data.session) {
          // signin in case auto-confirm is on but session not returned
          const { data: signIn } = await supabase.auth.signInWithPassword({ email, password });
          uid = signIn.user?.id || uid;
        }
      } else {
        const { data, error: lErr } = await supabase.auth.signInWithPassword({ email, password });
        if (lErr) throw lErr;
        uid = data.user.id;
      }
      if (!uid) throw new Error("Não foi possível obter o usuário.");
      await finalizeAccept(uid);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center">
        {error ? (
          <>
            <XCircle className="h-14 w-14 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Convite inválido</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild><Link to="/">Voltar para o site</Link></Button>
          </>
        ) : (
          <>
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-1">
              {invite.recipient_name ? `Olá, ${invite.recipient_name}!` : "Convite para o Hub"}
            </h1>
            <p className="text-muted-foreground mb-4">
              Você foi convidado para o Hub de Projetos da CASE EJ como:
            </p>
            <div className="bg-muted/50 rounded-lg py-3 px-6 mb-6">
              <p className="text-lg font-semibold text-primary">{invite.cargo}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-2">
                <Label>Email corporativo</Label>
                <Input
                  type="email"
                  placeholder={`seu.nome${ALLOWED_DOMAIN}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full" size="lg">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {submitting ? "Processando..." : mode === "signup" ? "Criar conta e aceitar" : "Entrar e aceitar"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-sm text-primary hover:underline mt-4"
            >
              {mode === "signup" ? "Já tem conta? Faça login" : "Primeira vez? Criar conta"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteAccept;
