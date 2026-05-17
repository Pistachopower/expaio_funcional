-- ========================================================
-- DIRECTORIO: Seed de contactos por país
-- ========================================================

-- Suiza (CH)
INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Cruz Roja Suiza', 'medical', 'Humanitario', 'Zürich / Nacional',
'Ayuda humanitaria, integración y soporte médico. Servicios específicos para migrantes.',
'https://www.redcross.ch/sites/default/files/styles/16_9_1920_1080/public/2021-02/srk_logo_cmyk.png', true,
'044 388 25 25', 'info@srk-zuerich.ch', 'https://www.srk-zuerich.ch'
FROM paises WHERE codigo = 'CH';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Freiplatzaktion Zürich', 'legal', 'Legal Gratuito', 'Zürich',
'Asesoramiento jurídico gratuito y representación para refugiados y migrantes. Hablan español.',
'https://freiplatzaktion.ch/wp-content/uploads/2020/09/Logo_Freiplatzaktion_Zuerich.png', true,
'044 245 54 20', 'info@freiplatzaktion.ch', 'https://freiplatzaktion.ch'
FROM paises WHERE codigo = 'CH';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'CCSI Genève', 'legal', 'Apoyo Migrante', 'Genève',
'Centro de Contacto Suizos-Inmigrantes. Defensa de derechos y apoyo social en español.',
'https://ccsi.ch/wp-content/themes/ccsi/img/logo.png', true,
'022 304 48 60', 'info@ccsi.ch', 'https://ccsi.ch'
FROM paises WHERE codigo = 'CH';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Caritas Suiza', 'other', 'Ayuda Social', 'Luzern / Nacional',
'Apoyo a personas en situación de pobreza y refugiados. Consultas sociales y jurídicas.',
'https://www.caritas.ch/assets/images/logo/caritas_logo.svg', true,
'041 419 22 22', 'info@caritas.ch', 'https://www.caritas.ch'
FROM paises WHERE codigo = 'CH';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Latinas en Suiza', 'other', 'Comunidad', 'Online / Nacional',
'Plataforma de apoyo, conexión y empoderamiento para mujeres latinoamericanas en Suiza.',
NULL, true,
NULL, 'hola@latinasensuiza.ch', 'https://latinasensuiza.ch'
FROM paises WHERE codigo = 'CH';

-- Alemania (DE)
INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Caritas Alemania', 'other', 'Ayuda Social', 'Nacional',
'Asesoría para migrantes sobre integración, permisos de residencia y apoyo social.',
NULL, true,
NULL, 'info@caritas.de', 'https://www.caritas.de/hilfeundberatung/onlineberatung/migration'
FROM paises WHERE codigo = 'DE';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Pro Asyl', 'legal', 'Derechos Migrantes', 'Frankfurt / Nacional',
'Organización de defensa de los derechos de refugiados y migrantes. Asesoría legal gratuita.',
NULL, true,
'069 24231 0', 'proasyl@proasyl.de', 'https://www.proasyl.de'
FROM paises WHERE codigo = 'DE';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'AWO Integrationszentrum', 'education', 'Integración', 'Nacional',
'Centros de integración con cursos de idioma, asesoría laboral y apoyo en trámites.',
NULL, true,
NULL, NULL, 'https://www.awo.org'
FROM paises WHERE codigo = 'DE';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'VHS (Volkshochschule)', 'education', 'Idiomas', 'Nacional',
'Escuelas de idiomas públicas. Cursos de alemán a bajo costo para inmigrantes.',
NULL, true,
NULL, NULL, 'https://www.volkshochschule.de'
FROM paises WHERE codigo = 'DE';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Hispanos en Alemania', 'other', 'Comunidad', 'Online / Nacional',
'Comunidad hispanohablante en Alemania con foro activo, eventos y consejos para recién llegados.',
NULL, true,
NULL, NULL, 'https://www.facebook.com/groups/hispanosenalemania'
FROM paises WHERE codigo = 'DE';

-- España (ES)
INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'CEAR - Comisión de Ayuda al Refugiado', 'legal', 'Refugiados', 'Madrid / Nacional',
'Defensa del derecho de asilo y apoyo integral a personas migrantes y refugiadas.',
NULL, true,
'915 980 535', 'cear@cear.es', 'https://www.cear.es'
FROM paises WHERE codigo = 'ES';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Cruz Roja España - Migraciones', 'medical', 'Humanitario', 'Nacional',
'Programa de atención a inmigrantes y refugiados. Atención sanitaria, social y legal.',
NULL, true,
'900 22 11 22', NULL, 'https://www2.cruzroja.es'
FROM paises WHERE codigo = 'ES';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Oficina de Extranjería', 'legal', 'Trámites', 'Nacional',
'Oficinas gubernamentales para gestión de permisos de residencia, visados y NIE.',
NULL, true,
'060', NULL, 'https://extranjeros.inclusion.gob.es'
FROM paises WHERE codigo = 'ES';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Red Acoge', 'other', 'Integración', 'Nacional',
'Red de organizaciones para la integración de personas migrantes. Asesoría, formación y empleo.',
NULL, true,
NULL, 'info@redacoge.org', 'https://www.redacoge.org'
FROM paises WHERE codigo = 'ES';

-- USA (US)
INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'USCIS - Servicios de Inmigración', 'legal', 'Gobierno', 'Nacional',
'Servicios de Ciudadanía e Inmigración de EE.UU. Información oficial sobre visas y green cards.',
NULL, true,
'800-375-5283', NULL, 'https://www.uscis.gov/es'
FROM paises WHERE codigo = 'US';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'CLINIC - Catholic Legal Immigration Network', 'legal', 'Legal Gratuito', 'Nacional',
'Red católica de asistencia legal migratoria. Representación legal de bajo costo.',
NULL, true,
NULL, NULL, 'https://cliniclegal.org'
FROM paises WHERE codigo = 'US';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'RAICES Texas', 'legal', 'Derechos Migrantes', 'Texas / Nacional',
'Organización sin fines de lucro que ofrece servicios legales gratuitos a migrantes.',
NULL, true,
NULL, NULL, 'https://www.raicestexas.org'
FROM paises WHERE codigo = 'US';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Unidos US', 'other', 'Comunidad Latina', 'Nacional',
'Organización de empoderamiento latino. Salud, educación, economía y derechos civiles.',
NULL, true,
NULL, NULL, 'https://unidosus.org'
FROM paises WHERE codigo = 'US';

-- Francia (FR)
INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'France terre d''asile', 'legal', 'Asilo', 'París / Nacional',
'Organización de referencia en derecho de asilo y protección de refugiados en Francia.',
NULL, true,
'01 53 04 39 99', NULL, 'https://www.france-terre-asile.org'
FROM paises WHERE codigo = 'FR';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'OFII - Oficina de Inmigración', 'legal', 'Gobierno', 'Nacional',
'Oficina francesa de inmigración e integración. Contrato de integración, cursos de francés.',
NULL, true,
NULL, NULL, 'https://www.ofii.fr'
FROM paises WHERE codigo = 'FR';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Hispanos en Francia', 'other', 'Comunidad', 'Online',
'Comunidad de apoyo para hispanohablantes en Francia. Consejos, eventos y networking.',
NULL, true,
NULL, NULL, 'https://www.facebook.com/groups/espanolesenparis'
FROM paises WHERE codigo = 'FR';

-- Irlanda (IE)
INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Immigrant Council of Ireland', 'legal', 'Derechos Migrantes', 'Dublin / Nacional',
'Consejo de inmigrantes de Irlanda. Asesoría legal, defensa de derechos y apoyo a la integración.',
NULL, true,
'+353 1 674 0200', NULL, 'https://www.immigrantcouncil.ie'
FROM paises WHERE codigo = 'IE';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Crosscare Migrant Project', 'other', 'Apoyo Social', 'Dublin',
'Servicio de información y apoyo para migrantes recién llegados. Empleo, vivienda, derechos.',
NULL, true,
'+353 1 873 2844', NULL, 'https://www.migrantproject.ie'
FROM paises WHERE codigo = 'IE';

-- Portugal (PT)
INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'ACM - Alto Comissariado Migrações', 'legal', 'Gobierno', 'Nacional',
'Organismo público para la integración de migrantes en Portugal. CNAIM, servicios legales.',
NULL, true,
'+351 218 106 100', NULL, 'https://www.acm.gov.pt'
FROM paises WHERE codigo = 'PT';

INSERT INTO directorio (pais_id, nombre, tipo, tag, ubicacion, descripcion, imagen_url, verificado, telefono, email, sitio_web)
SELECT id, 'Brasileiros e Latinos em Portugal', 'other', 'Comunidad', 'Online / Nacional',
'Comunidad activa de apoyo para inmigrantes latinos. Consejos sobre documentación y vida diaria.',
NULL, true,
NULL, NULL, 'https://www.facebook.com/groups/brasileirosemlisboa'
FROM paises WHERE codigo = 'PT';
