import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, Pin, Edit, Trash2, X, Search } from "lucide-react";

interface Article {
  id: string;
  category: string;
  title: string;
  content: string;
  is_pinned: boolean;
  updated_at: string;
}

interface Props {
  currentUserId: string;
  canManage: boolean;
}

const KnowledgeBasePanel = ({ canManage, currentUserId }: Props) => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Geral", content: "", is_pinned: false });
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("wiki_articles").select("*")
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setArticles((data as Article[]) || []);
    } catch (e: any) {
      toast({ title: "Erro ao carregar wiki", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const categories = useMemo(() => {
    const set = new Set(articles.map(a => a.category));
    return ["Todas", ...Array.from(set)];
  }, [articles]);

  const filtered = articles.filter(a =>
    (activeCategory === "Todas" || a.category === activeCategory) &&
    (search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
  );

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      return toast({ title: "Título e conteúdo obrigatórios", variant: "destructive" });
    }
    try {
      if (editing) {
        const { error } = await supabase.from("wiki_articles").update({
          title: form.title, category: form.category, content: form.content, is_pinned: form.is_pinned,
        }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("wiki_articles").insert({
          title: form.title, category: form.category, content: form.content, is_pinned: form.is_pinned,
          created_by: currentUserId,
        });
        if (error) throw error;
      }
      setEditing(null); setCreating(false);
      setForm({ title: "", category: "Geral", content: "", is_pinned: false });
      load();
      toast({ title: "Artigo salvo" });
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este artigo?")) return;
    try {
      const { error } = await supabase.from("wiki_articles").delete().eq("id", id);
      if (error) throw error;
      setArticles(articles.filter(a => a.id !== id));
    } catch (e: any) { toast({ title: "Erro", description: e.message, variant: "destructive" }); }
  };

  const startEdit = (a: Article) => {
    setEditing(a);
    setForm({ title: a.title, category: a.category, content: a.content, is_pinned: a.is_pinned });
    setCreating(true);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-6 w-6" /> Base de Conhecimento
          </h2>
          <p className="text-muted-foreground">Documentação, processos e diretrizes do departamento.</p>
        </div>
        {canManage && !creating && (
          <Button onClick={() => { setCreating(true); setEditing(null); setForm({ title: "", category: "Geral", content: "", is_pinned: false }); }}>
            <Plus className="h-4 w-4 mr-1" /> Novo artigo
          </Button>
        )}
      </div>

      {creating && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-semibold">{editing ? "Editar artigo" : "Novo artigo"}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Conteúdo (Markdown simples) *</Label>
            <Textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} />
            Fixar no topo
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>
              <X className="h-4 w-4 mr-1" /> Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar artigos..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(c => (
            <Button
              key={c}
              size="sm"
              variant={activeCategory === c ? "default" : "outline"}
              onClick={() => setActiveCategory(c)}
            >{c}</Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum artigo encontrado.</p>
        ) : filtered.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <button
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
              onClick={() => setOpenId(openId === a.id ? null : a.id)}
            >
              <div className="flex items-center gap-3 flex-1">
                {a.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Atualizado em {new Date(a.updated_at).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
              <Badge variant="outline">{a.category}</Badge>
            </button>
            {openId === a.id && (
              <div className="px-6 py-4 border-t border-border">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground" dangerouslySetInnerHTML={{
                  __html: a.content
                    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                    .replace(/^## (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
                }} />
                {canManage && (
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                    <Button size="sm" variant="outline" onClick={() => startEdit(a)}>
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(a.id)}>
                      <Trash2 className="h-4 w-4 mr-1 text-destructive" /> Excluir
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default KnowledgeBasePanel;