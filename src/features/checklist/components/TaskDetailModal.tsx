import React from 'react';
import { Task } from '../types';

interface TaskDetailModalProps {
    task: Task;
    onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
    return (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-white dark:bg-surface-dark w-full sm:max-w-md h-[85%] sm:h-auto sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-surface-light dark:bg-[#1a2e26]">
                    <div>
                        <h2 className="text-xl font-bold text-[#111815] dark:text-white leading-tight mb-1">{task.title}</h2>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${task.completed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {task.completed ? 'Completada' : 'Pendiente'}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">close</span>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {task.description}
                    </p>

                    {task.details ? (
                        <>
                            {task.details.requirements && (
                                <div>
                                    <h3 className="text-sm font-bold text-[#111815] dark:text-white flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-primary text-[18px]">assignment</span>
                                        Requisitos
                                    </h3>
                                    <ul className="space-y-2">
                                        {task.details.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="size-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0"></span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {task.details.options && (
                                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl">
                                    <h3 className="text-sm font-bold text-[#111815] dark:text-white flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-blue-500 text-[18px]">store</span>
                                        Opciones Recomendadas
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {task.details.options.map((opt, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {task.details.costs && (
                                <div>
                                    <h3 className="text-sm font-bold text-[#111815] dark:text-white flex items-center gap-2 mb-2">
                                        <span className="material-symbols-outlined text-green-500 text-[18px]">payments</span>
                                        Costos Estimados
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        {task.details.costs}
                                    </p>
                                </div>
                            )}

                            {task.details.tips && (
                                <div className="flex gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                                    <span className="material-symbols-outlined text-primary shrink-0">lightbulb</span>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                        <span className="font-bold text-primary block mb-0.5">Tip Pro:</span>
                                        {task.details.tips}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-gray-400 italic text-center py-4">No hay detalles adicionales para esta tarea.</p>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-[#11211a] font-bold py-3 rounded-xl hover:brightness-105 active:scale-95 transition-all shadow-sm"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};
