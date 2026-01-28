import { GoogleGenerativeAI, ChatSession, GenerativeModel } from "@google/generative-ai";
import { Message } from '../types';

export class GeminiService {
  private chat: ChatSession | null = null;
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.initChat();
    } else {
      console.warn("Gemini API Key is missing. AI features will not work.");
    }
  }

  private initChat() {
    if (!this.genAI) return;

    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: `Eres el 'Asistente ExpaIO', un asistente amigable, empático y experto para personas que acaban de mudarse a Suiza. 
        Ayudas con temas como: vivienda (alquiler, depósitos, estafas), seguros (Lamal, franquicias), impuestos (Quellensteuer), leyes laborales e integración general.
        
        Directrices:
        - TUS RESPUESTAS DEBEN SER SIEMPRE EN ESPAÑOL.
        - Tus respuestas deben ser cortas, concisas y fáciles de leer.
        - Usa emojis para ser amigable.
        - Si no sabes algo, dilo claramente.
        - Mantén un tono positivo y alentador.
        
        Si te preguntan sobre estafas, sé muy cauteloso y aconseja revisar el Centro de Seguridad en la aplicación.
        Si te preguntan sobre números de emergencia, siempre proporciona: Policía 117, Ambulancia 144, Bomberos 118.`
    });

    this.chat = this.model.startChat({
      history: [],
    });
  }

  async sendMessageStream(message: string): Promise<AsyncIterable<string>> {
    if (!this.chat) {
      if (this.genAI) {
        this.initChat();
      } else {
        throw new Error("Gemini API Key is missing.");
      }
    }

    try {
      const result = await this.chat!.sendMessageStream(message);

      // Return an async generator that yields text chunks
      return (async function* () {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            yield chunkText;
          }
        }
      })();

    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async searchSafetyRisk(query: string): Promise<{ text: string; link?: string; linkLabel?: string }> {
    try {
      if (!this.genAI) {
        return { text: "Error de configuración: Falta la clave API." };
      }

      const prompt = `You are a safety assistant for newcomers to Switzerland. The user is searching for: "${query}".
      
      Analyze this query in the context of Swiss safety, scams, or daily life.
      1. Provide a very brief (max 2 sentences) warning, advice, or clarification about this topic.
      2. If it seems to be about Housing/Rent scams, link to '/offer-verifier'.
      3. If it seems to be about Health Insurance, link to '/insurance-guide'.
      4. If it seems to be about Taxes/Quellensteuer, link to '/tax-guide'.
      5. If it seems to be about Rent Contracts, link to '/rent-guide'.
      6. If it seems to be about Work/Labor rights, link to '/labor-guide'.
      
      Return a JSON object with:
      - text: string (the advice)
      - link: string (optional, the internal route)
      - linkLabel: string (optional, e.g. "Verificar Oferta", "Ver Guía")
      `;

      // Use a separate model instance for single generation if needed, or define schema
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
          responseMimeType: "application/json",
          // Note: responseSchema in the new SDK might require defined Schema objects, 
          // for simplicity we'll rely on JSON mime type and prompt instructions first, 
          // as strictly defining exact Schema object structure in TS without importing Schema type can be verbose.
          // However, "application/json" mode is usually robust enough for this structure.
        }
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      if (responseText) {
        return JSON.parse(responseText);
      }
      return { text: "No se encontraron resultados específicos. Intenta con otra consulta." };
    } catch (error) {
      console.error("Safety Search Error:", error);
      return { text: "Error al conectar con el asistente de seguridad. Por favor verifica tu conexión." };
    }
  }

  resetChat() {
    this.initChat();
  }
}

export const geminiService = new GeminiService();