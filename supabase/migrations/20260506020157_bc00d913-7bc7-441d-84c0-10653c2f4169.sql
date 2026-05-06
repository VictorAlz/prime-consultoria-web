
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);

-- Replace director-only write policies with can_delegate
DROP POLICY IF EXISTS "Directors can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Directors can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Directors can delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "Directors can view all tasks" ON public.tasks;

CREATE POLICY "Delegators view all tasks" ON public.tasks
  FOR SELECT TO authenticated
  USING (public.can_delegate(auth.uid()));

CREATE POLICY "Delegators create tasks" ON public.tasks
  FOR INSERT TO authenticated
  WITH CHECK (public.can_delegate(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Delegators update tasks" ON public.tasks
  FOR UPDATE TO authenticated
  USING (public.can_delegate(auth.uid()));

CREATE POLICY "Delegators delete tasks" ON public.tasks
  FOR DELETE TO authenticated
  USING (public.can_delegate(auth.uid()));
