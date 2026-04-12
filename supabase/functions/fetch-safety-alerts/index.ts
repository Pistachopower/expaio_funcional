import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const geminiKey = Deno.env.get("GEMINI_API_KEY") || "AIzaSyDjytqzvpaAIUW_7eJsxHFkM171kIsPgGw";

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Accept optional ?country_code=DE&country_name=Alemania params
  const url = new URL(req.url);
  const countryCode = url.searchParams.get("country_code") || null;
  const countryName = url.searchParams.get("country_name") || "Suiza";

  try {
    // Resolve pais_id if a country code is provided
    let paisId: string | null = null;
    if (countryCode) {
      const { data: country } = await supabase
        .from("paises")
        .select("id")
        .eq("codigo", countryCode)
        .single();
      if (country) paisId = country.id;
    }

    const prompt = `
      Eres un experto en ciberseguridad en ${countryName}. Encuentra las 10 estafas (scams) más recientes o comunes en ${countryName}.
      
      IMPORTANTE: Para cada estafa, genera:
      1. Título corto.
      2. Descripción breve (1 frase).
      3. Detalles extensos (instrucciones paso a paso sobre cómo evitarla o qué hacer si has caído).
      4. Fuente oficial (autoridades locales, policía, o agencias de ciberseguridad de ${countryName}) de donde proviene la información.
      
      Devuelve EXCLUSIVAMENTE un array JSON válido, sin ningún texto adicional:
      [
        {
          "titulo": "Título corto",
          "descripcion": "Breve descripción en 1 frase",
          "detalles": "Detalles extensos con pasos claros sobre cómo evitar la estafa",
          "fuente": "Fuente oficial (ej: Policía de ${countryName}, BSI Alemania, etc.)",
          "prioridad": "HIGH",
          "imagen_url": "https://picsum.photos/seed/scam_${countryName.toLowerCase()}_[NUMERO]/600/300"
        }
      ]
    `;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 }
      })
    });

    if (!response.ok) throw new Error(`Gemini Error: ${response.status} - ${await response.text()}`);

    const result = await response.json();
    const rawText = result.candidates[0].content.parts[0].text.trim();
    const jsonStr = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const scams = JSON.parse(jsonStr);

    // Add pais_id to each alert
    const alertsToInsert = scams.map((s: any) => ({
      ...s,
      pais_id: paisId
    }));

    // Delete old alerts for this country only (not global ones from other countries)
    const deleteQuery = supabase.from("alertas");
    if (paisId) {
      await deleteQuery.delete().eq("pais_id", paisId);
    } else {
      await deleteQuery.delete().is("pais_id", null);
    }

    // Insert fresh alerts
    const { error: insertError } = await supabase.from("alertas").insert(alertsToInsert);
    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, country: countryName, count: alertsToInsert.length }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
