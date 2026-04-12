# ExpaIO - Manual de Usuario y Técnico (Versión Globalizada) 📘

Este documento detalla el funcionamiento de ExpaIO tras su transformación de una herramienta local (Suiza) a una plataforma de migración global y dinámica.

---

## PARTE 1: MANUAL DE USUARIO 🧭

### 1. El Concepto de "Origen-Destino"
A diferencia de otros blogs de migración, ExpaIO entiende que tus requisitos dependen de tu nacionalidad.
- **Perfil**: Al registrarte, defines tu país de origen y tu destino.
- **Personalización**: El sistema filtrará automáticamente la información para que sea relevante para ti (ej. trámites específicos para un latino mudándose a Europa).

### 2. Copiloto IA (Chat)
- **Sincronización Inteligente**: Al entrar al chat, verás un estado de "Sincronizando Origen → Destino". Esto asegura que el asistente cargue las leyes y convenios vigentes entre ambos países.
- **Asesoría de Visas**: Puedes preguntar directamente sobre tipos de visa. La IA responderá basándose en tu pasaporte registrado.

### 3. Centro de Guías Dinámico
- **Guía Inicial**: Tu primer paso en la app. Si tu país destino tiene una guía preparada, la verás. Si no, recibirás la **Guía Global de Migración** con los pilares fundamentales para no cometer errores en tu viaje.

### 4. Checklist de Tareas
- Gestiona tu progreso en tiempo real. Las tareas sugeridas se cargan según la fase de tu proceso (Planificación o Llegada).

### 5. Centro de Seguridad
- **Alertas Recientes**: Muestra las 10 estafas más comunes en tu país destino, actualizadas cada 24h automáticamente.
- **Búsqueda IA**: Puedes buscar cualquier tipo de fraude (ej: "estafa de alquiler") y la IA te responderá con los riesgos específicos de tu país.
- **Reportes Comunitarios**: Los usuarios pueden reportar estafas para alertar a la comunidad.

---

## PARTE 2: MANUAL TÉCNICO 🛠️

Guía técnica sobre la implementación de la lógica global y binacional.

### 1. Arquitectura de Inteligencia Artificial (Gemini)
El asistente utiliza el modelo **Gemini 2.0 Flash** con una lógica de **Persona Dinámica**:
- **Archivo**: `src/lib/geminiService.ts`
- **Lógica**: En cada inicio de chat (`resetChat`), se inyecta un `contextualPrompt` que define al asistente como experto en la relación *País A -> País B*.
- **Streaming**: La respuesta se entrega por fragmentos (chunks) para mejorar la experiencia de usuario y reducir la latencia percibida.

### 2. Sistema de Jerarquía de Contenidos (Waterfall)
El `GuideRepository.ts` implementa una lógica de búsqueda escalonada para maximizar la disponibilidad de información:
1.  **Nivel 1 (Específico)**: `pais_id` = Destino AND `pais_origen_id` = Origen. (Ej: Visa de trabajo para colombianos en Alemania).
2.  **Nivel 2 (General)**: `pais_id` = Destino AND `pais_origen_id` = NULL. (Ej: Guía general de vida en Alemania).
3.  **Nivel 3 (Mundial)**: `pais_id` = NULL AND `pais_origen_id` = NULL. (Ej: Consejos de ahorro para emigrantes).

### 3. Esquema de Base de Datos (Supabase)
Tablas clave actualizadas para la globalización:

| Tabla | Descripción |
| :--- | :--- |
| `paises` | Maestro de países: código ISO, moneda, símbolo. |
| `perfiles` | Datos del usuario: `pais_origen_id` y `pais_destino_id`. |
| `guias_paises` | Contenido Markdown. Soporta `pais_origen_id` para guías por nacionalidad. |
| `tareas_sugeridas` | Plantillas del checklist filtrables por origen/destino. |
| `alertas` | Alertas de estafas generadas por IA. Filtrables por `pais_id`. |
| `audios_integracion` | Cápsulas de audio por país o globales. |

### 4. Componentes Globalizados (Screens)
Pantallas que han sido refactorizadas de estáticas a dinámicas:
- **InitialGuideScreen.tsx**: Realiza fetch dinámico y maneja fallbacks mundiales.
- **ChatScreen.tsx**: Implementa estado de inicialización y sincronización binacional.
- **SafetyCenterScreen.tsx**: Carga alertas filtradas por el país destino del usuario.

### 5. Configuración de Desarrollo
Para añadir soporte a un nuevo país:
1.  Insertar el país en la tabla `paises`.
2.  Crear contenido en `guias_paises` vinculando el `id` del nuevo país.
3.  Invocar la Edge Function con `?country_code=XX&country_name=NombrePaís` para generar alertas.

---

## PARTE 3: SISTEMA DE ALERTAS DE SEGURIDAD 🔐

### Visión General
El Centro de Seguridad muestra alertas de estafas actualizadas diariamente de forma automática, sin intervención manual. Combina tres tecnologías: Edge Functions, pg_cron y pg_net.

### Flujo de Datos

```
Cada día a las 3:00am UTC:

  ┌─────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌──────────────┐
  │  pg_cron    │────▶│ Edge Function    │────▶│  Gemini AI  │────▶│  Tabla       │
  │ (scheduler) │     │ crawler-scams    │     │  2.0 Flash  │     │  alertas     │
  └─────────────┘     └──────────────────┘     └─────────────┘     └──────────────┘
  Dispara la           Orquesta la llamada       Genera 10            Los datos
  llamada HTTP         a la IA y la BD           alertas JSON         se guardan
```

### Componentes Técnicos

#### Edge Function (`crawler-scams`)
- **Ruta**: `supabase/functions/fetch-safety-alerts/index.ts`
- **Trigger**: HTTP GET (por pg_cron o invocación manual)
- **Parámetros opcionales**:
  - `?country_code=DE` → filtra por país en la BD (`paises.codigo`)
  - `?country_name=Alemania` → personaliza el prompt de Gemini
- **Sin parámetros**: genera alertas para Suiza por defecto

**Lógica interna:**
1. Resueve el `pais_id` desde `country_code` si se proporciona.
2. Construye un prompt pidiendo las 10 estafas más comunes.
3. Llama a Gemini 2.0 Flash y parsea el JSON de respuesta.
4. Borra las alertas antiguas del mismo país.
5. Inserta las nuevas con `pais_id` para filtrado en frontend.

#### Programador (pg_cron + pg_net)

**Instalación** (una sola vez en SQL Editor):
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

**Registrar el cron job:**
```sql
SELECT cron.schedule(
  'daily-scam-alerts-suiza',
  '0 3 * * *',
  $$
  SELECT net.http_get(
    url := 'https://vixnltmforfcivzrecuf.supabase.co/functions/v1/crawler-scams',
    headers := jsonb_build_object(
      'Authorization', 'Bearer <ANON_KEY>',
      'Content-Type', 'application/json'
    )
  );
  $$
);
```

**Verificar / gestionar jobs:**
```sql
SELECT jobid, schedule, active FROM cron.job;  -- Ver jobs
SELECT cron.unschedule(<jobid>);               -- Eliminar un job
```

#### Tabla `alertas` (esquema completo)

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Clave primaria |
| `pais_id` | UUID | País al que aplica. NULL = alerta global |
| `titulo` | TEXT | Título corto de la estafa |
| `descripcion` | TEXT | Resumen en una frase |
| `detalles` | TEXT | Instrucciones para evitarla o actuar |
| `fuente` | TEXT | Fuente oficial (policía, NCSC, BSI, etc.) |
| `prioridad` | TEXT | LOW / MEDIUM / HIGH / CRITICAL |
| `imagen_url` | TEXT | Imagen ilustrativa |
| `link` | TEXT | Enlace adicional (opcional) |
| `fecha_creacion` | TIMESTAMPTZ | Timestamp de inserción |

### Mantenimiento

Invocar la Edge Function para un país concreto:
```
GET https://vixnltmforfcivzrecuf.supabase.co/functions/v1/crawler-scams?country_code=DE&country_name=Alemania
```

Insertar una alerta manual:
```sql
INSERT INTO alertas (pais_id, titulo, descripcion, detalles, fuente, prioridad)
VALUES ('<uuid-pais>', 'Nombre estafa', 'Descripción', 'Pasos detallados', 'Fuente', 'HIGH');
```

---

## 📅 Roadmap de Globalización
- [x] Migración de lógica suiza a dinámica.
- [x] Implementación de Puente Origen-Destino en IA.
- [x] Sistema de Jerarquía de Guías (Fallback).
- [x] Sistema de Alertas de Seguridad automatizado (Edge Function + pg_cron).
- [ ] Refactorización de Calculadora y Directorio (Pendiente).
- [ ] Limpieza completa de referencias hardcoded en UI (Pendiente).