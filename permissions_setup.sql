-- ========================================================
-- EXPAIO PERMISSIONS & RLS SETUP (v2 - FIX RECURSION)
-- ========================================================

-- 1. Función auxiliar para verificar rol SIN disparar RLS
-- SECURITY DEFINER hace que se ejecute con permisos del creador (admin),
-- saltándose las políticas RLS y evitando la recursión infinita.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT rol FROM public.perfiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Asegurar que las tablas tengan RLS habilitado
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expertos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE directorio ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas_sugeridas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicaciones ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- 3. POLÍTICAS PARA 'PERFILES'
-- ========================================================
-- Limpiar políticas anteriores que causan recursión
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON perfiles;
DROP POLICY IF EXISTS "Users can update own profile" ON perfiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON perfiles;
DROP POLICY IF EXISTS "Perfiles: Ver todos" ON perfiles;
DROP POLICY IF EXISTS "Perfiles: Editar propio" ON perfiles;
DROP POLICY IF EXISTS "Perfiles: Admin gestiona todo" ON perfiles;

-- Todos pueden ver perfiles
CREATE POLICY "Perfiles: Ver todos" ON perfiles FOR SELECT USING (true);

-- Cada usuario edita su propio perfil
CREATE POLICY "Perfiles: Editar propio" ON perfiles FOR UPDATE 
USING (auth.uid() = id);

-- Admin puede hacer todo (usa la función para evitar recursión)
CREATE POLICY "Perfiles: Admin gestiona todo" ON perfiles FOR ALL 
USING (public.get_my_role() = 'admin');

-- ========================================================
-- 4. POLÍTICAS PARA 'EXPERTOS'
-- ========================================================
DROP POLICY IF EXISTS "Expertos: Ver todos" ON expertos;
DROP POLICY IF EXISTS "Expertos: Gestionar propio" ON expertos;

CREATE POLICY "Expertos: Ver todos" ON expertos FOR SELECT USING (true);

CREATE POLICY "Expertos: Gestionar propio" ON expertos FOR ALL 
USING (
    auth.uid() = usuario_id AND 
    public.get_my_role() IN ('abogado', 'profesor', 'ayuda')
);

-- ========================================================
-- 5. POLÍTICAS PARA CONTENIDO GLOBAL (Solo Admins)
-- ========================================================
DROP POLICY IF EXISTS "Alertas: Ver todos" ON alertas;
DROP POLICY IF EXISTS "Alertas: Solo Admin edita" ON alertas;
DROP POLICY IF EXISTS "Directorio is public" ON directorio;
DROP POLICY IF EXISTS "Directorio: Ver todos" ON directorio;
DROP POLICY IF EXISTS "Directorio: Solo Admin edita" ON directorio;

CREATE POLICY "Alertas: Ver todos" ON alertas FOR SELECT USING (true);
CREATE POLICY "Alertas: Solo Admin edita" ON alertas FOR ALL 
USING (public.get_my_role() = 'admin');

CREATE POLICY "Directorio: Ver todos" ON directorio FOR SELECT USING (true);
CREATE POLICY "Directorio: Solo Admin edita" ON directorio FOR ALL 
USING (public.get_my_role() = 'admin');

-- ========================================================
-- 6. POLÍTICAS PARA 'USUARIO_CHECKLISTS'
-- ========================================================
DROP POLICY IF EXISTS "Checklist: Privacidad total" ON usuario_checklists;

CREATE POLICY "Checklist: Privacidad total" ON usuario_checklists FOR ALL 
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

-- ========================================================
-- 7. POLÍTICAS PARA 'PUBLICACIONES'
-- ========================================================
DROP POLICY IF EXISTS "Publicaciones: Ver todas" ON publicaciones;
DROP POLICY IF EXISTS "Publicaciones: Crear si estas logueado" ON publicaciones;
DROP POLICY IF EXISTS "Publicaciones: Editar propia" ON publicaciones;

CREATE POLICY "Publicaciones: Ver todas" ON publicaciones FOR SELECT USING (true);

CREATE POLICY "Publicaciones: Crear si estas logueado" ON publicaciones FOR INSERT 
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Publicaciones: Editar propia" ON publicaciones FOR UPDATE 
USING (auth.uid() = usuario_id OR public.get_my_role() = 'admin');
