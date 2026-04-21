-- enable_country_insert.sql
-- Permitir de forma segura que los usuarios autenticados añadan nuevos países

-- Asegurar que RLS esté activado
ALTER TABLE public.paises ENABLE ROW LEVEL SECURITY;

-- 1. Permitir lectura a todos (necesario para ver la lista de países)
DROP POLICY IF EXISTS "Lectura publica de paises" ON public.paises;
CREATE POLICY "Lectura publica de paises" 
ON public.paises FOR SELECT 
USING (true);

-- 2. Permitir que usuarios autenticados inserten nuevos países
-- Las validaciones estrictas y la prevención de código inyectable se realizan en el frontend (AuthScreen.tsx)
DROP POLICY IF EXISTS "Usuarios autenticados pueden añadir paises" ON public.paises;
CREATE POLICY "Usuarios autenticados pueden añadir paises" 
ON public.paises FOR INSERT 
TO authenticated 
WITH CHECK (true);
