
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. Initialize Clients
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''; // MUY IMPORTANTE: Usar Service Role para escribir
        const geminiKey = Deno.env.get('GEMINI_API_KEY') ?? '';

        if (!supabaseUrl || !supabaseKey || !geminiKey) {
            throw new Error('Variables de entorno faltantes (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY)');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 2. Fetch News from Google News RSS (Fuente pública y legal)
        // Buscamos estafas relacionadas con Suiza, bancos, correos, etc.
        const rssUrl = 'https://news.google.com/rss/search?q=switzerland+scam+alert+OR+estafa+suiza+cybercrime&hl=en-US&gl=US&ceid=US:en';
        const rssResponse = await fetch(rssUrl);
        const rssText = await rssResponse.text();

        // Parse simple del RSS para sacar títulos y snippets (sin librerías pesadas)
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(rssText)) !== null) {
            const itemContent = match[1];
            const titleMatch = /<title>(.*?)<\/title>/.exec(itemContent);
            const linkMatch = /<link>(.*?)<\/link>/.exec(itemContent);
            const invalidXmlChars = /<!\[CDATA\[|\]\]>/g;

            if (titleMatch && linkMatch) {
                items.push({
                    title: titleMatch[1].replace(invalidXmlChars, ''),
                    link: linkMatch[1],
                });
            }
            if (items.length >= 10) break; // Limitamos a 10 noticias para no saturar
        }

        if (items.length === 0) {
            return new Response(JSON.stringify({ message: 'No se encontraron noticias nuevas' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // 3. Process with Gemini
        const itemString = JSON.stringify(items);

        const prompt = `
    Actúa como un analista de ciberseguridad experto en Suiza. Analiza las siguientes noticias recientes sobre estafas (formato JSON):
    ${itemString}

    Tu tarea es:
    1. Identificar si ALGUNA de estas noticias es una estafa relevante y peligrosa para expatriados/inmigrantes en Suiza HOY.
    2. Si encuentras una relevante, extrae la información y crea una alerta. Si hay varias, elige la más crítica. Si no hay ninguna relevante, devuelve null.
    3. El formato de salida debe ser UN SOLO objeto JSON (sin markdown) con esta estructura:
    {
      "title": "Título corto y alarmante en Español (ej: 'Nuevo Phishing de UBS')",
      "description": "Descripción breve de 2 líneas explicando el fraude.",
      "details": "Lista detallada con bullet points de cómo identificarlo y prevenirlo. Usa saltos de línea \\n.",
      "source": "Nombre abreviado de la fuente (ej: 'NCSC' o 'Google News')",
      "priority": "HIGH" o "CRITICAL" o "MEDIUM",
      "link": "El enlace original de la noticia",
      "image_query": "Un término de búsqueda en inglés para buscar una imagen de stock (ej: 'hacker computer' o 'swiss post logo')"
    }
    
    IMPORTANTE: Solo devuelve JSON válido. Si no hay nada relevante, devuelve { "relevant": false }.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Limpieza básica de JSON (por si Gemini añade backticks)
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const alertData = JSON.parse(jsonStr);

        if (!alertData.title) {
            return new Response(JSON.stringify({ message: 'No se detectaron alertas relevantes hoy.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // 4. Check if alert already exists (simple deduplication by title similarity could be better, but exact match for now)
        const { data: existing } = await supabase
            .from('safety_alerts')
            .select('id')
            .eq('title', alertData.title)
            .single();

        if (existing) {
            return new Response(JSON.stringify({ message: 'La alerta ya existe.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // 5. Insert into Supabase
        // Nota: image_url lo dejamos vacío o usamos una por defecto en el frontend si no tenemos un servicio de búsqueda de imágenes aquí.
        // El frontend ya tiene lógica para fallback de imágenes.

        const { error } = await supabase.from('safety_alerts').insert({
            title: alertData.title,
            description: alertData.description,
            details: alertData.details,
            source: alertData.source,
            priority: alertData.priority,
            link: alertData.link,
            // image_url: ... (opcional, requeriría otra API)
        });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, alert: alertData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
