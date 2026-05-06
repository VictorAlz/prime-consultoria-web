import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, LayoutDashboard, Briefcase, ListChecks, Shield, Activity, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TasksPanel from "@/components/admin/TasksPanel";
import ProjectsHubPanel from "@/components/admin/ProjectsHubPanel";
import PortfolioHealthPanel from "@/components/admin/PortfolioHealthPanel";
import KnowledgeBasePanel from "@/components/admin/KnowledgeBasePanel";

type AppRole = "trainee" | "membro" | "diretor" | "presidencia" | "admin";

const MemberDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [projectRole, setProjectRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (!s) navigate("/login");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session) navigate("/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const [{ data: roleData }, { data: profData }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("project_role").eq("user_id", user.id).maybeSingle(),
      ]);
      const role = (roleData?.role as AppRole) || "trainee";
      setUserRole(role);
      setProjectRole(profData?.project_role || null);
    };
    load();
  }, [user, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast({ title: "Erro ao sair", description: error.message, variant: "destructive" });
    else navigate("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Início", key: "dashboard" },
    { icon: ListChecks, label: "Minhas Tarefas", key: "tarefas" },
    { icon: Activity, label: "Portfólio", key: "portfolio" },
    { icon: Briefcase, label: "Hub de Projetos", key: "hub" },
    { icon: BookOpen, label: "Wiki", key: "wiki" },
    { icon: UserIcon, label: "Perfil", key: "perfil" },
  ];

  const isAdmin = userRole === "admin";
  const canDelegate =
    isAdmin ||
    (!!projectRole && ["Coordenador de Projetos", "Delivery Manager", "Diretor de Projetos"].includes(projectRole));
  const canManageHub =
    isAdmin ||
    (!!projectRole && ["Diretor de Projetos", "Coordenador de Projetos"].includes(projectRole));

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Hub de Projetos</h1>
            {userRole && <Badge variant="outline">{userRole}</Badge>}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            {userRole && ["diretor", "presidencia", "admin"].includes(userRole) && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
                <Shield className="h-4 w-4 mr-2" />
                Painel Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-card border-r border-border hidden md:block">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 z-50">
          <div className="flex justify-around">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                  activeTab === item.key ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-6 pb-24 md:pb-6">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Olá, {user.user_metadata?.full_name || user.email}!
              </h2>
              <p className="text-muted-foreground mb-8">
                Este é seu espaço como membro da CASE EJ.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  className="bg-card rounded-xl border border-border p-6 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setActiveTab("tarefas")}
                >
                  <ListChecks className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Minhas Tarefas</h3>
                  <p className="text-sm text-muted-foreground">
                    Veja o que foi delegado para você.
                  </p>
                </div>
                <div
                  className="bg-card rounded-xl border border-border p-6 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setActiveTab("hub")}
                >
                  <Briefcase className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">Hub de Projetos</h3>
                  <p className="text-sm text-muted-foreground">
                    Time e cargos do departamento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tarefas" && <TasksPanel currentUserId={user.id} canManage={false} />}
          {activeTab === "hub" && <ProjectsHubPanel currentUserId={user.id} canManage={canManageHub} />}
          {activeTab === "portfolio" && (
            <PortfolioHealthPanel currentUserId={user.id} isAdmin={isAdmin} canDelegate={canDelegate} />
          )}
          {activeTab === "wiki" && <KnowledgeBasePanel currentUserId={user.id} canManage={canManageHub} />}

          {activeTab === "perfil" && (
            <div className="max-w-md">
              <h2 className="text-2xl font-bold mb-6">Meu Perfil</h2>
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{user.user_metadata?.full_name || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cargo no Hub de Projetos</p>
                  <p className="font-medium">{projectRole || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;
