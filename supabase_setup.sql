-- ========================================================
-- EXPAIO GLOBAL SETUP - FULL CONSOLIDATED VERSION (v2)
-- Resolves: Redundant table definitions and column errors
-- ========================================================

-- 1. Bases Geográficas
CREATE TABLE IF NOT EXISTS paises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    codigo TEXT UNIQUE NOT NULL,
    moneda TEXT DEFAULT 'EUR',
    simbolo_moneda TEXT DEFAULT '€'
);

CREATE TABLE IF NOT EXISTS ciudades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    pais_id UUID REFERENCES paises(id) ON DELETE CASCADE,
    region TEXT
);

INSERT INTO paises (nombre, codigo, moneda, simbolo_moneda) VALUES 
('España', 'ES', 'EUR', '€'), 
('Suiza', 'CH', 'CHF', 'CHF'), 
('Alemania', 'DE', 'EUR', '€'), 
('USA', 'US', 'USD', '$'), 
('Francia', 'FR', 'EUR', '€'), 
('Irlanda', 'IE', 'EUR', '€'), 
('Australia', 'AU', 'AUD', 'A$'),
('Noruega', 'NO', 'NOK', 'kr'), 
('Bélgica', 'BE', 'EUR', '€'), 
('Portugal', 'PT', 'EUR', '€') 
ON CONFLICT (codigo) DO UPDATE SET 
    moneda = EXCLUDED.moneda, 
    simbolo_moneda = EXCLUDED.simbolo_moneda;

-- 2. Guías Dinámicas
CREATE TABLE IF NOT EXISTS guias_paises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais_id UUID REFERENCES paises(id) ON DELETE CASCADE, -- Pais Destino
    pais_origen_id UUID REFERENCES paises(id) ON DELETE CASCADE, -- Pais Origen (opcional)
    tipo_guia TEXT NOT NULL, -- 'trabajo', 'impuestos', 'seguros', 'alquiler', 'vuelos', 'inicial'
    titulo TEXT NOT NULL,
    subtitulo TEXT,
    contenido_markdown TEXT,
    glosario_json JSONB DEFAULT '[]'::jsonb,
    fecha_actualizacion TIMESTAMPTZ DEFAULT now(),
    UNIQUE(pais_id, pais_origen_id, tipo_guia)
);

-- 3. Perfiles y Seguridad
CREATE TABLE IF NOT EXISTS perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    username TEXT,
    fecha_nacimiento DATE,
    genero TEXT,
    foto_url TEXT,
    pais_origen_id UUID REFERENCES paises(id),
    ciudad_origen_id UUID REFERENCES ciudades(id),
    pais_destino_id UUID REFERENCES paises(id),
    idioma_preferido TEXT,
    telefono TEXT,
    descripcion TEXT,
    acepta_marketing BOOLEAN DEFAULT false,
    como_nos_conocio TEXT,
    rol TEXT DEFAULT 'emigrante',
    estado_cuenta TEXT DEFAULT 'aprobado',
    fecha_actualizacion TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON perfiles;
CREATE POLICY "Public profiles are viewable by everyone" ON perfiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON perfiles;
CREATE POLICY "Users can update own profile" ON perfiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can update any profile" ON perfiles;
CREATE POLICY "Admins can update any profile" ON perfiles FOR UPDATE USING (EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin'));

-- 4. Trigger de Registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre, apellido, username, genero, fecha_nacimiento, telefono, pais_origen_id, pais_destino_id, acepta_marketing, como_nos_conocio, rol, estado_cuenta)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'nombre',
    new.raw_user_meta_data->>'apellido',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'genero',
    (new.raw_user_meta_data->>'fecha_nacimiento')::DATE,
    new.raw_user_meta_data->>'telefono',
    (new.raw_user_meta_data->>'pais_origen_id')::UUID,
    (new.raw_user_meta_data->>'pais_destino_id')::UUID,
    COALESCE((new.raw_user_meta_data->>'acepta_marketing')::BOOLEAN, false),
    new.raw_user_meta_data->>'como_nos_conocio',
    COALESCE(new.raw_user_meta_data->>'rol', 'emigrante'),
    CASE 
        WHEN COALESCE(new.raw_user_meta_data->>'rol', 'emigrante') IN ('emigrante', 'admin') THEN 'aprobado'
        ELSE 'pendiente'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Expertos y Valoraciones
CREATE TABLE IF NOT EXISTS expertos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profesion TEXT NOT NULL,
    biografia TEXT,
    aprobado BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS valoraciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experto_id UUID REFERENCES expertos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    puntuacion INT CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha TIMESTAMPTZ DEFAULT now()
);

-- 6. Comunidades y Feed
CREATE TABLE IF NOT EXISTS comunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    pais_id UUID REFERENCES paises(id),
    tema TEXT
);

CREATE TABLE IF NOT EXISTS publicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comunidad_id UUID REFERENCES comunidades(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    contenido TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

-- 7. Herramientas y Mensajería
CREATE TABLE IF NOT EXISTS chatbots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    pais_id UUID REFERENCES paises(id)
);

CREATE TABLE IF NOT EXISTS mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID REFERENCES chatbots(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rol TEXT,
    contenido TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usuario_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    completado BOOLEAN DEFAULT false,
    UNIQUE(usuario_id, item_id)
);

-- 8. Seguridad y Reportes
CREATE TABLE IF NOT EXISTS alertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais_id UUID REFERENCES paises(id), -- NULL = alerta global
    titulo TEXT,
    descripcion TEXT,
    detalles TEXT,          -- Instrucciones detalladas para evitar la estafa
    fuente TEXT,            -- Fuente oficial (ej: NCSC, Policía, etc.)
    prioridad TEXT DEFAULT 'MEDIUM', -- LOW | MEDIUM | HIGH | CRITICAL
    imagen_url TEXT,
    link TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reportes_comunitarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contenido TEXT,
    plataforma TEXT,
    likes INT DEFAULT 0,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

-- 9. Sugerencias
CREATE TABLE IF NOT EXISTS sugerencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    categoria TEXT,
    contenido TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

-- 10. Directorio Verificado
CREATE TABLE IF NOT EXISTS directorio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais_id UUID REFERENCES paises(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    tipo TEXT, -- 'medical', 'legal', 'education', 'other'
    tag TEXT,
    ubicacion TEXT,
    descripcion TEXT,
    imagen_url TEXT,
    verificado BOOLEAN DEFAULT false,
    telefono TEXT,
    email TEXT,
    sitio_web TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE directorio ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Directorio is public" ON directorio;
CREATE POLICY "Directorio is public" ON directorio FOR SELECT USING (true);

-- 11. Tareas Sugeridas (Checklist Global)
CREATE TABLE IF NOT EXISTS tareas_sugeridas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pais_id UUID REFERENCES paises(id) ON DELETE CASCADE, -- NULL para tareas genéricas (Destino)
    pais_origen_id UUID REFERENCES paises(id) ON DELETE CASCADE, -- NULL para cualquier origen
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fase TEXT NOT NULL, -- 'planificacion', 'llegada'
    detalles_json JSONB DEFAULT '{}'::jsonb,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tareas_sugeridas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tareas sugeridas publicas" ON tareas_sugeridas;
CREATE POLICY "Tareas sugeridas publicas" ON tareas_sugeridas FOR SELECT USING (true);

-- 12. Datos de Prueba Finales
DO $$
DECLARE
    suiza_id UUID;
BEGIN
    SELECT id INTO suiza_id FROM paises WHERE codigo = 'CH';
    
    -- Guía Inicial Suiza
    INSERT INTO guias_paises (pais_id, tipo_guia, titulo, contenido_markdown)
    VALUES (suiza_id, 'inicial', 'Primeros Pasos en Suiza', '# Bienvenido\n\nContenido de la guía inicial...')
    ON CONFLICT (pais_id, tipo_guia) DO NOTHING;

    -- Semilla Directorio Suiza
    INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
    VALUES 
    (suiza_id, 'Cruz Roja Suiza', 'medical', 'Humanitario', 'Zürich / Nacional', 'Ayuda humanitaria, integración y soporte médico.', 'https://www.redcross.ch/logo.png', true, '044 388 25 25', 'info@srk-zuerich.ch', 'https://www.srk-zuerich.ch'),
    (suiza_id, 'Freiplatzaktion Zürich', 'legal', 'Legal Gratuito', 'Zürich', 'Asesoramiento jurídico gratuito y representación para refugiados.', 'https://freiplatzaktion.ch/logo.png', true, '044 245 54 20', 'info@freiplatzaktion.ch', 'https://freiplatzaktion.ch'),
    (suiza_id, 'Latinas en Suiza', 'other', 'Comunidad', 'Online / Nacional', 'Plataforma de apoyo y conexión para mujeres latinoamericanas.', 'https://latinasensuiza.ch/logo.png', true, null, 'hola@latinasensuiza.ch', 'https://latinasensuiza.ch')
    ON CONFLICT DO NOTHING;

    -- Guía Inicial GLOBAL (Fallback para cualquier país)
    INSERT INTO guias_paises (pais_id, tipo_guia, titulo, contenido_markdown)
    VALUES (NULL, 'inicial', 'Guía de Migración Global', '# Prepárate para tu nueva vida\n\nMigrar es un reto emocionante. Aquí tienes los pilares fundamentales que debes preparar:\n\n### 1. Fondos de Emergencia\nRecomendamos tener al menos 3 a 6 meses de gastos cubiertos antes de viajar.\n\n### 2. Documentación\nAsegúrate de tener tu pasaporte en vigor, títulos apostillados y antecedentes penales si son requeridos.\n\n### 3. Alojamiento Temporal\nNo alquiles a largo plazo sin ver la propiedad. Usa AirBnb o Hostales para las primeras semanas.')
    ON CONFLICT (pais_id, tipo_guia) DO NOTHING;

    -- Guía Inicial Alemania
    DECLARE
        alemania_id UUID;
    BEGIN
        SELECT id INTO alemania_id FROM paises WHERE codigo = 'DE';
        IF alemania_id IS NOT NULL THEN
            INSERT INTO guias_paises (pais_id, tipo_guia, titulo, contenido_markdown)
            VALUES (alemania_id, 'inicial', 'Primeros Pasos en Alemania', '# Willkommen in Deutschland\n\nAlemania ofrece grandes oportunidades. Aquí tus primeros trámites:\n\n### 1. El Anmeldung\nEs el registro de tu dirección. Sin él no puedes abrir cuenta bancaria ni tener número de impuestos.\n\n### 2. Seguro Médico\nEs obligatorio. Puedes elegir entre público (AOK, TK) o privado.\n\n### 3. Cuenta de Banco\nOpciones como N26 o Deutsche Bank son populares para recién llegados.')
            ON CONFLICT (pais_id, tipo_guia) DO NOTHING;
        END IF;
    END;

    -- Tareas Sugeridas Globales (Generales)
    INSERT INTO tareas_sugeridas (pais_id, titulo, descripcion, fase, detalles_json)
    VALUES 
    (NULL, 'Ahorro Inicial', 'Calcula 3 meses de gastos + fianza.', 'planificacion', '{"tips": "Usa nuestra calculadora para un estimado preciso."}'),
    (NULL, 'Vuelo / Transporte', 'Reserva tu viaje con antelación.', 'planificacion', '{"tips": "Busca en Skyscanner o Google Flights."}'),
    (NULL, 'Documentación', 'Prepara pasaporte y títulos apostillados.', 'planificacion', '{"requirements": ["Pasaporte", "Títulos", "Antecedentes"]}'),
    (NULL, 'Internet / SIM Local', 'Consigue conectividad al llegar.', 'llegada', '{"tips": "Busca prepagos en el aeropuerto."}');

    -- Tareas Sugeridas Suiza
    INSERT INTO tareas_sugeridas (pais_id, titulo, descripcion, fase, detalles_json)
    VALUES 
    (suiza_id, 'Registro en Gemeinde', 'Obligatorio en los primeros 14 días.', 'llegada', '{"requirements": ["Pasaporte", "Contrato de trabajo"], "tips": "Busca la oficina de habitantes de tu zona."}'),
    (suiza_id, 'Seguro Médico (KVG)', 'Obligatorio. Tienes 3 meses.', 'llegada', '{"options": ["Assura", "CSS", "Helsana"], "tips": "Compara en Comparis.ch"}'),
    (suiza_id, 'Responsabilidad Civil', 'Privathaftpflicht. Clave para alquilar.', 'llegada', '{"costs": "100-160 CHF/año", "tips": "Cubre daños accidentales."}');

    -- Audios de Integración (Cápsulas)
    CREATE TABLE IF NOT EXISTS audios_integracion (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pais_id UUID REFERENCES paises(id) ON DELETE CASCADE, -- NULL para globales
        filename TEXT NOT NULL,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        duracion TEXT,
        imagen_url TEXT,
        featured BOOLEAN DEFAULT false,
        fecha_creacion TIMESTAMPTZ DEFAULT now()
    );

    ALTER TABLE audios_integracion ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Audios publicos" ON audios_integracion;
    CREATE POLICY "Audios publicos" ON audios_integracion FOR SELECT USING (true);

    -- Semilla Audios Suiza
    INSERT INTO audios_integracion (pais_id, filename, titulo, descripcion, duracion, imagen_url, featured)
    VALUES 
    (suiza_id, '1_El_salto_hacia_ti_mismo.mp3', 'La barrera del idioma', 'Estrategias para el alemán y francés sin miedo.', '4:45', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', false),
    (suiza_id, '2_Adaptars_no_es_perder_tu_identidad_es-ampliarla.mp3', 'Mi primer año en Berna', 'Gestionando expectativas y emociones.', '6:15', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', false),
    (suiza_id, '3_Zurich_donde_la_disciplina_se_encuentra_con_la_calidad_de_vida.mp3', 'Proceso de planificación', 'Dominando la logística suiza.', '5:30', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80', true);

    -- Semilla Audios Globales
    INSERT INTO audios_integracion (pais_id, filename, titulo, descripcion, duracion, imagen_url, featured)
    VALUES 
    (NULL, '4_El_idioma_no_es_un_muro_es_una_llave.mp3', 'El idioma no es un muro', 'El idioma como llave para nuevas oportunidades.', '3:50', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80', false);
END $$;
