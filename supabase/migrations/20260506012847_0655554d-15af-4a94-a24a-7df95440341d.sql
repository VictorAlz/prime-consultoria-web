-- Add project_role to profiles (cargo no departamento de projetos)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS project_role TEXT;

-- Allow directors/admins to view all profiles and update project_role
CREATE POLICY "Directors can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_minimum_role(auth.uid(), 'diretor'::app_role));

CREATE POLICY "Directors can update all profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.has_minimum_role(auth.uid(), 'diretor'::app_role));

-- Project invites table
CREATE TABLE public.project_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  cargo TEXT NOT NULL,
  assign_role app_role NOT NULL DEFAULT 'trainee',
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_by UUID NOT NULL,
  used_by UUID,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Directors can view invites"
ON public.project_invites FOR SELECT
TO authenticated
USING (public.has_minimum_role(auth.uid(), 'diretor'::app_role));

CREATE POLICY "Anyone can view invite by token"
ON public.project_invites FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Directors can create invites"
ON public.project_invites FOR INSERT
TO authenticated
WITH CHECK (public.has_minimum_role(auth.uid(), 'diretor'::app_role) AND created_by = auth.uid());

CREATE POLICY "Directors can delete invites"
ON public.project_invites FOR DELETE
TO authenticated
USING (public.has_minimum_role(auth.uid(), 'diretor'::app_role));

CREATE POLICY "Directors can update invites"
ON public.project_invites FOR UPDATE
TO authenticated
USING (public.has_minimum_role(auth.uid(), 'diretor'::app_role));

CREATE POLICY "Authenticated users can accept invites"
ON public.project_invites FOR UPDATE
TO authenticated
USING (status = 'pendente' AND expires_at > now())
WITH CHECK (used_by = auth.uid() AND status = 'usado');

CREATE TRIGGER update_project_invites_updated_at
BEFORE UPDATE ON public.project_invites
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();