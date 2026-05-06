import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Copy, Link2, MessageCircle, Plus, Trash2, Users, X, Edit, Check } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const HUB_ROLES = [
  "Diretor de Projetos",
  "Coordenador de Projetos",
  "Delivery Manager",
  "UI/UX Designer",
  "Analista de Projetos",
  "Desenvolvedor",
];

interface Invite {
  id: string;
  token: string;
  cargo: string;
  email: string | null;
  recipient_name: string | null;
  status: string;
  expires_at: string;
  created_at: string;
}

interface MemberRow {
  user_id: string;
  full_name: string | null;
  project_role: string | null;
  app_role: string;
}

interface Props {
  currentUserId: string;
  canManage: boolean;
}

const ProjectsHubPanel = ({ currentUserId, canManage }: Props) => {
  const { toast } = useToast();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCargo, setNewCargo] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCargo, setEditingCargo] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [invRes, rolesRes, profRes] = await Promise.all([
        canManage
          ? supabase.from("project_invites").select("*").order("created_at", { ascending: false })
          : Promise.resolve({ data: [], error: null }),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("profiles").select("user_id, full_name, project_role"),
      ]);
      if (invRes.error) throw invRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (profRes.error) throw profRes.error;

      setInvites((invRes.data as Invite[]) || []);

      const merged: MemberRow[] = (profRes.data || []).map((p: any) => ({
        user_id: p.user_id,
        full_name: p.full_name,
        project_role: p.project_role,
        app_role: rolesRes.data?.find((r: any) => r.user_id === p.user_id)?.role || "trainee",
      }));
      setMembers(merged);
    } catch (e: any) {
      toast({ title: "Erro ao carregar Hub", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createInvite = async () => {
    if (!newCargo.trim()) {
      toast({ title: "Cargo obrigatório", variant: "destructive" });
      return;
    }
    if (!newName.trim()) {
      toast({ title: "Nome do convidado obrigatório", variant: "destructive" });
      return;
    }
    try {
      const { data, error } = await supabase
        .from("project_invites")
        .insert({
          cargo: newCargo.trim(),
          email: newEmail.trim() || null,
          recipient_name: newName.trim(),
          created_by: currentUserId,
        })
        .select()
        .single();
      if (error) throw error;
      setInvites([data as Invite, ...invites]);
      setNewCargo("");
      setNewEmail("");
      setNewName("");
      setShowForm(false);
      toast({ title: "Convite criado!", description: "Link gerado com sucesso." });
    } catch (e: any) {
      toast({ title: "Erro ao criar convite", description: e.message, variant: "destructive" });
    }
  };

  const deleteInvite = async (id: string) => {
    if (!confirm("Excluir este convite?")) return;
    try {
      const { error } = await supabase.from("project_invites").delete().eq("id", id);
      if (error) throw error;
      setInvites(invites.filter((i) => i.id !== id));
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const inviteUrl = (token: string) => `${window.location.origin}/convite/${token}`;

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(inviteUrl(token));
    toast({ title: "Link copiado!" });
  };

  const shareWhatsapp = (inv: Invite) => {
    const greet = inv.recipient_name ? `Olá ${inv.recipient_name}! ` : "";
    const msg = `${greet}Você foi convidado para o Hub de Projetos da CASE EJ para o cargo de *${inv.cargo}*. Acesse: ${inviteUrl(inv.token)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const updateMemberCargo = async (userId: string, cargo: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ project_role: cargo || null })
        .eq("user_id", userId);
      if (error) throw error;
      setMembers(members.map((m) => (m.user_id === userId ? { ...m, project_role: cargo || null } : m)));
      setEditingId(null);
      toast({ title: "Cargo atualizado" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Users className="h-6 w-6" /> Hub de Projetos
        </h2>
        <p className="text-muted-foreground">
          Convide membros para o departamento e gerencie os cargos do time de Projetos.
        </p>
      </div>

      {canManage && (
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Link2 className="h-5 w-5" /> Convites
            </h3>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Novo convite
              </Button>
            )}
          </div>

          {showForm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-2">
                <Label>Nome do convidado *</Label>
                <Input
                  placeholder="Ex: Maria Silva"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo no Hub *</Label>
                <Select value={newCargo} onValueChange={setNewCargo}>
                  <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                  <SelectContent>
                    {HUB_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email (opcional)</Label>
                <Input
                  type="email"
                  placeholder="trainee@caseej.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="md:col-span-3 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4 mr-1" /> Cancelar
                </Button>
                <Button onClick={createInvite}>Gerar link</Button>
              </div>
            </div>
          )}

          {invites.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum convite gerado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Convidado</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Expira em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((inv) => {
                    const expired = new Date(inv.expires_at) < new Date();
                    const status = expired && inv.status === "pendente" ? "expirado" : inv.status;
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.recipient_name || "—"}</TableCell>
                        <TableCell className="font-medium">{inv.cargo}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {inv.email || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === "usado" ? "default" : status === "expirado" ? "secondary" : "outline"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {new Date(inv.expires_at).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" onClick={() => copyLink(inv.token)} title="Copiar link">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => shareWhatsapp(inv)} title="Compartilhar no WhatsApp">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteInvite(inv.id)} title="Excluir">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Membros do Hub</h3>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum membro cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo no Hub</TableHead>
                  <TableHead>Nível de acesso</TableHead>
                  {canManage && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.user_id}>
                    <TableCell className="font-medium">{m.full_name || "Sem nome"}</TableCell>
                    <TableCell>
                      {editingId === m.user_id ? (
                        <Select value={editingCargo} onValueChange={setEditingCargo}>
                          <SelectTrigger className="h-8"><SelectValue placeholder="Selecione" /></SelectTrigger>
                          <SelectContent>
                            {HUB_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      ) : (
                        m.project_role || <span className="text-muted-foreground italic">não definido</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{m.app_role}</Badge>
                    </TableCell>
                    {canManage && (
                      <TableCell className="text-right">
                        {editingId === m.user_id ? (
                          <div className="flex justify-end gap-1">
                            <Button size="icon" variant="ghost" onClick={() => updateMemberCargo(m.user_id, editingCargo)}>
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingId(m.user_id);
                              setEditingCargo(m.project_role || "");
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsHubPanel;
