import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, X, ListChecks, Calendar, User as UserIcon, Flag, FolderKanban, ChevronDown, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type TaskStatus = "a_fazer" | "em_andamento" | "concluida";
type TaskPriority = "baixa" | "media" | "alta";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
  completed_at: string | null;
  created_at: string;
  project_id: string | null;
}

interface Member {
  user_id: string;
  full_name: string | null;
}

interface ProjectLite {
  id: string;
  name: string;
}

interface TasksPanelProps {
  currentUserId: string;
  canManage: boolean;
}

const priorityColors: Record<TaskPriority, string> = {
  baixa: "bg-gray-500",
  media: "bg-blue-500",
  alta: "bg-red-500",
};

const priorityLabels: Record<TaskPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const statusLabels: Record<TaskStatus, string> = {
  a_fazer: "A Fazer",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

const statusColors: Record<TaskStatus, string> = {
  a_fazer: "bg-muted-foreground",
  em_andamento: "bg-accent",
  concluida: "bg-green-500",
};

const TasksPanel = ({ currentUserId, canManage }: TasksPanelProps) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "media" as TaskPriority,
    due_date: "",
    assigned_to: "",
    project_id: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchMembers();
    fetchProjects();
  }, [canManage]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro ao carregar tarefas", description: error.message, variant: "destructive" });
    } else {
      setTasks((data || []) as Task[]);
    }
    setLoading(false);
  };

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .order("full_name");
    setMembers(data || []);
  };

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id, name")
      .order("name");
    setProjects(data || []);
  };

  const memberName = (id: string | null) => {
    if (!id) return "Não atribuído";
    const m = members.find((x) => x.user_id === id);
    return m?.full_name || "Membro";
  };

  const createTask = async () => {
    if (!newTask.title.trim()) {
      toast({ title: "Título obrigatório", variant: "destructive" });
      return;
    }
    const payload = {
      title: newTask.title,
      description: newTask.description || null,
      priority: newTask.priority,
      due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null,
      assigned_to: newTask.assigned_to || null,
      project_id: newTask.project_id || null,
      created_by: currentUserId,
    };
    const { data, error } = await supabase.from("tasks").insert(payload).select().single();
    if (error) {
      toast({ title: "Erro ao criar tarefa", description: error.message, variant: "destructive" });
      return;
    }
    setTasks([data as Task, ...tasks]);
    setNewTask({ title: "", description: "", priority: "media", due_date: "", assigned_to: "", project_id: "" });
    setShowForm(false);
    toast({ title: "Tarefa criada" });
  };

  const updateStatus = async (task: Task, status: TaskStatus) => {
    const completed_at = status === "concluida" ? new Date().toISOString() : null;
    const { error } = await supabase
      .from("tasks")
      .update({ status, completed_at })
      .eq("id", task.id);
    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
      return;
    }
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status, completed_at } : t)));
  };

  const updateAssignee = async (task: Task, assigned_to: string | null) => {
    const { error } = await supabase
      .from("tasks")
      .update({ assigned_to })
      .eq("id", task.id);
    if (error) {
      toast({ title: "Erro ao atualizar responsável", description: error.message, variant: "destructive" });
      return;
    }
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, assigned_to } : t)));
    if (openTask?.id === task.id) setOpenTask({ ...task, assigned_to });
    toast({ title: "Responsável atualizado" });
  };

  const toggleComplete = (task: Task) => {
    updateStatus(task, task.status === "concluida" ? "a_fazer" : "concluida");
  };

  const deleteTask = async (id: string) => {
    if (!confirm("Excluir esta tarefa?")) return;
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
      return;
    }
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Group tasks by project_id
  const groups = (() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const key = t.project_id || "__sem_projeto__";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries()).map(([key, list]) => ({
      key,
      name: key === "__sem_projeto__" ? "Sem projeto" : (projects.find(p => p.id === key)?.name || "Projeto removido"),
      tasks: list,
    })).sort((a, b) => (a.key === "__sem_projeto__" ? 1 : b.key === "__sem_projeto__" ? -1 : a.name.localeCompare(b.name)));
  })();

  // Also add empty groups for projects with no tasks (so admin can see them)
  const projectsWithTasks = new Set(groups.map(g => g.key));
  for (const p of projects) {
    if (!projectsWithTasks.has(p.id)) {
      groups.push({ key: p.id, name: p.name, tasks: [] });
    }
  }

  const toggle = (key: string) => setCollapsed({ ...collapsed, [key]: !collapsed[key] });

  const formatDue = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
            <ListChecks className="h-6 w-6" />
            Hub de Tarefas
          </h2>
          <p className="text-muted-foreground">
            {canManage
              ? "Delegue tarefas, acompanhe quem está com o quê, organizado por projeto."
              : "Tarefas onde você está envolvido, agrupadas por projeto."}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nova Tarefa
          </Button>
        )}
      </div>

      {showForm && canManage && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Nova Tarefa</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Título *</Label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Ex: Desenvolver landing page do cliente X"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descrição</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Detalhes da tarefa..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Projeto</Label>
              <Select
                value={newTask.project_id || "none"}
                onValueChange={(v) => setNewTask({ ...newTask, project_id: v === "none" ? "" : v })}
              >
                <SelectTrigger><SelectValue placeholder="Sem projeto" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem projeto</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select
                value={newTask.assigned_to || "none"}
                onValueChange={(v) => setNewTask({ ...newTask, assigned_to: v === "none" ? "" : v })}
              >
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não atribuir</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.user_id} value={m.user_id}>
                      {m.full_name || "Sem nome"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={newTask.priority}
                onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data de Entrega</Label>
              <Input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={createTask}>Criar Tarefa</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : tasks.length === 0 && projects.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa</h3>
          <p className="text-muted-foreground">
            {canManage ? "Crie projetos no Portfólio e adicione tarefas a eles." : "Você não tem tarefas atribuídas."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => {
            const isCollapsed = collapsed[g.key];
            const counts = {
              a_fazer: g.tasks.filter(t => t.status === "a_fazer").length,
              em_andamento: g.tasks.filter(t => t.status === "em_andamento").length,
              concluida: g.tasks.filter(t => t.status === "concluida").length,
            };
            return (
              <div key={g.key} className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggle(g.key)}
                  className="w-full flex items-center justify-between px-5 py-3 bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <FolderKanban className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{g.name}</span>
                    <span className="text-xs text-muted-foreground">({g.tasks.length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">A fazer: {counts.a_fazer}</Badge>
                    <Badge variant="outline">Em andamento: {counts.em_andamento}</Badge>
                    <Badge variant="outline">Concluídas: {counts.concluida}</Badge>
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="p-4">
                    {g.tasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">Nenhuma tarefa neste projeto.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(["a_fazer", "em_andamento", "concluida"] as TaskStatus[]).map((col) => (
                          <div key={col} className="bg-muted/20 rounded-lg p-3 min-h-[120px]">
                            <div className="flex items-center gap-2 mb-3 px-1">
                              <span className={`h-2 w-2 rounded-full ${statusColors[col]}`} />
                              <h5 className="text-sm font-semibold">{statusLabels[col]}</h5>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {g.tasks.filter(t => t.status === col).length}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {g.tasks.filter(t => t.status === col).map((task) => {
                                const overdue = task.due_date && task.status !== "concluida" && new Date(task.due_date) < new Date();
                                return (
                                  <div
                                    key={task.id}
                                    className="bg-card border border-border rounded-md p-3 hover:border-primary/40 transition-colors group cursor-pointer"
                                    onClick={() => setOpenTask(task)}
                                  >
                                    <div className="flex items-start gap-2" onClick={(e) => e.stopPropagation()}>
                                      <Checkbox
                                        checked={task.status === "concluida"}
                                        onCheckedChange={() => toggleComplete(task)}
                                        className="mt-0.5"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${task.status === "concluida" ? "line-through text-muted-foreground" : ""}`}>
                                          {task.title}
                                        </p>
                                        {task.description && (
                                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                          <Badge className={`${priorityColors[task.priority]} text-[10px] py-0 h-4`}>
                                            <Flag className="h-2.5 w-2.5 mr-0.5" />
                                            {priorityLabels[task.priority]}
                                          </Badge>
                                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                            <UserIcon className="h-3 w-3" /> {memberName(task.assigned_to)}
                                          </span>
                                          {task.due_date && (
                                            <span className={`inline-flex items-center gap-1 text-[11px] ${overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                                              <Calendar className="h-3 w-3" /> {formatDue(task.due_date)}
                                            </span>
                                          )}
                                        </div>
                                        {(canManage || task.assigned_to === currentUserId) && (
                                          <div className="flex items-center gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                                            <Select value={task.status} onValueChange={(v) => updateStatus(task, v as TaskStatus)}>
                                              <SelectTrigger className="h-7 text-xs flex-1"><SelectValue /></SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="a_fazer">A Fazer</SelectItem>
                                                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                                                <SelectItem value="concluida">Concluída</SelectItem>
                                              </SelectContent>
                                            </Select>
                                            {canManage && (
                                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => deleteTask(task.id)}>
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                              </Button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!openTask} onOpenChange={(o) => !o && setOpenTask(null)}>
        <DialogContent className="max-w-lg">
          {openTask && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">{openTask.title}</DialogTitle>
                <DialogDescription>
                  Projeto: {projects.find(p => p.id === openTask.project_id)?.name || "Sem projeto"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`${priorityColors[openTask.priority]} text-white`}>
                    <Flag className="h-3 w-3 mr-1" /> {priorityLabels[openTask.priority]}
                  </Badge>
                  <Badge variant="outline">
                    <span className={`h-2 w-2 rounded-full mr-1.5 ${statusColors[openTask.status]}`} />
                    {statusLabels[openTask.status]}
                  </Badge>
                  {openTask.due_date && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" /> {formatDue(openTask.due_date)}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground">Descrição</Label>
                  <p className="text-sm whitespace-pre-wrap mt-1">
                    {openTask.description || <span className="text-muted-foreground italic">Sem descrição.</span>}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">Responsável</Label>
                    <p className="font-medium mt-1 flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" /> {memberName(openTask.assigned_to)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Delegado por</Label>
                    <p className="font-medium mt-1 flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" /> {memberName(openTask.created_by)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Criada em</Label>
                    <p className="mt-1">{new Date(openTask.created_at).toLocaleString("pt-BR")}</p>
                  </div>
                  {openTask.completed_at && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Concluída em</Label>
                      <p className="mt-1">{new Date(openTask.completed_at).toLocaleString("pt-BR")}</p>
                    </div>
                  )}
                </div>

                {(canManage || openTask.assigned_to === currentUserId) && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Label>Atualizar status</Label>
                    <Select
                      value={openTask.status}
                      onValueChange={(v) => {
                        updateStatus(openTask, v as TaskStatus);
                        setOpenTask({ ...openTask, status: v as TaskStatus });
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a_fazer">A Fazer</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TasksPanel;