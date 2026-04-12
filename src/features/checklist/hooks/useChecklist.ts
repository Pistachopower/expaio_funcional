import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Task, TaskPhase } from '../types';
import { DEFAULT_TASKS } from '../constants';

export const useChecklist = (user: any) => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('swisslife_checklist_v2');
        return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    });

    useEffect(() => {
        if (!user) return;

        const loadChecklist = async () => {
            const { data, error } = await supabase
                .from('usuario_checklists')
                .select('item_id, completado');

            if (error) {
                console.error('Error loading checklist:', error);
                return;
            }

            if (data && data.length > 0) {
                const systemTasks = DEFAULT_TASKS.map(task => {
                    const dbItem = data.find(d => d.item_id === task.id);
                    return dbItem ? { ...task, completed: dbItem.completado } : task;
                });

                const customTasks: Task[] = data
                    .filter(d => d.item_id.startsWith('c:'))
                    .map((d): Task | null => {
                        try {
                            const parts = d.item_id.split(':');
                            if (parts.length < 4) return null;
                            return {
                                id: d.item_id,
                                title: parts.slice(3).join(':'),
                                description: 'Tarea personalizada',
                                phase: parts[2] as TaskPhase,
                                completed: d.completado,
                                isSystem: false
                            };
                        } catch (e) {
                            return null;
                        }
                    })
                    .filter((t): t is Task => t !== null);

                setTasks([...systemTasks, ...customTasks]);
            }
        };

        loadChecklist();
    }, [user]);

    useEffect(() => {
        localStorage.setItem('swisslife_checklist_v2', JSON.stringify(tasks));
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
        const currentTaskIds = new Set(tasks.map(t => t.id));
        const missingDefaults = DEFAULT_TASKS.filter(t => !currentTaskIds.has(t.id));

        if (missingDefaults.length === 0) return;

        setTasks(prev => [...prev, ...missingDefaults]);

        if (user) {
            const updates = missingDefaults.map(task => ({
                usuario_id: user.id,
                item_id: task.id,
                completado: false
            }));

            const { error } = await supabase
                .from('usuario_checklists')
                .upsert(updates, { onConflict: 'usuario_id, item_id' });

            if (error) console.error('Error restoring default tasks to Supabase:', error);
        }
    };

    return {
        tasks,
        toggleTask,
        deleteTask,
        addTask,
        restoreDefaultTasks
    };
};
