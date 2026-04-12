import React, { useState, useRef, useEffect } from 'react';
import { BackHeader } from '../../../components';
import { geminiService } from '../../../lib/geminiService';
import { Message } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';

export const ChatScreen: React.FC = () => {
    const { user, profile } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [destinationCountry, setDestinationCountry] = useState('tu destino');
    const [originCountry, setOriginCountry] = useState('tu origen');
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initAssistant = async () => {
            setIsInitializing(true);
            let country = 'tu destino';
            let origin = 'tu origen';
            
            try {
                if (profile?.pais_destino_id) {
                    const { data } = await supabase
                        .from('paises')
                        .select('nombre')
                        .eq('id', profile.pais_destino_id)
                        .single();
                    if (data) country = data.nombre;
                }

                if (profile?.pais_origen_id) {
                    const { data } = await supabase
                        .from('paises')
                        .select('nombre')
                        .eq('id', profile.pais_origen_id)
                        .single();
                    if (data) origin = data.nombre;
                }

                setDestinationCountry(country);
                setOriginCountry(origin);
                geminiService.resetChat(country, origin);
                setMessages([
                    { role: 'model', text: `¡Hola! Soy tu asistente de ExpaIO. Como ciudadano de ${origin} mudándote a ${country}, ¿en qué puedo ayudarte hoy con tus trámites o dudas?` }
                ]);
            } catch (err) {
                console.error("Chat init error:", err);
            } finally {
                setIsInitializing(false);
            }
        };

        initAssistant();
    }, [profile?.pais_destino_id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
        }
    }, [input]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        const userMessage: Message = { role: 'user', text: userText };

        // 1. Add User Message
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        setIsLoading(true);

        // 2. Add "Thinking" Placeholder IMMEDIATELY
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        try {
            // 3. Start Stream
            const stream = await geminiService.sendMessageStream(userText);

            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                // 4. Update the last message (the placeholder) with accumulating text
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg) {
                        lastMsg.text = fullResponse;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            // Remove the empty placeholder if it failed completely, or show error
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg && lastMsg.text === '') {
                    lastMsg.text = 'Lo siento, hubo un error al conectar. Es posible que no te queden créditos. Por favor intenta de nuevo.';
                    lastMsg.isError = true;
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#E5DDD5] dark:bg-[#0b141a] animate-fade-in relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]"></div>

            <BackHeader title="Asistente IA" />

            {isInitializing ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-sm z-30">
                    <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <span className="material-symbols-outlined text-primary text-3xl">smart_toy</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sincronizando {originCountry} → {destinationCountry}...</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 pb-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-lg px-4 py-2 shadow-sm text-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white dark:bg-card-dark text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-800'
                                    } ${msg.isError ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : ''}`}
                            >
                                {msg.role === 'model' && msg.text === '' ? (
                                    <div className="flex items-center gap-2 h-6">
                                        <span className="text-xs text-gray-400 font-medium animate-pulse">Escribiendo</span>
                                        <span className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></span>
                                        </span>
                                    </div>
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}

            <div className="bg-background-light dark:bg-surface-dark p-2 pb-6 sm:pb-4 border-t border-gray-200 dark:border-gray-700 z-20">
                <div className="flex items-end gap-2 bg-white dark:bg-[#2a3942] rounded-3xl px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-600">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Escribe tu pregunta..."
                        className="flex-1 max-h-32 min-h-[24px] bg-transparent border-none focus:ring-0 resize-none py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 overflow-y-auto"
                        rows={1}
                        style={{ height: 'auto' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="mb-1 p-2 bg-primary rounded-full text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px] flex">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
