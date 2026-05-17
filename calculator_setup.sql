-- ========================================================
-- CALCULADORA: Tablas para persistencia y datos reales
-- ========================================================

-- 1. Costos de referencia por país (datos reales aproximados)
CREATE TABLE IF NOT EXISTS costos_referencia_pais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais_id UUID REFERENCES paises(id) ON DELETE CASCADE,
    concepto TEXT NOT NULL,        -- 'alquiler', 'seguro_salud', 'transporte', 'comida', 'vuelo'
    tipo TEXT NOT NULL DEFAULT 'mensual',  -- 'mensual' o 'unico'
    monto_estimado NUMERIC NOT NULL DEFAULT 0,
    moneda TEXT NOT NULL DEFAULT 'EUR',
    UNIQUE(pais_id, concepto)
);

-- 2. Gastos personalizados del usuario
CREATE TABLE IF NOT EXISTS gastos_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    nombre TEXT NOT NULL,
    monto NUMERIC NOT NULL DEFAULT 0,
    tipo TEXT NOT NULL DEFAULT 'mensual',  -- 'mensual' o 'unico'
    es_basico BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE costos_referencia_pais ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos_usuario ENABLE ROW LEVEL SECURITY;

-- Costos de referencia: públicos para lectura
CREATE POLICY "Costos referencia: lectura publica" ON costos_referencia_pais FOR SELECT USING (true);
CREATE POLICY "Costos referencia: admin edita" ON costos_referencia_pais FOR ALL USING (public.get_my_role() = 'admin');

-- Gastos usuario: privacidad total
CREATE POLICY "Gastos usuario: privacidad total" ON gastos_usuario FOR ALL 
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);


-- 3. Datos de costos de referencia reales (aprox. 2024-2025)
-- Alemania
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 950, 'EUR' FROM paises WHERE codigo = 'DE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 110, 'EUR' FROM paises WHERE codigo = 'DE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 49, 'EUR' FROM paises WHERE codigo = 'DE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 350, 'EUR' FROM paises WHERE codigo = 'DE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 200, 'EUR' FROM paises WHERE codigo = 'DE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- España
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 850, 'EUR' FROM paises WHERE codigo = 'ES'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 60, 'EUR' FROM paises WHERE codigo = 'ES'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 45, 'EUR' FROM paises WHERE codigo = 'ES'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 300, 'EUR' FROM paises WHERE codigo = 'ES'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 150, 'EUR' FROM paises WHERE codigo = 'ES'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- Suiza
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 1800, 'CHF' FROM paises WHERE codigo = 'CH'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 400, 'CHF' FROM paises WHERE codigo = 'CH'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 80, 'CHF' FROM paises WHERE codigo = 'CH'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 600, 'CHF' FROM paises WHERE codigo = 'CH'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 250, 'CHF' FROM paises WHERE codigo = 'CH'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- USA
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 1500, 'USD' FROM paises WHERE codigo = 'US'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 450, 'USD' FROM paises WHERE codigo = 'US'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 100, 'USD' FROM paises WHERE codigo = 'US'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 500, 'USD' FROM paises WHERE codigo = 'US'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 600, 'USD' FROM paises WHERE codigo = 'US'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- Francia
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 1100, 'EUR' FROM paises WHERE codigo = 'FR'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 50, 'EUR' FROM paises WHERE codigo = 'FR'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 75, 'EUR' FROM paises WHERE codigo = 'FR'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 400, 'EUR' FROM paises WHERE codigo = 'FR'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 180, 'EUR' FROM paises WHERE codigo = 'FR'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- Irlanda
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 1400, 'EUR' FROM paises WHERE codigo = 'IE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 80, 'EUR' FROM paises WHERE codigo = 'IE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 120, 'EUR' FROM paises WHERE codigo = 'IE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 400, 'EUR' FROM paises WHERE codigo = 'IE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 120, 'EUR' FROM paises WHERE codigo = 'IE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- Australia
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 1600, 'AUD' FROM paises WHERE codigo = 'AU'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 150, 'AUD' FROM paises WHERE codigo = 'AU'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 180, 'AUD' FROM paises WHERE codigo = 'AU'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 500, 'AUD' FROM paises WHERE codigo = 'AU'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 1200, 'AUD' FROM paises WHERE codigo = 'AU'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- Noruega
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 12000, 'NOK' FROM paises WHERE codigo = 'NO'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 500, 'NOK' FROM paises WHERE codigo = 'NO'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 850, 'NOK' FROM paises WHERE codigo = 'NO'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 4000, 'NOK' FROM paises WHERE codigo = 'NO'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 2500, 'NOK' FROM paises WHERE codigo = 'NO'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- Bélgica
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 900, 'EUR' FROM paises WHERE codigo = 'BE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 100, 'EUR' FROM paises WHERE codigo = 'BE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 55, 'EUR' FROM paises WHERE codigo = 'BE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 350, 'EUR' FROM paises WHERE codigo = 'BE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 150, 'EUR' FROM paises WHERE codigo = 'BE'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;

-- Portugal
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'alquiler', 'mensual', 750, 'EUR' FROM paises WHERE codigo = 'PT'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'seguro_salud', 'mensual', 40, 'EUR' FROM paises WHERE codigo = 'PT'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'transporte', 'mensual', 40, 'EUR' FROM paises WHERE codigo = 'PT'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'comida', 'mensual', 280, 'EUR' FROM paises WHERE codigo = 'PT'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
INSERT INTO costos_referencia_pais (pais_id, concepto, tipo, monto_estimado, moneda) 
SELECT id, 'vuelo', 'unico', 100, 'EUR' FROM paises WHERE codigo = 'PT'
ON CONFLICT (pais_id, concepto) DO UPDATE SET monto_estimado = EXCLUDED.monto_estimado;
