import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import {
  LogOut,
  User as UserIcon,
  Briefcase,
  Users,
  Mail,
  LayoutDashboard,
  Shield,
  Crown,
  UserCog,
  GraduationCap,
  Settings,
  ExternalLink,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type AppRole = "trainee" | "membro" | "diretor" | "presidencia" | "admin";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface UserWithRole {
  user_id: string;
  role: AppRole;
  created_at: string;
  profile?: {
    full_name: string | null;
  };
  email?: string;
}

interface PSSettings {
  active: boolean;
  form_url: string;
  description: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [allUsers, setAllUsers] = useState<UserWithRole[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [psSettings, setPsSettings] = useState<PSSettings>({
    active: false,
    form_url: "",
    description: "Não há processo seletivo ativo no momento.",
  });
  const [psSaving, setPsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const roleHierarchy: AppRole[] = ["trainee", "membro", "diretor", "presidencia", "admin"];
  
  const roleLabels: Record<AppRole, string> = {
    trainee: "Trainee",
    membro: "Membro",
    diretor: "Diretor(a)",
    presidencia: "Presidência",
    admin: "Administrador",
  };

  const roleIcons: Record<AppRole, React.ReactNode> = {
    trainee: <GraduationCap className="h-4 w-4" />,
    membro: <UserIcon className="h-4 w-4" />,
    diretor: <UserCog className="h-4 w-4" />,
    presidencia: <Crown className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
  };

  const hasMinimumRole = (minRole: AppRole): boolean => {
    if (!userRole) return false;
    return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(minRole);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (!session) {
          navigate("/admin/login");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (!session) {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === "leads") {
      fetchLeads();
    }
    if (user && activeTab === "usuarios" && hasMinimumRole("admin")) {
      fetchAllUsers();
    }
    if (user && activeTab === "configuracoes" && hasMinimumRole("admin")) {
      fetchPSSettings();
    }
  }, [user, activeTab, userRole]);

  const fetchUserRole = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setUserRole(data?.role as AppRole || "trainee");
    } catch (error: any) {
      console.error("Error fetching role:", error);
      setUserRole("trainee");
    }
  };

  const fetchAllUsers = async () => {
    setUsersLoading(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          created_at
        `)
        .order("created_at", { ascending: true });

      if (rolesError) throw rolesError;

      // Fetch profiles for these users
      const userIds = rolesData?.map(r => r.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const usersWithRoles: UserWithRole[] = (rolesData || []).map(role => ({
        ...role,
        role: role.role as AppRole,
        profile: profilesData?.find(p => p.user_id === role.user_id) || undefined,
      }));

      setAllUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) throw error;

      setAllUsers(allUsers.map(u =>
        u.user_id === userId ? { ...u, role: newRole } : u
      ));

      toast({
        title: "Cargo atualizado",
        description: "O cargo do usuário foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchPSSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "processo_seletivo")
        .single();

      if (error) throw error;
      if (data?.value) {
        setPsSettings(data.value as unknown as PSSettings);
      }
    } catch (error: any) {
      console.error("Error fetching PS settings:", error);
    }
  };

  const savePSSettings = async () => {
    setPsSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: JSON.parse(JSON.stringify(psSettings)) })
        .eq("key", "processo_seletivo");

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As configurações do processo seletivo foram atualizadas.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setPsSaving(false);
    }
  };

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar leads",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLeadsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (error) throw error;

      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));

      toast({
        title: "Status atualizado",
        description: "O status do lead foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard", minRole: "trainee" as AppRole },
    { icon: Mail, label: "Leads", key: "leads", minRole: "membro" as AppRole },
    { icon: Briefcase, label: "Cases", key: "cases", minRole: "membro" as AppRole },
    { icon: Users, label: "Equipe", key: "equipe", minRole: "diretor" as AppRole },
    { icon: Shield, label: "Usuários", key: "usuarios", minRole: "admin" as AppRole },
    { icon: Settings, label: "Configurações", key: "configuracoes", minRole: "admin" as AppRole },
    { icon: UserIcon, label: "Perfil", key: "perfil", minRole: "trainee" as AppRole },
  ].filter(item => hasMinimumRole(item.minRole));

  const getServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      site: "Site Institucional",
      "landing-page": "Landing Page",
      "web-app": "Web App",
      sistema: "Sistema Personalizado",
      "automacao-ia": "Automação com IA",
      outro: "Outro",
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const newLeadsCount = leads.filter(l => l.status === "novo").length;

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "presidencia":
        return "bg-purple-500";
      case "diretor":
        return "bg-blue-500";
      case "membro":
        return "bg-green-500";
      case "trainee":
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
            {userRole && (
              <Badge className={getRoleBadgeColor(userRole)}>
                {roleIcons[userRole]}
                <span className="ml-1">{roleLabels[userRole]}</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
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
                {item.key === "leads" && newLeadsCount > 0 && (
                  <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                    {newLeadsCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 z-50">
          <div className="flex justify-around">
            {menuItems.slice(0, 5).map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                  activeTab === item.key
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          {activeTab === "dashboard" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Bem-vindo, {user.user_metadata?.full_name || user.email}!
                </h2>
                <p className="text-muted-foreground">
                  Gerencie o conteúdo do seu site a partir deste painel.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">0</p>
                      <p className="text-sm text-muted-foreground">Cases</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{allUsers.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Membros</p>
                    </div>
                  </div>
                </div>
                {hasMinimumRole("membro") && (
                  <div 
                    className="bg-card rounded-xl border border-border p-6 cursor-pointer hover:border-primary/50 transition-colors" 
                    onClick={() => setActiveTab("leads")}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-highlight/10">
                        <Mail className="h-6 w-6 text-highlight" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{leads.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Leads</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <UserIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {userRole ? roleLabels[userRole] : "-"}
                      </p>
                      <p className="text-sm text-muted-foreground">Seu Cargo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {hasMinimumRole("membro") && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab("cases")}>
                      <Briefcase className="h-5 w-5" />
                      Adicionar Case
                    </Button>
                    {hasMinimumRole("diretor") && (
                      <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab("equipe")}>
                        <Users className="h-5 w-5" />
                        Adicionar Membro
                      </Button>
                    )}
                    <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab("leads")}>
                      <Mail className="h-5 w-5" />
                      Ver Leads
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "leads" && hasMinimumRole("membro") && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Leads</h2>
                <p className="text-muted-foreground">
                  Gerencie os contatos recebidos pelo formulário do site.
                </p>
              </div>

              {leadsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : leads.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum lead ainda</h3>
                  <p className="text-muted-foreground">
                    Quando alguém preencher o formulário de contato, os leads aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">Telefone</TableHead>
                        <TableHead className="hidden lg:table-cell">Serviço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>
                            <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                              {lead.email}
                            </a>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {lead.phone ? (
                              <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                                {lead.phone}
                              </a>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {getServiceLabel(lead.service_type)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={lead.status}
                              onValueChange={(value) => updateLeadStatus(lead.id, value)}
                              disabled={!hasMinimumRole("diretor")}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="novo">Novo</SelectItem>
                                <SelectItem value="em_contato">Em Contato</SelectItem>
                                <SelectItem value="convertido">Convertido</SelectItem>
                                <SelectItem value="perdido">Perdido</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                            {formatDate(lead.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}

          {activeTab === "usuarios" && hasMinimumRole("admin") && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Gestão de Usuários</h2>
                <p className="text-muted-foreground">
                  Gerencie os acessos e cargos dos membros da CASE.
                </p>
              </div>

              {usersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : allUsers.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum usuário</h3>
                  <p className="text-muted-foreground">
                    Os usuários cadastrados aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead className="hidden md:table-cell">Membro desde</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((u) => (
                        <TableRow key={u.user_id}>
                          <TableCell className="font-medium">
                            {u.profile?.full_name || "Não informado"}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={u.role}
                              onValueChange={(value) => updateUserRole(u.user_id, value as AppRole)}
                              disabled={u.user_id === user?.id}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="trainee">
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4" />
                                    Trainee
                                  </div>
                                </SelectItem>
                                <SelectItem value="membro">
                                  <div className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4" />
                                    Membro
                                  </div>
                                </SelectItem>
                                <SelectItem value="diretor">
                                  <div className="flex items-center gap-2">
                                    <UserCog className="h-4 w-4" />
                                    Diretor(a)
                                  </div>
                                </SelectItem>
                                <SelectItem value="presidencia">
                                  <div className="flex items-center gap-2">
                                    <Crown className="h-4 w-4" />
                                    Presidência
                                  </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Administrador
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                            {formatDate(u.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Role Legend */}
              <div className="mt-8 bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Níveis de Acesso</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-gray-500">
                      <GraduationCap className="h-3 w-3" />
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">Trainee</p>
                      <p className="text-xs text-muted-foreground">Apenas visualização do dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-500">
                      <UserIcon className="h-3 w-3" />
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">Membro</p>
                      <p className="text-xs text-muted-foreground">Visualiza leads e cases</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-500">
                      <UserCog className="h-3 w-3" />
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">Diretor(a)</p>
                      <p className="text-xs text-muted-foreground">Gerencia equipe e conteúdo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-purple-500">
                      <Crown className="h-3 w-3" />
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">Presidência</p>
                      <p className="text-xs text-muted-foreground">Acesso completo exceto usuários</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-red-500">
                      <Shield className="h-3 w-3" />
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">Administrador</p>
                      <p className="text-xs text-muted-foreground">Controle total do sistema</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "cases" && hasMinimumRole("membro") && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Em Breve</h3>
              <p className="text-muted-foreground">
                A gestão de cases será implementada em breve.
              </p>
            </div>
          )}

          {activeTab === "equipe" && hasMinimumRole("diretor") && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Em Breve</h3>
              <p className="text-muted-foreground">
                A gestão de equipe será implementada em breve.
              </p>
            </div>
          )}

          {activeTab === "configuracoes" && hasMinimumRole("admin") && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Configurações do Site</h2>
                <p className="text-muted-foreground">
                  Gerencie as configurações públicas do site.
                </p>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Processo Seletivo
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ps-active" className="text-base font-medium">
                        Processo Seletivo Ativo
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Quando ativo, o botão "Ver Oportunidades" aparece na página da equipe.
                      </p>
                    </div>
                    <Switch
                      id="ps-active"
                      checked={psSettings.active}
                      onCheckedChange={(checked) =>
                        setPsSettings({ ...psSettings, active: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ps-url">Link do Formulário (Google Forms)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ps-url"
                        type="url"
                        placeholder="https://forms.google.com/..."
                        value={psSettings.form_url}
                        onChange={(e) =>
                          setPsSettings({ ...psSettings, form_url: e.target.value })
                        }
                      />
                      {psSettings.form_url && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(psSettings.form_url, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ps-description">Mensagem para visitantes</Label>
                    <Textarea
                      id="ps-description"
                      placeholder="Descreva o processo seletivo ou informe que não há vagas no momento..."
                      value={psSettings.description}
                      onChange={(e) =>
                        setPsSettings({ ...psSettings, description: e.target.value })
                      }
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Esta mensagem aparece na página da equipe, tanto quando o PS está ativo quanto fechado.
                    </p>
                  </div>

                  <Button onClick={savePSSettings} disabled={psSaving} className="w-full">
                    {psSaving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "perfil" && (
            <div className="max-w-md">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Meu Perfil</h2>
                <p className="text-muted-foreground">
                  Informações da sua conta.
                </p>
              </div>
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
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <div className="flex items-center gap-2 mt-1">
                    {userRole && (
                      <Badge className={getRoleBadgeColor(userRole)}>
                        {roleIcons[userRole]}
                        <span className="ml-1">{roleLabels[userRole]}</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Membro desde</p>
                  <p className="font-medium">{formatDate(user.created_at)}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;