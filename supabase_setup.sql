-- Create the community_reports table
CREATE TABLE IF NOT EXISTS community_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    date_posted TEXT NOT NULL, -- Can be ISO string or descriptive like 'Hace 2 horas'
    likes INTEGER DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading by everyone (anon)
DROP POLICY IF EXISTS "Enable read access for all users" ON community_reports;
CREATE POLICY "Enable read access for all users" ON community_reports
    FOR SELECT TO anon USING (true);
    
-- Create policy to allow reading by authenticated users
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON community_reports;
CREATE POLICY "Enable read access for authenticated users" ON community_reports
    FOR SELECT TO authenticated USING (true);


-- Insert real seed data from Swiss scam reports (2024-2025)
INSERT INTO community_reports (platform, user_name, content, date_posted, likes, avatar_url) VALUES 
('Facebook', 'Laura M.', '¡OJO! Hay un grupo haciéndose pasar por el soporte de TWINT pidiendo verificar datos. Nunca den clic a enlaces por SMS.', 'Hace 4 horas', 156, 'https://ui-avatars.com/api/?name=Laura+M&background=random'),
('WhatsApp', 'Andreas K.', 'Recibí una llamada de una supuesta "Policía Federal" con voz robótica diciendo que mis cuentas están bloqueadas. Es ESTAFA (Voice Phishing). Cuelguen de inmediato.', 'Ayer', 342, 'https://ui-avatars.com/api/?name=Andreas+K&background=random'),
('Instagram', 'Sofia R.', 'Perfiles falsos vendiendo entradas para Taylor Swift en Zúrich. Me pidieron pago en Bitcoin. No caigan.', 'Hace 2 días', 89, 'https://ui-avatars.com/api/?name=Sofia+R&background=random'),
('Telegram', 'CryptoAlert CH', 'Nuevas "Plataformas de Inversión" prometiendo 10% diario. Son esquemas Ponzi. Si te piden impuestos para retirar tu dinero, es fraude.', 'Hace 5 horas', 210, 'https://ui-avatars.com/api/?name=Crypto+CH&background=random'),
('Facebook', 'Juan P.', 'Alerta de alquiler en Ginebra: Piden 2 meses de depósito por adelantado sin visitar el piso. Las fotos son robadas de un hotel.', 'Hace 1 día', 120, 'https://ui-avatars.com/api/?name=Juan+P&background=random'),
('Email', 'Sarah L.', 'Cuidado con emails de "Die Post" sobre paquetes retenidos en aduana por 2.50 CHF. El enlace roba tu tarjeta de crédito.', 'Hace 3 horas', 450, 'https://ui-avatars.com/api/?name=Sarah+L&background=random');

-- Create the safety_alerts table
CREATE TABLE IF NOT EXISTS safety_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    details TEXT,
    source TEXT,
    priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'MEDIUM',
    image_url TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for safety_alerts
ALTER TABLE safety_alerts ENABLE ROW LEVEL SECURITY;

-- Policy for reading alerts (public)
DROP POLICY IF EXISTS "Everyone can read safety alerts" ON safety_alerts;
CREATE POLICY "Everyone can read safety alerts" ON safety_alerts
    FOR SELECT TO anon, authenticated USING (true);

-- Policy for inserting alerts (only service_role or admins)
-- Assuming service_role will be used by the Edge Function
DROP POLICY IF EXISTS "Service role can manage alerts" ON safety_alerts;
CREATE POLICY "Service role can manage alerts" ON safety_alerts
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Seed data for safety_alerts (Ejemplo inicial)
INSERT INTO safety_alerts (title, description, details, source, priority, created_at) VALUES
('Phishing de "Swiss Post"', 'Correos fraudulentos pidiendo pago de aduanas por paquetes inexistentes.', 'Este es uno de los fraudes más comunes en Suiza.\n\n* **Cómo identificarlo:**\n  - El correo llega inesperadamente.\n  - Piden un monto pequeño (ej. 2.50 CHF) para liberar un paquete.\n  - El enlace no lleva a post.ch sino a una web extraña.\n* **Qué hacer:**\n  - No hagas clic en el enlace.\n  - Verifica el número de envío en la web oficial de Swiss Post.\n  - Marca el correo como spam.', 'NCSC', 'HIGH', now() - interval '2 days'),
('Estafas de alquiler en Zúrich', 'Pisos falsos en Facebook Marketplace pidiendo depósito por adelantado.', 'Los estafadores copian fotos de Airbnb y las ponen a precios muy bajos.\n\n* **Señales de alerta:**\n  - El "dueño" dice que está en el extranjero y no puede mostrar el piso.\n  - Piden dinero por Western Union o transferencia antes de ver el lugar.\n  - Te presionan para decidir rápido.\n* **Consejo:** Nunca pagues nada sin ver el piso y firmar un contrato físico.', 'Police ZH', 'MEDIUM', now() - interval '5 days');


