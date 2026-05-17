-- ========================================================
-- ANALYTICS: Tracking de eventos de usuario
-- ========================================================

CREATE TABLE IF NOT EXISTS eventos_pagina (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pagina TEXT NOT NULL,
    duracion_seg INTEGER DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE eventos_pagina ENABLE ROW LEVEL SECURITY;

-- Solo el admin puede leer todos; el usuario puede insertar los suyos
CREATE POLICY "Eventos: usuario inserta" ON eventos_pagina FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Eventos: admin lee todo" ON eventos_pagina FOR SELECT
USING (public.get_my_role() = 'admin');
