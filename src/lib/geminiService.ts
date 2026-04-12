import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export class GeminiService {
    private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    private chatSession: ChatSession | null = null;
    private currentTarget: string = '';
    private currentOrigin: string = '';

    initChat(targetCountry: string, originCountry: string = 'desconocido') {
        this.currentTarget = targetCountry;
        this.currentOrigin = originCountry;

        this.chatSession = this.model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });
    }

    resetChat(targetCountry: string, originCountry: string = 'desconocido') {
        this.initChat(targetCountry, originCountry);
    }

    async *sendMessageStream(message: string): AsyncGenerator<string> {
        if (!this.chatSession) {
            this.initChat('tu destino', 'tu origen');
        }

        try {
            // Inyectamos el contexto en el prompt para asegurar que Gemini mantenga el rol binacional
            const contextualPrompt = `[Contexto: Usuario de ${this.currentOrigin} mudándose a ${this.currentTarget}]. 
            Responde como experto en migración considerando convenios y visas específicas para esta nacionalidad.
            Consulta del usuario: ${message}`;

            const result = await this.chatSession!.sendMessageStream(contextualPrompt);
            for await (const chunk of result.stream) {
                yield chunk.text();
            }
        } catch (error) {
            console.error('Gemini Stream Error:', error);
            throw error;
        }
    }

    async searchSafetyRisk(category: string, country: string = 'tu destino'): Promise<string> {
        const prompt = `Como experto en seguridad migratoria, dime los 3 riesgos o estafas más comunes relacionados con "${category}" en ${country} para un recién llegado. Sé directo y preventivo.`;
        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            return "No se pudo obtener información de seguridad en este momento.";
        }
    }
}

export const geminiService = new GeminiService();