-- Step 1: Drop dependent policies first
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Step 2: Drop the function that depends on the enum
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Step 3: Remove default from column
ALTER TABLE public.user_roles ALTER COLUMN role DROP DEFAULT;

-- Step 4: Convert column to text
ALTER TABLE public.user_roles ALTER COLUMN role TYPE TEXT;

-- Step 5: Drop the old enum
DROP TYPE public.app_role;

-- Step 6: Create new enum with the hierarchy
CREATE TYPE public.app_role AS ENUM ('trainee', 'membro', 'diretor', 'presidencia', 'admin');

-- Step 7: Update the column back to the enum type
ALTER TABLE public.user_roles ALTER COLUMN role TYPE public.app_role USING role::public.app_role;

-- Step 8: Set default to 'trainee' for new users
ALTER TABLE public.user_roles ALTER COLUMN role SET DEFAULT 'trainee'::public.app_role;

-- Step 9: Recreate the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 10: Create a function to check if user has minimum role level
CREATE OR REPLACE FUNCTION public.has_minimum_role(_user_id uuid, _min_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = 'admin' OR
        CASE _min_role
          WHEN 'trainee' THEN role IN ('trainee', 'membro', 'diretor', 'presidencia', 'admin')
          WHEN 'membro' THEN role IN ('membro', 'diretor', 'presidencia', 'admin')
          WHEN 'diretor' THEN role IN ('diretor', 'presidencia', 'admin')
          WHEN 'presidencia' THEN role IN ('presidencia', 'admin')
          WHEN 'admin' THEN role = 'admin'
        END
      )
  )
$$;

-- Step 11: Recreate RLS policies
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 12: Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_count INTEGER;
  assigned_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Check if this is the first user
  SELECT COUNT(*) INTO user_count FROM public.user_roles;
  
  -- If no users exist yet, make this user an admin; otherwise, assign 'trainee' role
  IF user_count = 0 THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'trainee';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);
  
  RETURN NEW;
END;
$function$;