-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  linkedin_url TEXT,
  email TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Everyone can view active team members (public page)
CREATE POLICY "Anyone can view active team members"
ON public.team_members
FOR SELECT
USING (is_active = true);

-- Authenticated users with diretor+ role can view all members
CREATE POLICY "Directors can view all team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (public.has_minimum_role(auth.uid(), 'diretor'));

-- Directors can insert team members
CREATE POLICY "Directors can insert team members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (public.has_minimum_role(auth.uid(), 'diretor'));

-- Directors can update team members
CREATE POLICY "Directors can update team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (public.has_minimum_role(auth.uid(), 'diretor'));

-- Directors can delete team members
CREATE POLICY "Directors can delete team members"
ON public.team_members
FOR DELETE
TO authenticated
USING (public.has_minimum_role(auth.uid(), 'diretor'));

-- Trigger for updated_at
CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial team members
INSERT INTO public.team_members (name, role, display_order) VALUES
  ('Ryan', 'Diretor Presidente', 1),
  ('Victor', 'Diretor de Projetos', 2),
  ('Kauan', 'Diretor de Gente e Gestão', 3),
  ('Vitoria', 'Assessora de Presidência', 4),
  ('Rafael', 'Assessor de Projetos', 5),
  ('Robert', 'Assessor de Projetos', 6),
  ('Nathan', 'Assessor de Projetos', 7);