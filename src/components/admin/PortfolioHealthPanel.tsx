import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Activity, Plus, Trash2, X, Users, TrendingUp } from "lucide-react";

type Health = "verde" | "amarelo" | "vermelho";

interface Project {
  id: string;
  name: string;
  description: string | null;
  health: Health;
  notes: string | null;
  created_at: string;
}

interface Assignment {
  id: string;
  project_id: string;
  user_id: string;
  role_in_project: string | null;
  performance_score: number;
  notes: string | null;
}

interface MemberLite {
  user_id: string;
  full_name: string | null;
  project_role: string | null;
}

interface Props {
  currentUserId: string;
  isAdmin: boolean;       // pode criar/editar/excluir projetos e definir saúde
  canDelegate: boolean;   // pode alocar membros e ajustar rendimento (Coord/Delivery/Admin)
}

const healthMeta: Record<Health, { label: string; dot: string; badge: string }> = {
  verde: { label: "No prazo", dot: "bg-green-500", badge: "border-green-500/40 text-green-700 dark:text-green-400" },
  amarelo: { label: "Risco", dot: "bg-yellow-500", badge: "border-yellow-500/40 text-yellow-700 dark:text-yellow-400" },
  vermelho: { label: "Crítico", dot: "bg-red-500", badge: "border-red-500/40 text-red-700 dark:text-red-400" },
};

const PortfolioHealthPanel = ({ currentUserId, isAdmin, canDelegate }: Props) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [members, setMembers] = useState<MemberLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", health: "verde" as Health, notes: "" });
  const [showAssign, setShowAssign] = useState<string | null>(null);
  const [assignForm, setAssignForm] = useState({ user_id: "", role_in_project: "", performance_score: 80 });

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, aRes, mRes] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("project_assignments").select("*"),
        supabase.from("profiles").select("user_id, full_name, project_role"),
      ]);
      if (pRes.error) throw pRes.error;
      if (aRes.error) throw aRes.error;
      if (mRes.error) throw mRes.error;
      setProjects((pRes.data as Project[]) || []);
      setAssignments((aRes.data as Assignment[]) || []);
      setMembers((mRes.data as MemberLite[]) || []);
    } catch (e: any) {
      toast({ title: "Erro ao carregar portfólio", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const createProject = async () => {
    if (!form.name.trim()) return toast({ title: "Nome obrigatório", variant: "destructive" });
    try {
      const { data, error } = await supabase.from("projects").insert({
        name: form.name.trim(),
        description: form.description.trim() || null,
        health: form.health,
        notes: form.notes.trim() || null,
        created_by: currentUserId,
      }).select().single();
      if (error) throw error;
      setProjects([data as Project, ...projects]);
      setForm({ name: "", description: "", health: "verde", notes: "" });
      setShowForm(false);
      toast({ title: "Projeto criado" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    }
  };

  const updateHealth = async (id: string, health: Health) => {
    try {
      const { error } = await supabase.from("projects").update({ health }).eq("id", id);
      if (error) throw error;
      setProjects(projects.map(p => p.id === id ? { ...p, health } : p));
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Excluir este projeto?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
      setAssignments(assignments.filter(a => a.project_id !== id));
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
  };

  const addAssignment = async (projectId: string) => {
    if (!assignForm.user_id) return toast({ title: "Selecione um membro", variant: "destructive" });
    try {
      const { data, error } = await supabase.from("project_assignments").insert({
        project_id: projectId,
        user_id: assignForm.user_id,
        role_in_project: assignForm.role_in_project.trim() || null,
        performance_score: assignForm.performance_score,
      }).select().single();
      if (error) throw error;
      setAssignments([...assignments, data as Assignment]);
      setAssignForm({ user_id: "", role_in_project: "", performance_score: 80 });
      setShowAssign(null);
      toast({ title: "Membro alocado" });
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
  };

  const updateScore = async (id: string, score: number) => {
    try {
      const { error } = await supabase.from("project_assignments").update({ performance_score: score }).eq("id", id);
      if (error) throw error;
      setAssignments(assignments.map(a => a.id === id ? { ...a, performance_score: score } : a));
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
  };

  const removeAssignment = async (id: string) => {
    try {
      const { error } = await supabase.from("project_assignments").delete().eq("id", id);
      if (error) throw error;
      setAssignments(assignments.filter(a => a.id !== id));
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
  };

  const memberName = (uid: string) => members.find(m => m.user_id === uid)?.full_name || "Sem nome";

  // Macro: avg performance per member across projects
  const memberStats = members.map(m => {
    const mine = assignments.filter(a => a.user_id === m.user_id);
    const avg = mine.length ? Math.round(mine.reduce((s, a) => s + a.performance_score, 0) / mine.length) : 0;
    return { ...m, projects: mine.length, avg };
  }).filter(s => s.projects > 0);

  const counts = {
    verde: projects.filter(p => p.health === "verde").length,
    amarelo: projects.filter(p => p.health === "amarelo").length,
    vermelho: projects.filter(p => p.health === "vermelho").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Activity className="h-6 w-6" /> Portfólio & Saúde
        </h2>
        <p className="text-muted-foreground">Acompanhe o status dos projetos e o rendimento do time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(["verde", "amarelo", "vermelho"] as Health[]).map((h) => (
          <div key={h} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${healthMeta[h].dot}`} />
              <span className="text-sm text-muted-foreground">{healthMeta[h].label}</span>
            </div>
            <p className="text-3xl font-bold mt-2">{counts[h]}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Projetos</h3>
          {isAdmin && !showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-1" /> Novo projeto
            </Button>
          )}
        </div>

        {showForm && (
          <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Saúde</Label>
              <Select value={form.health} onValueChange={(v) => setForm({ ...form, health: v as Health })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="verde">🟢 Verde</SelectItem>
                  <SelectItem value="amarelo">🟡 Amarelo</SelectItem>
                  <SelectItem value="vermelho">🔴 Vermelho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Observações</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button onClick={createProject}>Criar</Button>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhum projeto cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => {
              const team = assignments.filter(a => a.project_id === p.id);
              return (
                <div key={p.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`h-3 w-3 rounded-full ${healthMeta[p.health].dot}`} />
                        <h4 className="font-semibold">{p.name}</h4>
                        <Badge variant="outline" className={healthMeta[p.health].badge}>
                          {healthMeta[p.health].label}
                        </Badge>
                      </div>
                      {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                      {p.notes && <p className="text-xs text-muted-foreground mt-2 italic">{p.notes}</p>}
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <Select value={p.health} onValueChange={(v) => updateHealth(p.id, v as Health)}>
                          <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verde">🟢 Verde</SelectItem>
                            <SelectItem value="amarelo">🟡 Amarelo</SelectItem>
                            <SelectItem value="vermelho">🔴 Vermelho</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="icon" variant="ghost" onClick={() => deleteProject(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Users className="h-4 w-4" /> Time alocado ({team.length})
                      </span>
                      {canDelegate && showAssign !== p.id && (
                        <Button size="sm" variant="outline" onClick={() => setShowAssign(p.id)}>
                          <Plus className="h-3 w-3 mr-1" /> Alocar
                        </Button>
                      )}
                    </div>

                    {canDelegate && showAssign === p.id && (
                      <div className="grid md:grid-cols-3 gap-2 mb-3 p-3 bg-muted/30 rounded">
                        <Select value={assignForm.user_id} onValueChange={(v) => setAssignForm({ ...assignForm, user_id: v })}>
                          <SelectTrigger><SelectValue placeholder="Membro" /></SelectTrigger>
                          <SelectContent>
                            {members.filter(m => !team.some(t => t.user_id === m.user_id)).map(m => (
                              <SelectItem key={m.user_id} value={m.user_id}>{m.full_name || "Sem nome"}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Função no projeto"
                          value={assignForm.role_in_project}
                          onChange={(e) => setAssignForm({ ...assignForm, role_in_project: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number" min={0} max={100}
                            value={assignForm.performance_score}
                            onChange={(e) => setAssignForm({ ...assignForm, performance_score: parseInt(e.target.value) || 0 })}
                          />
                          <Button size="sm" onClick={() => addAssignment(p.id)}>OK</Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowAssign(null)}><X className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    )}

                    {team.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Membro</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Rendimento</TableHead>
                            {canDelegate && <TableHead className="text-right">Ações</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {team.map(a => (
                            <TableRow key={a.id}>
                              <TableCell>{memberName(a.user_id)}</TableCell>
                              <TableCell className="text-muted-foreground">{a.role_in_project || "—"}</TableCell>
                              <TableCell>
                                {canDelegate ? (
                                  <Input
                                    type="number" min={0} max={100}
                                    className="w-20 h-8"
                                    value={a.performance_score}
                                    onChange={(e) => updateScore(a.id, parseInt(e.target.value) || 0)}
                                  />
                                ) : <Badge variant="outline">{a.performance_score}%</Badge>}
                              </TableCell>
                              {canDelegate && (
                                <TableCell className="text-right">
                                  <Button size="icon" variant="ghost" onClick={() => removeAssignment(a.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {canDelegate && memberStats.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Visão Macro do Time
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Projetos</TableHead>
                <TableHead>Rendimento médio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberStats.map(s => (
                <TableRow key={s.user_id}>
                  <TableCell className="font-medium">{s.full_name || "Sem nome"}</TableCell>
                  <TableCell className="text-muted-foreground">{s.project_role || "—"}</TableCell>
                  <TableCell>{s.projects}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${s.avg}%` }} />
                      </div>
                      <span className="text-sm">{s.avg}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};

export default PortfolioHealthPanel;