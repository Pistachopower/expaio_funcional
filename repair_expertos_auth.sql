-- ==============================================================================
-- SCRIPT DE CORRECIÓN: SOLUCIONA EL "GRAN PROBLEMA" DE LOGEO Y REGISTRO
-- ==============================================================================

-- 0. ASEGURAR QUE EXISTE LA COLUMNA APROBADO (Evita error 42703)
ALTER TABLE public.expertos ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT false;

-- 1. ACTUALIZAR EL TRIGGER DE NUEVO USUARIO
-- Solución: Cuando un Abogado, Profesor, o Ayuda se registre, su `estado_cuenta`
-- se irá a 'pendiente' pero AHORA SI se creará automáticamente en la tabla de `expertos`
-- para que el administrador pueda verlo y aprobarlo.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insertamos en perfiles (funciona igual)
  INSERT INTO public.perfiles (id, nombre, apellido, username, genero, fecha_nacimiento, telefono, pais_origen_id, pais_destino_id, acepta_marketing, como_nos_conocio, rol, estado_cuenta)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'nombre',
    new.raw_user_meta_data->>'apellido',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'genero',
    NULLIF(new.raw_user_meta_data->>'fecha_nacimiento', '')::DATE,
    new.raw_user_meta_data->>'telefono',
    NULLIF(new.raw_user_meta_data->>'pais_origen_id', '')::UUID,
    NULLIF(new.raw_user_meta_data->>'pais_destino_id', '')::UUID,
    COALESCE((new.raw_user_meta_data->>'acepta_marketing')::BOOLEAN, false),
    new.raw_user_meta_data->>'como_nos_conocio',
    COALESCE(new.raw_user_meta_data->>'rol', 'emigrante'),
    CASE 
        WHEN COALESCE(new.raw_user_meta_data->>'rol', 'emigrante') IN ('emigrante', 'admin') THEN 'aprobado'
        ELSE 'pendiente'
    END
  );

  -- ¡NUEVO!: Insertar en "expertos" automáticamente si aplica el rol
  IF COALESCE(new.raw_user_meta_data->>'rol', 'emigrante') IN ('abogado', 'profesor', 'ayuda') THEN
    INSERT INTO public.expertos (usuario_id, profesion, aprobado)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'rol',
      false
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. POLÍTICAS RLS ESTRICTAS PARA PERFILES
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON perfiles;
DROP POLICY IF EXISTS "Users can update own profile" ON perfiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON perfiles;

-- Todo el mundo puede leer los perfiles (necesario para ver autores de foros)
DROP POLICY IF EXISTS "Lectura de Perfiles" ON perfiles;
CREATE POLICY "Lectura de Perfiles" ON perfiles FOR SELECT USING (true);

-- Usuarios actualizan SOLO su propio perfil
DROP POLICY IF EXISTS "Actualizar Perfil Propio" ON perfiles;
CREATE POLICY "Actualizar Perfil Propio" ON perfiles FOR UPDATE USING (auth.uid() = id);

-- Administradores pueden actualizar todos los perfiles
DROP POLICY IF EXISTS "Admin Actualiza Todo" ON perfiles;
CREATE POLICY "Admin Actualiza Todo" ON perfiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);


-- 3. POLÍTICAS RLS ESTRICTAS PARA EXPERTOS
ALTER TABLE expertos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Expertos publicos" ON expertos;
DROP POLICY IF EXISTS "Expertos editan perfil" ON expertos;
DROP POLICY IF EXISTS "Expertos insertan perfil" ON expertos;

-- Lectura: Puedes ver un experto SI está aprobado, o SI eres tú mismo, o SI eres admin. Ningún usuario o experto puede espiar a expertos "pendientes" de otra persona.
DROP POLICY IF EXISTS "Lectura de Expertos Controlada" ON expertos;
CREATE POLICY "Lectura de Expertos Controlada" ON expertos FOR SELECT USING (
    aprobado = true 
    OR auth.uid() = usuario_id 
    OR EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);

-- Actualizar: El experto puede actualizar sus datos propios (como profesion y biografia).
DROP POLICY IF EXISTS "Actualizar Propio Experto" ON expertos;
CREATE POLICY "Actualizar Propio Experto" ON expertos FOR UPDATE USING (
    auth.uid() = usuario_id
);

-- Inserts: Puedes añadir manualmente un experto solo si es a ti mismo (y el trigger ya lo hace por defecto, pero esta cubierta de seguridad es vital)
DROP POLICY IF EXISTS "Insertar Experto Propio" ON expertos;
CREATE POLICY "Insertar Experto Propio" ON expertos FOR INSERT WITH CHECK (
    auth.uid() = usuario_id
);

-- Admin puede hacer todo sobre Expertos (Aprobarlos, Rechazarlos, Borrarlos)
DROP POLICY IF EXISTS "Admin Todo Sobre Expertos" ON expertos;
CREATE POLICY "Admin Todo Sobre Expertos" ON expertos USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
);
