-- 1. Bases Geográficas
CREATE TABLE IF NOT EXISTS paises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    codigo CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ciudades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    pais_id UUID REFERENCES paises(id) ON DELETE CASCADE,
    region TEXT
);

-- INSERCIÓN TEMPORAL DE PAÍSES DE PRUEBA
INSERT INTO paises (nombre, codigo) VALUES ('España', 'ES'), ('Suiza', 'CH'), ('México', 'MX'), ('Colombia', 'CO'), ('Argentina', 'AR') ON CONFLICT DO NOTHING;

-- 2. Limpieza de Tablas Antiguas (¡CUIDADO! Esto borra datos viejos incompatibles para dejar el esquema limpio)
DROP TABLE IF EXISTS user_checklists CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chatbots CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE IF NOT EXISTS perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    fecha_nacimiento DATE,
    genero TEXT,
    foto_url TEXT,
    pais_origen_id UUID REFERENCES paises(id),
    ciudad_origen_id UUID REFERENCES ciudades(id),
    idioma_preferido TEXT,
    telefono TEXT,
    descripcion TEXT,
    acepta_marketing BOOLEAN DEFAULT false,
    como_nos_conocio TEXT,
    rol TEXT DEFAULT 'emigrante',
    estado_cuenta TEXT DEFAULT 'aprobado',
    fecha_actualizacion TIMESTAMPTZ DEFAULT now()
);

-- Asegurarse de que si la tabla ya existía de antes, agregue las nuevas columnas:
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS rol TEXT DEFAULT 'emigrante';
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS estado_cuenta TEXT DEFAULT 'aprobado';

-- Políticas RLS para perfiles
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON perfiles;
CREATE POLICY "Public profiles are viewable by everyone" ON perfiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON perfiles;
CREATE POLICY "Users can update own profile" ON perfiles FOR UPDATE USING (auth.uid() = id);

-- Trigger de Registro de Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (
    id,
    nombre,
    apellido,
    genero,
    fecha_nacimiento,
    telefono,
    pais_origen_id,
    acepta_marketing,
    como_nos_conocio,
    rol,
    estado_cuenta
  )
  VALUES (
    new.id,
    new.raw_user_meta_data->>'nombre',
    new.raw_user_meta_data->>'apellido',
    new.raw_user_meta_data->>'genero',
    (new.raw_user_meta_data->>'fecha_nacimiento')::DATE,
    new.raw_user_meta_data->>'telefono',
    (new.raw_user_meta_data->>'pais_origen_id')::UUID,
    COALESCE((new.raw_user_meta_data->>'acepta_marketing')::BOOLEAN, false),
    new.raw_user_meta_data->>'como_nos_conocio',
    COALESCE(new.raw_user_meta_data->>'rol', 'emigrante'),
    CASE 
        WHEN COALESCE(new.raw_user_meta_data->>'rol', 'emigrante') = 'emigrante' THEN 'aprobado'
        WHEN COALESCE(new.raw_user_meta_data->>'rol', 'emigrante') = 'admin' THEN 'aprobado'
        ELSE 'pendiente'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminamos trigger viejo y creamos el nuevo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Ya no usamos tablas asociativas complejas de roles
DROP TABLE IF EXISTS usuario_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;


-- 5. Migraciones y Permisos
CREATE TABLE IF NOT EXISTS migraciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pais_origen_id UUID REFERENCES paises(id),
    ciudad_origen_id UUID REFERENCES ciudades(id),
    pais_destino_id UUID REFERENCES paises(id),
    ciudad_destino_id UUID REFERENCES ciudades(id),
    fecha_inicio DATE,
    fecha_fin DATE,
    motivo TEXT,
    estado TEXT,
    comentarios TEXT
);

CREATE TABLE IF NOT EXISTS permisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais_id UUID REFERENCES paises(id),
    nombre TEXT NOT NULL,
    tipo TEXT,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS migracion_permisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    migracion_id UUID REFERENCES migraciones(id) ON DELETE CASCADE,
    permiso_id UUID REFERENCES permisos(id),
    estado TEXT
);


-- 6. Expertos
CREATE TABLE IF NOT EXISTS expertos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profesion TEXT NOT NULL,
    biografia TEXT,
    sitio_web TEXT,
    redes_sociales TEXT
);

CREATE TABLE IF NOT EXISTS experto_ubicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experto_id UUID REFERENCES expertos(id) ON DELETE CASCADE,
    pais_id UUID REFERENCES paises(id),
    ciudad_id UUID REFERENCES ciudades(id)
);

CREATE TABLE IF NOT EXISTS valoraciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experto_id UUID REFERENCES expertos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    puntuacion INT CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 7. Favoritos y Contactos
CREATE TABLE IF NOT EXISTS favoritos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    experto_id UUID REFERENCES expertos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contactos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    experto_id UUID REFERENCES expertos(id) ON DELETE CASCADE,
    fecha_contacto TIMESTAMPTZ NOT NULL DEFAULT now(),
    mensaje TEXT
);


-- 8. Comunidades
CREATE TABLE IF NOT EXISTS comunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    pais_id UUID REFERENCES paises(id),
    ciudad_id UUID REFERENCES ciudades(id),
    tema TEXT
);

CREATE TABLE IF NOT EXISTS comunidad_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comunidad_id UUID REFERENCES comunidades(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rol TEXT  -- miembro, moderador, administrador
);

CREATE TABLE IF NOT EXISTS publicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comunidad_id UUID REFERENCES comunidades(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    contenido TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publicacion_id UUID REFERENCES publicaciones(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 9. Checklists y Chatbots
CREATE TABLE IF NOT EXISTS usuario_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    completado BOOLEAN NOT NULL DEFAULT false,
    fecha_actualizacion TIMESTAMPTZ DEFAULT now(),
    UNIQUE(usuario_id, item_id)
);

-- Renombrado bots a chatbots como indicaste
CREATE TABLE IF NOT EXISTS chatbots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    pais_id UUID REFERENCES paises(id),
    ciudad_id UUID REFERENCES ciudades(id),
    idioma TEXT,
    parametros JSONB,
    user_id UUID REFERENCES auth.users(id) -- Añadido temporalmente para compatibilidad con código
);

CREATE TABLE IF NOT EXISTS mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rol TEXT,
    contenido TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 10. Alertas y Reportes Comunitarios
CREATE TABLE IF NOT EXISTS alertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais_id UUID REFERENCES paises(id),
    ciudad_id UUID REFERENCES ciudades(id),
    tipo TEXT,
    idioma TEXT,
    titulo TEXT,
    descripcion TEXT,
    link TEXT,
    imagen_url TEXT,
    fuente TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- La vieja community_reports será reportes_comunitarios
DROP TABLE IF EXISTS community_reports CASCADE;
CREATE TABLE IF NOT EXISTS reportes_comunitarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contenido TEXT,
    pais_id UUID REFERENCES paises(id),
    ciudad_id UUID REFERENCES ciudades(id),
    plataforma TEXT,
    tipo_estafa TEXT,
    likes INT DEFAULT 0,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 11. Traducciones
CREATE TABLE IF NOT EXISTS traducciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entidad TEXT NOT NULL,
    referencia_id UUID NOT NULL,
    campo TEXT NOT NULL,
    idioma TEXT NOT NULL,
    texto TEXT NOT NULL
);


-- 12. Surgencias y Mejoras (NUEVA TABLA PARA FEEDBACK)
CREATE TABLE IF NOT EXISTS sugerencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    categoria TEXT, -- ej. mejora, comercial, profesor_contacto, fallo
    contenido TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente', -- pendiente, visto, implementado
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Políticas RLS para sugerencias (Usuarios autenticados pueden insertar, cualquiera no puede leerlas todas)
ALTER TABLE sugerencias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own suggestions" ON sugerencias;
CREATE POLICY "Users can create their own suggestions" ON sugerencias FOR INSERT TO authenticated WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Users can view their own suggestions" ON sugerencias;
CREATE POLICY "Users can view their own suggestions" ON sugerencias FOR SELECT TO authenticated USING (auth.uid() = usuario_id);

-- Configuración RLS basica para desarrollo de las otras tablas
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anon/auth" ON chatbots;
CREATE POLICY "Enable all for anon/auth" ON chatbots USING (true);

ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anon/auth" ON mensajes;
CREATE POLICY "Enable all for anon/auth" ON mensajes USING (true);

ALTER TABLE reportes_comunitarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anon/auth" ON reportes_comunitarios;
CREATE POLICY "Enable all for anon/auth" ON reportes_comunitarios USING (true);

ALTER TABLE usuario_checklists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anon/auth" ON usuario_checklists;
CREATE POLICY "Enable all for anon/auth" ON usuario_checklists USING (true);
