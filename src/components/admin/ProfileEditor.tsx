import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface Props {
  user: User;
}

const ProfileEditor = ({ user }: Props) => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user.email || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setFullName(data?.full_name || user.user_metadata?.full_name || ""));
  }, [user.id]);

  const save = async () => {
    if (!fullName.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast({ title: "Email inválido", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error: pErr } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("user_id", user.id);
      if (pErr) throw pErr;

      const { error: uErr } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
        ...(email.trim() !== user.email ? { email: email.trim() } : {}),
      });
      if (uErr) throw uErr;

      toast({
        title: "Perfil atualizado",
        description:
          email.trim() !== user.email
            ? "Confirme o novo email pelo link enviado para sua caixa de entrada."
            : "Suas informações foram salvas.",
      });
    } catch (e: any) {
      toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Nome completo</Label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} />
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={255}
        />
        <p className="text-xs text-muted-foreground">
          Ao trocar o email, você receberá um link de confirmação.
        </p>
      </div>
      <Button onClick={save} disabled={saving}>
        {saving ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
};

export default ProfileEditor;