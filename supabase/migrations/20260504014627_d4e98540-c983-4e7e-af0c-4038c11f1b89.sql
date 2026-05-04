-- Enum for task status
CREATE TYPE public.task_status AS ENUM ('a_fazer', 'em_andamento', 'concluida');
CREATE TYPE public.task_priority AS ENUM ('baixa', 'media', 'alta');

CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status NOT NULL DEFAULT 'a_fazer',
  priority public.task_priority NOT NULL DEFAULT 'media',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID,
  created_by UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- View: assignee can see their own; diretor+ can see all
CREATE POLICY "Assignees can view their tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Directors can view all tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (public.has_minimum_role(auth.uid(), 'diretor'::app_role));

-- Insert: diretor+ can create
CREATE POLICY "Directors can create tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (public.has_minimum_role(auth.uid(), 'diretor'::app_role) AND created_by = auth.uid());

-- Update: diretor+ full update; assignee can update status
CREATE POLICY "Directors can update tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (public.has_minimum_role(auth.uid(), 'diretor'::app_role));

CREATE POLICY "Assignees can update their tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (assigned_to = auth.uid());

-- Delete: diretor+
CREATE POLICY "Directors can delete tasks"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (public.has_minimum_role(auth.uid(), 'diretor'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);