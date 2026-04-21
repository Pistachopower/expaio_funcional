-- ========================================================
-- SCRIPT DE SEGURIDAD: ACTIVAR RLS EN TODAS LAS TABLAS
-- Ejecuta este script en el SQL Editor de Supabase
-- para resolver la advertencia "Table publicly accessible"
-- ========================================================

-- 1. Paises y Ciudades (Solo Lectura Pública, Edición solo Admin)
ALTER TABLE paises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Paises publicos" ON paises;
CREATE POLICY "Paises publicos" ON paises FOR SELECT USING (true);

ALTER TABLE ciudades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Ciudades publicas" ON ciudades;
CREATE POLICY "Ciudades publicas" ON ciudades FOR SELECT USING (true);

-- 2. Guias y Sugerencias
ALTER TABLE guias_paises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Guias publicas" ON guias_paises;
CREATE POLICY "Guias publicas" ON guias_paises FOR SELECT USING (true);

-- 3. Expertos (Listado público, edición propia)
ALTER TABLE expertos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Expertos publicos" ON expertos;
CREATE POLICY "Expertos publicos" ON expertos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Expertos editan perfil" ON expertos;
CREATE POLICY "Expertos editan perfil" ON expertos FOR UPDATE USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Expertos insertan perfil" ON expertos;
CREATE POLICY "Expertos insertan perfil" ON expertos FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- 4. Valoraciones (Lectura pública, creación y gestión propia)
ALTER TABLE valoraciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Valoraciones publicas" ON valoraciones;
CREATE POLICY "Valoraciones publicas" ON valoraciones FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuarios insertan valoraciones" ON valoraciones;
CREATE POLICY "Usuarios insertan valoraciones" ON valoraciones FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios actualizan valoraciones" ON valoraciones;
CREATE POLICY "Usuarios actualizan valoraciones" ON valoraciones FOR UPDATE USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios borran valoraciones" ON valoraciones;
CREATE POLICY "Usuarios borran valoraciones" ON valoraciones FOR DELETE USING (auth.uid() = usuario_id);

-- 5. Comunidades (Lectura pública)
ALTER TABLE comunidades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comunidades publicas" ON comunidades;
CREATE POLICY "Comunidades publicas" ON comunidades FOR SELECT USING (true);

-- 6. Publicaciones (Lectura pública, gestión propia)
ALTER TABLE publicaciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Publicaciones publicas" ON publicaciones;
CREATE POLICY "Publicaciones publicas" ON publicaciones FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuarios crean publicaciones" ON publicaciones;
CREATE POLICY "Usuarios crean publicaciones" ON publicaciones FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios editan publicaciones" ON publicaciones;
CREATE POLICY "Usuarios editan publicaciones" ON publicaciones FOR UPDATE USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios borran publicaciones" ON publicaciones;
CREATE POLICY "Usuarios borran publicaciones" ON publicaciones FOR DELETE USING (auth.uid() = usuario_id);

-- 7. Chatbots y Mensajes (Chatbots público, mensajes privados)
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Chatbots publicos" ON chatbots;
CREATE POLICY "Chatbots publicos" ON chatbots FOR SELECT USING (true);

ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios leen mensajes propios" ON mensajes;
CREATE POLICY "Usuarios leen mensajes propios" ON mensajes FOR SELECT USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios crean mensajes" ON mensajes;
CREATE POLICY "Usuarios crean mensajes" ON mensajes FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios borran mensajes" ON mensajes;
CREATE POLICY "Usuarios borran mensajes" ON mensajes FOR DELETE USING (auth.uid() = usuario_id);

-- 8. Checklists de Usuario (Totalmente Privado)
ALTER TABLE usuario_checklists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios leen checklists propios" ON usuario_checklists;
CREATE POLICY "Usuarios leen checklists propios" ON usuario_checklists FOR SELECT USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios crean checklists" ON usuario_checklists;
CREATE POLICY "Usuarios crean checklists" ON usuario_checklists FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios actualizan checklists" ON usuario_checklists;
CREATE POLICY "Usuarios actualizan checklists" ON usuario_checklists FOR UPDATE USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios borran checklists" ON usuario_checklists;
CREATE POLICY "Usuarios borran checklists" ON usuario_checklists FOR DELETE USING (auth.uid() = usuario_id);

-- 9. Alertas y Reportes
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Alertas publicas" ON alertas;
CREATE POLICY "Alertas publicas" ON alertas FOR SELECT USING (true);

ALTER TABLE reportes_comunitarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reportes publicos" ON reportes_comunitarios;
CREATE POLICY "Reportes publicos" ON reportes_comunitarios FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuarios crean reportes" ON reportes_comunitarios;
CREATE POLICY "Usuarios crean reportes" ON reportes_comunitarios FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios editan reportes" ON reportes_comunitarios;
CREATE POLICY "Usuarios editan reportes" ON reportes_comunitarios FOR UPDATE USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios borran reportes" ON reportes_comunitarios;
CREATE POLICY "Usuarios borran reportes" ON reportes_comunitarios FOR DELETE USING (auth.uid() = usuario_id);

-- 10. Sugerencias de Feedback (Privadas)
ALTER TABLE sugerencias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios leen sugerencias propias" ON sugerencias;
CREATE POLICY "Usuarios leen sugerencias propias" ON sugerencias FOR SELECT USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios crean sugerencias" ON sugerencias;
CREATE POLICY "Usuarios crean sugerencias" ON sugerencias FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- 11. Tablas restantes (Migraciones, Permisos, Favoritos, etc.)

-- Migraciones (Lectura pública)
ALTER TABLE migraciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Migraciones publicas" ON migraciones;
CREATE POLICY "Migraciones publicas" ON migraciones FOR SELECT USING (true);

-- Permisos (Lectura pública)
ALTER TABLE permisos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permisos publicos" ON permisos;
CREATE POLICY "Permisos publicos" ON permisos FOR SELECT USING (true);

-- Migracion_Permisos (Lectura pública)
ALTER TABLE migracion_permisos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Migracion permisos publicos" ON migracion_permisos;
CREATE POLICY "Migracion permisos publicos" ON migracion_permisos FOR SELECT USING (true);

-- Experto_ubicaciones (Lectura pública)
ALTER TABLE experto_ubicaciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Experto ubicaciones publicas" ON experto_ubicaciones;
CREATE POLICY "Experto ubicaciones publicas" ON experto_ubicaciones FOR SELECT USING (true);

-- Favoritos (Privado para el usuario)
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios ven sus propios favoritos" ON favoritos;
CREATE POLICY "Usuarios ven sus propios favoritos" ON favoritos FOR SELECT USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios añaden favoritos" ON favoritos;
CREATE POLICY "Usuarios añaden favoritos" ON favoritos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios borran favoritos" ON favoritos;
CREATE POLICY "Usuarios borran favoritos" ON favoritos FOR DELETE USING (auth.uid() = usuario_id);

-- Contactos (Privado para el usuario)
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuarios ven sus contactos" ON contactos;
CREATE POLICY "Usuarios ven sus contactos" ON contactos FOR SELECT USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios añaden contactos" ON contactos;
CREATE POLICY "Usuarios añaden contactos" ON contactos FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios borran contactos" ON contactos;
CREATE POLICY "Usuarios borran contactos" ON contactos FOR DELETE USING (auth.uid() = usuario_id);

-- Comunidad_usuarios (Lectura pública)
ALTER TABLE comunidad_usuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comunidad usuarios publicos" ON comunidad_usuarios;
CREATE POLICY "Comunidad usuarios publicos" ON comunidad_usuarios FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuarios se unen a comunidades" ON comunidad_usuarios;
CREATE POLICY "Usuarios se unen a comunidades" ON comunidad_usuarios FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios abandonan comunidades" ON comunidad_usuarios;
CREATE POLICY "Usuarios abandonan comunidades" ON comunidad_usuarios FOR DELETE USING (auth.uid() = usuario_id);

-- Comentarios (Lectura pública, gestión propia)
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comentarios publicos" ON comentarios;
CREATE POLICY "Comentarios publicos" ON comentarios FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuarios crean comentarios" ON comentarios;
CREATE POLICY "Usuarios crean comentarios" ON comentarios FOR INSERT WITH CHECK (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios editan comentarios" ON comentarios;
CREATE POLICY "Usuarios editan comentarios" ON comentarios FOR UPDATE USING (auth.uid() = usuario_id);
DROP POLICY IF EXISTS "Usuarios borran comentarios" ON comentarios;
CREATE POLICY "Usuarios borran comentarios" ON comentarios FOR DELETE USING (auth.uid() = usuario_id);

-- Checklists (Lectura pública)
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Checklists publicos" ON checklists;
CREATE POLICY "Checklists publicos" ON checklists FOR SELECT USING (true);

-- Traducciones (Lectura pública)
ALTER TABLE traducciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Traducciones publicas" ON traducciones;
CREATE POLICY "Traducciones publicas" ON traducciones FOR SELECT USING (true);
