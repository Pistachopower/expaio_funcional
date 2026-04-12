# ExpaIO - Plataforma de Migración Global 🌍

**ExpaIO** es el copiloto inteligente para cualquier persona que esté planeando o viviendo un proceso de migración. A diferencia de las guías estáticas, ExpaIO utiliza Inteligencia Artificial Generativa y una arquitectura binacional para ofrecer asesoramiento personalizado según el país de origen y el de destino del usuario.

## 🚀 Misión
Simplificar la burocracia, la logística y la adaptación cultural en cualquier proceso migratorio mediante tecnología accesible y experta.

---

## 📸 Funcionalidades Clave

### 🤖 Asistente IA Binacional
Un chat interactivo potenciado por **Google Gemini 2.0 Flash** que es plenamente consciente de la nacionalidad del usuario y su país de destino.
- **Lógica de Conexión**: Entiende los requisitos de visa, convenios de salud y normativas laborales específicas para cada par Origen → Destino (ej: Colombiano en Alemania).
- **Traducción Contextual**: Responde en el idioma del usuario facilitando la comprensión de términos legales extranjeros.

### ✅ Checklist Inteligente por Destino
Una lista de tareas dinámica que se adapta según el destino seleccionado.
- **Fases**: Planificación (Antes de viajar) y Llegada (Trámites locales).
- **Sincronización**: Progreso persistente en tiempo real vía Supabase.

### 📖 Guías Dinámicas (Tiered System)
Sistema de recursos con tres niveles de prioridad para asegurar que el usuario nunca esté desinformado:
1.  **Guía Específica**: Origen + Destino (ej: Visas para peruanos).
2.  **Guía de País**: Información general del destino.
3.  **Guía Global**: Pilares fundamentales de la migración (Fallback).

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Vite (Arquitectura Feature-Sliced Design).
- **Backend-as-a-Service**: Supabase (Auth, PostgreSQL, Realtime).
- **Edge Functions**: Supabase (Deno) + `pg_cron` + `pg_net` para automatización.
- **IA**: Google Generative AI SDK (Gemini 2.0 Flash).
- **Estilos**: TailwindCSS y CSS Puro.

---

## 📂 Estructura del Proyecto

```text
src/
├── api/            # Repositorios de datos (Supabase)
├── components/     # Componentes compartidos y Layout
├── context/        # Autenticación y Estados Globales
├── features/       # Módulos funcionales (Chat, Checklist, Profile)
├── lib/            # Clientes de servicios externos (Gemini, Supabase)
└── types/          # Definiciones de TypeScript
```

---

## 🛠️ Configuración Local

1. **Clonar y descargar dependencias**:
   ```bash
   npm install
   ```

2. **Variables de Entorno**:
   Crea un archivo `.env.local` con:
   ```env
   VITE_SUPABASE_URL=tu_url
   VITE_SUPABASE_ANON_KEY=tu_key
   VITE_GEMINI_API_KEY=tu_api_key
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

---

## 👥 Para Desarrolladores (Onboarding)
Si te unes al equipo de ExpaIO, revisa:
- 📘 [Manual de Usuario y Técnico](documentacion/MANUAL_USUARIO_Y_TECNICO.md) — lógica de negocio, IA y sistema de alertas.
- 🏗️ [Guía de Arquitectura](documentacion/ARQUITECTURA.md) — esquema de BD, repositorios y flujo de datos.
- 🗄️ [Migraciones SQL](documentacion/migrations.sql) — cambios de esquema para entornos existentes.
