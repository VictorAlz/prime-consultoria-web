CREATE TABLE IF NOT EXISTS public.task_assignees (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (task_id, user_id)
);

ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own task assignments"
ON public.task_assignees FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.can_delegate(auth.uid()));

CREATE POLICY "Delegators insert assignees"
ON public.task_assignees FOR INSERT
TO authenticated
WITH CHECK (public.can_delegate(auth.uid()));

CREATE POLICY "Delegators delete assignees"
ON public.task_assignees FOR DELETE
TO authenticated
USING (public.can_delegate(auth.uid()));

-- Allow extra assignees to see and update the parent task
DROP POLICY IF EXISTS "Assignees can view their tasks" ON public.tasks;
CREATE POLICY "Assignees can view their tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (
  assigned_to = auth.uid()
  OR created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM public.task_assignees ta WHERE ta.task_id = tasks.id AND ta.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Assignees can update their tasks" ON public.tasks;
CREATE POLICY "Assignees can update their tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (
  assigned_to = auth.uid()
  OR EXISTS (SELECT 1 FROM public.task_assignees ta WHERE ta.task_id = tasks.id AND ta.user_id = auth.uid())
);
