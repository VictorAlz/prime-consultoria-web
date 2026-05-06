-- Function: can_invite
CREATE OR REPLACE FUNCTION public.can_invite(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_role(_user_id, 'admin') OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = _user_id
        AND project_role IN ('Diretor de Projetos','Coordenador de Projetos')
    )
$$;

-- project_invites: replace director-based policies with can_invite
DROP POLICY IF EXISTS "Directors can view invites" ON public.project_invites;
DROP POLICY IF EXISTS "Directors can create invites" ON public.project_invites;
DROP POLICY IF EXISTS "Directors can delete invites" ON public.project_invites;
DROP POLICY IF EXISTS "Directors can update invites" ON public.project_invites;

CREATE POLICY "Inviters can view invites"
ON public.project_invites FOR SELECT
TO authenticated
USING (public.can_invite(auth.uid()));

CREATE POLICY "Inviters can create invites"
ON public.project_invites FOR INSERT
TO authenticated
WITH CHECK (public.can_invite(auth.uid()) AND created_by = auth.uid());

CREATE POLICY "Inviters can update invites"
ON public.project_invites FOR UPDATE
TO authenticated
USING (public.can_invite(auth.uid()));

CREATE POLICY "Inviters can delete invites"
ON public.project_invites FOR DELETE
TO authenticated
USING (public.can_invite(auth.uid()));
