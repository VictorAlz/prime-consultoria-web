
-- PROJECTS
CREATE TYPE public.project_health AS ENUM ('verde', 'amarelo', 'vermelho');

CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  health public.project_health NOT NULL DEFAULT 'verde',
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view projects" ON public.projects
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Directors can insert projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.has_minimum_role(auth.uid(), 'diretor') AND created_by = auth.uid());
CREATE POLICY "Directors can update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_minimum_role(auth.uid(), 'diretor'));
CREATE POLICY "Directors can delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_minimum_role(auth.uid(), 'diretor'));

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROJECT ASSIGNMENTS (rendimento por membro)
CREATE TABLE public.project_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role_in_project TEXT,
  performance_score INTEGER NOT NULL DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members see own assignments" ON public.project_assignments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_minimum_role(auth.uid(), 'diretor'));
CREATE POLICY "Directors insert assignments" ON public.project_assignments
  FOR INSERT TO authenticated
  WITH CHECK (public.has_minimum_role(auth.uid(), 'diretor'));
CREATE POLICY "Directors update assignments" ON public.project_assignments
  FOR UPDATE TO authenticated
  USING (public.has_minimum_role(auth.uid(), 'diretor'));
CREATE POLICY "Directors delete assignments" ON public.project_assignments
  FOR DELETE TO authenticated
  USING (public.has_minimum_role(auth.uid(), 'diretor'));

CREATE TRIGGER project_assignments_updated_at
  BEFORE UPDATE ON public.project_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- WIKI ARTICLES
CREATE TABLE public.wiki_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'Geral',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.wiki_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view wiki" ON public.wiki_articles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Directors insert wiki" ON public.wiki_articles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_minimum_role(auth.uid(), 'diretor'));
CREATE POLICY "Directors update wiki" ON public.wiki_articles
  FOR UPDATE TO authenticated
  USING (public.has_minimum_role(auth.uid(), 'diretor'));
CREATE POLICY "Directors delete wiki" ON public.wiki_articles
  FOR DELETE TO authenticated
  USING (public.has_minimum_role(auth.uid(), 'diretor'));

CREATE TRIGGER wiki_articles_updated_at
  BEFORE UPDATE ON public.wiki_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: Diretrizes Organizacionais
INSERT INTO public.wiki_articles (category, title, content, is_pinned) VALUES (
  'Organização',
  'Diretrizes Organizacionais',
  E'## 3. PAPÉIS E RESPONSABILIDADES\n\n**3.1 Diretor de Projetos:** Gestão estratégica; interface com stakeholders; aprovação de escopo/orçamento; visão de monetização e defesa dos interesses da diretoria.\n\n**3.2 Coordenador de Projetos:** Orquestração da equipe; gestão de pessoas; braço executor de alinhamento.\n\n**3.3 Delivery Manager:** Visão de execução direta; definição de metodologias; acompanhamento de métricas e prazos.\n\n**3.4 UI/UX Designer:** Interfaces, fluxos e protótipos.\n\n**3.5 Analistas de Projetos:** Requisitos, cronogramas e comunicação técnica.\n\n**3.6 Desenvolvedores:** Implementação, manutenção e evolução técnica.\n\n## 4. DIFERENÇAS CHAVE\n\n- **Diretor:** Visão macro, estratégica e empreendedora. Realiza o deslocamento de membros entre cargos.\n- **Coordenador:** Foco no capital humano e fluxo de informações.\n- **Delivery Manager:** Foco na entrega técnica, prazos e metodologias de desenvolvimento.',
  true
);
