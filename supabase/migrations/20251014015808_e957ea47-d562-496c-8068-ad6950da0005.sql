-- Create portfolios table for user portfolio collections
CREATE TABLE public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  template_id TEXT,
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create portfolio_sections table for flexible content blocks
CREATE TABLE public.portfolio_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;

-- Portfolios RLS policies
CREATE POLICY "Users can view own portfolios"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = user_id);

-- Portfolio sections RLS policies
CREATE POLICY "Users can view portfolio sections"
  ON public.portfolio_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_sections.portfolio_id
      AND (portfolios.user_id = auth.uid() OR portfolios.is_public = true)
    )
  );

CREATE POLICY "Users can insert own portfolio sections"
  ON public.portfolio_sections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_sections.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own portfolio sections"
  ON public.portfolio_sections FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_sections.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own portfolio sections"
  ON public.portfolio_sections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE portfolios.id = portfolio_sections.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolios_is_public ON public.portfolios(is_public);
CREATE INDEX idx_portfolio_sections_portfolio_id ON public.portfolio_sections(portfolio_id);

-- Trigger for updated_at
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();