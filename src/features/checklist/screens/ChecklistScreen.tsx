import React, { useState } from 'react';
import { BackHeader } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { Task, TaskPhase } from '../types';
import { useChecklist } from '../hooks/useChecklist';
import { TaskItem } from '../components/TaskItem';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { DEFAULT_TASKS } from '../constants';

export const ChecklistScreen: React.FC = () => {
    const { user } = useAuth();
    const { tasks, toggleTask, deleteTask, addTask, restoreDefaultTasks } = useChecklist(user);

    const [activePhase, setActivePhase] = useState<TaskPhase>('planificacion');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const visibleTasks = tasks.filter(t => t.phase === activePhase);
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        addTask(newTaskTitle, activePhase);
        setNewTaskTitle('');
    };

    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark animate-fade-in w-full">
            <BackHeader
                title="Checklist"
                showHelp={true}
                helpTitle="Tu Hoja de Ruta"
                helpText="Aquí encontrarás todos los pasos que debes dar antes y después de llegar a Suiza. Las tareas del sistema te guían en lo básico, y puedes añadir tus propias tareas personalizadas."
            />
            <main className="flex-1 flex flex-col p-4 w-full max-w-3xl mx-auto">

                {/* Global Progress */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex gap-6 justify-between items-end">
                        <p className="text-[#111815] dark:text-white text-base font-bold leading-normal">Progreso Total</p>
                        <p className="text-[#638878] dark:text-[#8baaa0] text-sm font-medium leading-normal">{progress}% ({completedCount}/{totalCount})</p>
                    </div>
                    <div className="rounded-full bg-[#dce5e1] dark:bg-gray-700 h-2.5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(25,230,145,0.4)] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Phase Tabs */}
                <div className="flex p-1 bg-gray-100 dark:bg-card-dark rounded-xl mb-6 border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActivePhase('planificacion')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activePhase === 'planificacion'
                            ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        Planificación
                    </button>
                    <button
                        onClick={() => setActivePhase('llegada')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activePhase === 'llegada'
                            ? 'bg-white dark:bg-surface-dark text-primary shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        Llegada a Suiza
                    </button>
                </div>

                {/* Header for Phase */}
                <div className="mb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-[#111815] dark:text-white tracking-tight text-2xl font-bold leading-tight text-left mb-1 capitalize">
                            Fase de {activePhase}
                        </h1>
                        <p className="text-[#638878] dark:text-[#9ab0a6] text-sm font-normal leading-relaxed">
                            {activePhase === 'planificacion'
                                ? 'Tareas esenciales antes de subir al avión.'
                                : 'Trámites burocráticos una vez pises suelo suizo.'}
                        </p>
                    </div>
                    {tasks.length < DEFAULT_TASKS.length && (
                        <button
                            onClick={restoreDefaultTasks}
                            className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-2 rounded-lg hover:text-primary transition-colors flex items-center gap-1.5"
                            title="Restaurar tareas sugeridas"
                        >
                            <span className="material-symbols-outlined text-[18px]">rebound</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Restaurar</span>
                        </button>
                    )}
                </div>

                {/* Add New Task Input */}
                <div className="flex gap-2 mb-6">
                    <div className="flex-1 flex items-center bg-white dark:bg-[#1a2e26] rounded-xl px-4 shadow-sm border border-transparent focus-within:border-primary transition-colors">
                        <span className="material-symbols-outlined text-gray-400">add_task</span>
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            placeholder={`Añadir a ${activePhase}...`}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 text-[#111815] dark:text-white placeholder:text-gray-400"
                        />
                    </div>
                    <button
                        onClick={handleAddTask}
                        disabled={!newTaskTitle.trim()}
                        className="bg-primary disabled:opacity-50 text-[#11211a] font-bold rounded-xl px-4 flex items-center justify-center shadow-sm hover:brightness-105 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>

                {/* Task List */}
                <div className="flex flex-col gap-4">
                    {visibleTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            onSelect={setSelectedTask}
                        />
                    ))}

                    {visibleTasks.length === 0 && (
                        <div className="text-center py-10 opacity-50">
                            <span className="material-symbols-outlined text-4xl mb-2 text-gray-400">task_alt</span>
                            <p className="text-gray-500">No hay tareas en esta fase.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
};
