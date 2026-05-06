import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, CheckCircle2, XCircle } from "lucide-react";

const InviteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [user, setUser] = useState<any>(null);

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
      }
      setLoading(false);
    };
    load();
  }, [token]);

  const accept = async () => {
    if (!user) {
      navigate(`/login?redirect=/convite/${token}`);
      return;
    }
    setAccepting(true);
    try {
      const { error: upErr } = await supabase
        .from("project_invites")
        .update({ status: "usado", used_by: user.id, used_at: new Date().toISOString() })
        .eq("token", token!);
      if (upErr) throw upErr;

      await supabase
        .from("profiles")
        .update({ project_role: invite.cargo })
        .eq("user_id", user.id);

      toast({ title: "Convite aceito!", description: `Bem-vindo ao Hub como ${invite.cargo}.` });
      navigate("/admin/dashboard");
    } catch (e: any) {
      toast({ title: "Erro ao aceitar", description: e.message, variant: "destructive" });
    } finally {
      setAccepting(false);
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
            <h1 className="text-2xl font-bold mb-2">Convite para o Hub de Projetos</h1>
            <p className="text-muted-foreground mb-6">
              Você foi convidado para integrar o Hub de Projetos da CASE EJ como:
            </p>
            <div className="bg-muted/50 rounded-lg py-4 px-6 mb-6">
              <p className="text-xl font-semibold text-primary">{invite.cargo}</p>
            </div>
            {!user && (
              <p className="text-sm text-muted-foreground mb-4">
                Faça login com seu email <span className="font-medium">@caseej.com</span> para aceitar.
              </p>
            )}
            <Button onClick={accept} disabled={accepting} className="w-full" size="lg">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              {accepting ? "Aceitando..." : user ? "Aceitar convite" : "Entrar e aceitar"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteAccept;
