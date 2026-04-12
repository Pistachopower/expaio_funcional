import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Task, TaskPhase } from '../types';

export const useChecklist = (user: any) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadChecklistData = async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            // 1. Obtener perfil para saber el país de destino
            const { data: profile } = await supabase
                .from('perfiles')
                .select('pais_destino_id')
                .eq('id', user.id)
                .single();

            const destId = profile?.pais_destino_id;

            // 2. Cargar Tareas Sugeridas (Específicas + Genéricas)
            const { data: suggestedData } = await supabase
                .from('tareas_sugeridas')
                .select('*, paises(nombre)')
                .or(destId ? `pais_id.eq.${destId},pais_id.is.null` : 'pais_id.is.null');

            // 3. Cargar Progreso del Usuario
            const { data: userData } = await supabase
                .from('usuario_checklists')
                .select('*')
                .eq('usuario_id', user.id);

            const dbProgress = userData || [];

            // 4. Mapear Tareas Sugeridas
            const mappedSuggested: Task[] = (suggestedData || []).map(t => {
                const userProgress = dbProgress.find(p => p.item_id === t.id);
                return {
                    id: t.id,
                    title: t.titulo,
                    description: t.descripcion || '',
                    phase: t.fase as TaskPhase,
                    completed: userProgress?.completado || false,
                    isSystem: true,
                    details: t.detalles_json,
                    countryName: (t.paises as any)?.nombre || 'General'
                };
            });

            // 5. Cargar Tareas Personalizadas (c:...) y Tareas Huérfanas
            const suggestedIds = new Set(mappedSuggested.map(t => t.id));
            const orphanedItems = dbProgress.filter(p => !suggestedIds.has(p.item_id));

            const customAndHistoricTasks: Task[] = orphanedItems.map(p => {
                if (p.item_id.startsWith('c:')) {
                    const parts = p.item_id.split(':');
                    const rawPhase = parts[2];
                    const phase: TaskPhase = (rawPhase === 'llegada' || rawPhase === 'planificacion') 
                        ? rawPhase 
                        : 'planificacion';

                    return {
                        id: p.item_id,
                        title: parts.slice(3).join(':') || 'Tarea sin título',
                        description: 'Tarea personalizada',
                        phase: phase,
                        completed: p.completado,
                        isSystem: false
                    };
                } else {
                    return {
                        id: p.item_id,
                        title: 'Tarea de destino anterior',
                        description: 'Guardada de tu configuración previa.',
                        phase: 'planificacion' as TaskPhase,
                        completed: p.completado,
                        isSystem: true,
                        countryName: 'Historial'
                    };
                }
            });

            setTasks([...mappedSuggested, ...customAndHistoricTasks]);
        } catch (error) {
            console.error('Error loading checklist data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadChecklistData();
    }, [user]);

    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('expaio_checklist_v3', JSON.stringify(tasks));
        }
    }, [tasks]);

    const toggleTask = async (id: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newStatus } : t));

        if (user) {
            const { error } = await supabase
                .from('usuario_checklists')
                .upsert({
                    usuario_id: user.id,
                    item_id: id,
                    completado: newStatus
                }, { onConflict: 'usuario_id, item_id' });

            if (error) {
                console.error('Error saving checklist item:', error);
                setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
            }
        }
    };

    const deleteTask = async (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));

        if (user) {
            const { error } = await supabase
                .from('usuario_checklists')
                .delete()
                .eq('usuario_id', user.id)
                .eq('item_id', id);

            if (error) console.error('Error deleting task from Supabase:', error);
        }
    };

    const addTask = async (title: string, phase: TaskPhase) => {
        if (!title.trim()) return;

        const timestamp = Date.now();
        const itemId = `c:${timestamp}:${phase}:${title.trim()}`;

        const newTask: Task = {
            id: itemId,
            title: title.trim(),
            description: 'Tarea personalizada',
            phase: phase,
            completed: false,
            isSystem: false
        };

        setTasks(prev => [newTask, ...prev]);

        if (user) {
            const { error } = await supabase.from('usuario_checklists').insert({
                usuario_id: user.id,
                item_id: itemId,
                completado: false
            });

            if (error) console.error('Error saving custom task to Supabase:', error);
        }
    };

    const restoreDefaultTasks = async () => {
        await loadChecklistData();
    };

    return {
        tasks,
        isLoading,
        toggleTask,
        deleteTask,
        addTask,
        restoreDefaultTasks
    };
};
