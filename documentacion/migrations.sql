-- ============================================================
-- MIGRACIONES
-- Ejecutar este archivo en Supabase SQL Editor si la BD ya existe.
-- Usa ADD COLUMN IF NOT EXISTS para que sea seguro de re-ejecutar.
-- ============================================================

-- v1.1: Compatibilidad con Edge Function fetch-safety-alerts
ALTER TABLE alertas ADD COLUMN IF NOT EXISTS detalles TEXT;
ALTER TABLE alertas ADD COLUMN IF NOT EXISTS fuente TEXT;
ALTER TABLE alertas ADD COLUMN IF NOT EXISTS link TEXT;

-- v1.2: Soporte para lógica de Origen-Destino en guías y tareas
ALTER TABLE guias_paises ADD COLUMN IF NOT EXISTS pais_origen_id UUID REFERENCES paises(id) ON DELETE CASCADE;
ALTER TABLE tareas_sugeridas ADD COLUMN IF NOT EXISTS pais_origen_id UUID REFERENCES paises(id) ON DELETE CASCADE;
