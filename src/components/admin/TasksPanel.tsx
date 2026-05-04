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
import { Plus, Trash2, X, ListChecks, Calendar, User as UserIcon, Flag } from "lucide-react";

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
}

interface Member {
  user_id: string;
  full_name: string | null;
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

const TasksPanel = ({ currentUserId, canManage }: TasksPanelProps) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"todas" | TaskStatus>("todas");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "media" as TaskPriority,
    due_date: "",
    assigned_to: "",
  });

  useEffect(() => {
    fetchTasks();
    if (canManage) fetchMembers();
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
      created_by: currentUserId,
    };
    const { data, error } = await supabase.from("tasks").insert(payload).select().single();
    if (error) {
      toast({ title: "Erro ao criar tarefa", description: error.message, variant: "destructive" });
      return;
    }
    setTasks([data as Task, ...tasks]);
    setNewTask({ title: "", description: "", priority: "media", due_date: "", assigned_to: "" });
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

  const filtered = tasks.filter((t) => filter === "todas" || t.status === filter);

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
            Tarefas — Departamento de Projetos
          </h2>
          <p className="text-muted-foreground">
            {canManage
              ? "Delegue tarefas para os membros e acompanhe o progresso."
              : "Suas tarefas atribuídas. Marque como concluída ao finalizar."}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nova Tarefa
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["todas", "a_fazer", "em_andamento", "concluida"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "todas" ? "Todas" : statusLabels[f]}
            <span className="ml-2 text-xs opacity-70">
              ({f === "todas" ? tasks.length : tasks.filter((t) => t.status === f).length})
            </span>
          </Button>
        ))}
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
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <ListChecks className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa</h3>
          <p className="text-muted-foreground">
            {canManage ? "Crie a primeira tarefa para começar." : "Você não tem tarefas atribuídas."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => {
            const overdue =
              task.due_date && task.status !== "concluida" && new Date(task.due_date) < new Date();
            return (
              <div
                key={task.id}
                className={`bg-card rounded-xl border p-4 transition-colors ${
                  task.status === "concluida"
                    ? "border-border opacity-70"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.status === "concluida"}
                    onCheckedChange={() => toggleComplete(task)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h4
                        className={`font-semibold ${
                          task.status === "concluida" ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColors[task.priority]}>
                          <Flag className="h-3 w-3 mr-1" />
                          {priorityLabels[task.priority]}
                        </Badge>
                        {canManage && (
                          <Select
                            value={task.status}
                            onValueChange={(v) => updateStatus(task, v as TaskStatus)}
                          >
                            <SelectTrigger className="w-36 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a_fazer">A Fazer</SelectItem>
                              <SelectItem value="em_andamento">Em Andamento</SelectItem>
                              <SelectItem value="concluida">Concluída</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {canManage && (
                          <Button size="icon" variant="ghost" onClick={() => deleteTask(task.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {memberName(task.assigned_to)}
                      </span>
                      {task.due_date && (
                        <span
                          className={`flex items-center gap-1 ${
                            overdue ? "text-destructive font-medium" : ""
                          }`}
                        >
                          <Calendar className="h-3 w-3" />
                          {formatDue(task.due_date)}
                          {overdue && " (atrasada)"}
                        </span>
                      )}
                      {!canManage && task.status !== "concluida" && (
                        <Select
                          value={task.status}
                          onValueChange={(v) => updateStatus(task, v as TaskStatus)}
                        >
                          <SelectTrigger className="w-36 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a_fazer">A Fazer</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluida">Concluída</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TasksPanel;