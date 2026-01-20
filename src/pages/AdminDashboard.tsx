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
  Eye,
  Clock,
  CheckCircle,
  XCircle,
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

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    if (user && activeTab === "leads") {
      fetchLeads();
    }
  }, [user, activeTab]);

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
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: Mail, label: "Leads", key: "leads" },
    { icon: Briefcase, label: "Cases", key: "cases" },
    { icon: Users, label: "Equipe", key: "equipe" },
    { icon: UserIcon, label: "Perfil", key: "perfil" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "novo":
        return <Badge className="bg-blue-500">Novo</Badge>;
      case "em_contato":
        return <Badge className="bg-yellow-500">Em Contato</Badge>;
      case "convertido":
        return <Badge className="bg-green-500">Convertido</Badge>;
      case "perdido":
        return <Badge variant="destructive">Perdido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
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
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
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
            {menuItems.map((item) => (
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
                      <p className="text-2xl font-bold text-foreground">0</p>
                      <p className="text-sm text-muted-foreground">Membros</p>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab("leads")}>
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
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <UserIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">1</p>
                      <p className="text-sm text-muted-foreground">Usuários</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab("cases")}>
                    <Briefcase className="h-5 w-5" />
                    Adicionar Case
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab("equipe")}>
                    <Users className="h-5 w-5" />
                    Adicionar Membro
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab("leads")}>
                    <Mail className="h-5 w-5" />
                    Ver Leads
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeTab === "leads" && (
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

          {activeTab === "cases" && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Em Breve</h3>
              <p className="text-muted-foreground">
                A gestão de cases será implementada em breve.
              </p>
            </div>
          )}

          {activeTab === "equipe" && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Em Breve</h3>
              <p className="text-muted-foreground">
                A gestão de equipe será implementada em breve.
              </p>
            </div>
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