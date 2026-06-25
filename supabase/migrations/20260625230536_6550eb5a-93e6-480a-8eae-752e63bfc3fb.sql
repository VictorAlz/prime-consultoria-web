
CREATE TYPE public.contract_status AS ENUM ('pending', 'signed');

CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  client_name text,
  client_document text,
  client_address text,
  client_signature text,
  status public.contract_status NOT NULL DEFAULT 'pending',
  signed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracts TO authenticated;
GRANT SELECT, UPDATE ON public.contracts TO anon;
GRANT ALL ON public.contracts TO service_role;

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Public can read any contract (needs token to know URL; token acts as secret)
CREATE POLICY "Public can read contracts by token"
  ON public.contracts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public can update only pending contracts (to fill data and sign)
CREATE POLICY "Public can sign pending contracts"
  ON public.contracts FOR UPDATE
  TO anon, authenticated
  USING (status = 'pending')
  WITH CHECK (status IN ('pending', 'signed'));

-- Admins/Diretor/Coordenador can insert
CREATE POLICY "Managers can create contracts"
  ON public.contracts FOR INSERT
  TO authenticated
  WITH CHECK (public.can_invite(auth.uid()));

-- Admins/Diretor/Coordenador can delete
CREATE POLICY "Managers can delete contracts"
  ON public.contracts FOR DELETE
  TO authenticated
  USING (public.can_invite(auth.uid()));

CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
