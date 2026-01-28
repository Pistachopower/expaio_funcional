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
CREATE POLICY "Enable read access for all users" ON community_reports
    FOR SELECT TO anon USING (true);
    
-- Create policy to allow reading by authenticated users
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
