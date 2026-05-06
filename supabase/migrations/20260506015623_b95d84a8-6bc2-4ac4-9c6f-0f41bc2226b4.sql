
ALTER TABLE public.project_invites ADD COLUMN IF NOT EXISTS recipient_name TEXT;

-- Tighten projects: admin only for write
DROP POLICY IF EXISTS "Directors can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Directors can update projects" ON public.projects;
DROP POLICY IF EXISTS "Directors can delete projects" ON public.projects;

CREATE POLICY "Admins insert projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND created_by = auth.uid());
CREATE POLICY "Admins update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Helper: can_delegate based on app role admin OR profile.project_role
CREATE OR REPLACE FUNCTION public.can_delegate(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_role(_user_id, 'admin') OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = _user_id
        AND project_role IN ('Diretor de Projetos','Coordenador de Projetos','Delivery Manager')
    )
$$;

-- Update assignments policies to use can_delegate
DROP POLICY IF EXISTS "Directors insert assignments" ON public.project_assignments;
DROP POLICY IF EXISTS "Directors update assignments" ON public.project_assignments;
DROP POLICY IF EXISTS "Directors delete assignments" ON public.project_assignments;

CREATE POLICY "Delegators insert assignments" ON public.project_assignments
  FOR INSERT TO authenticated
  WITH CHECK (public.can_delegate(auth.uid()));
CREATE POLICY "Delegators update assignments" ON public.project_assignments
  FOR UPDATE TO authenticated
  USING (public.can_delegate(auth.uid()));
CREATE POLICY "Delegators delete assignments" ON public.project_assignments
  FOR DELETE TO authenticated
  USING (public.can_delegate(auth.uid()));
