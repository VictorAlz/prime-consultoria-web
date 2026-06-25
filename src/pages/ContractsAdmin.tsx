import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Plus, Copy, Trash2, Download, MessageCircle, FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateContractPdf } from "@/lib/contractPdf";

interface Contract {
  id: string;
  token: string;
  issue_date: string;
  client_name: string | null;
  client_document: string | null;
  client_address: string | null;
  client_signature: string | null;
  status: "pending" | "signed";
  signed_at: string | null;
  created_at: string;
}

export default function ContractsAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [linkDialog, setLinkDialog] = useState<{ open: boolean; url: string }>({
    open: false, url: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      load();
    });
  }, [navigate]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Erro ao carregar contratos", description: error.message, variant: "destructive" });
    else setContracts((data || []) as Contract[]);
    setLoading(false);
  }

  async function createNew() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("contracts")
      .insert({ created_by: user?.id })
      .select()
      .single();
    if (error || !data) {
      toast({ title: "Erro", description: error?.message, variant: "destructive" });
      return;
    }
    const url = buildContractUrl(data.token);
    setLinkDialog({ open: true, url });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir este contrato?")) return;
    const { error } = await supabase.from("contracts").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else load();
  }

  function copyLink(url: string) {
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!" });
  }

  function whatsappLink(url: string) {
    const msg = encodeURIComponent(`Olá! Segue o link do contrato para preenchimento e assinatura digital: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  }

  async function downloadPdf(c: Contract) {
    await generateContractPdf(c, `contrato-${c.client_name || c.token}.pdf`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Button variant="ghost" onClick={() => navigate("/contratos")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Painel de Contratos</h1>
          <Button onClick={createNew}>
            <Plus className="h-4 w-4 mr-2" /> Novo Contrato
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Contratos gerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum contrato ainda. Clique em "Novo Contrato" para começar.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((c) => {
                      const url = `${window.location.origin}/contrato/${c.token}`;
                      return (
                        <TableRow key={c.id}>
                          <TableCell>{new Date(c.issue_date).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>{c.client_name || <span className="text-muted-foreground">—</span>}</TableCell>
                          <TableCell>
                            {c.status === "signed" ? (
                              <Badge className="bg-green-600">Assinado</Badge>
                            ) : (
                              <Badge variant="secondary">Pendente</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end flex-wrap">
                              <Button size="sm" variant="outline" onClick={() => copyLink(url)} title="Copiar link">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => whatsappLink(url)} title="WhatsApp">
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              {c.status === "signed" && (
                                <Button size="sm" variant="outline" onClick={() => downloadPdf(c)} title="Baixar PDF">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => remove(c.id)} title="Excluir">
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
          </CardContent>
        </Card>

        <Dialog open={linkDialog.open} onOpenChange={(o) => setLinkDialog({ ...linkDialog, open: o })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contrato criado!</DialogTitle>
              <DialogDescription>
                Compartilhe este link com o cliente para que ele preencha os dados e assine.
              </DialogDescription>
            </DialogHeader>
            <div className="p-3 bg-muted rounded text-sm break-all">{linkDialog.url}</div>
            <div className="flex gap-2">
              <Button onClick={() => copyLink(linkDialog.url)} className="flex-1">
                <Copy className="h-4 w-4 mr-2" /> Copiar link
              </Button>
              <Button onClick={() => whatsappLink(linkDialog.url)} className="flex-1 bg-[#25D366] hover:bg-[#1ebe57] text-white">
                <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}