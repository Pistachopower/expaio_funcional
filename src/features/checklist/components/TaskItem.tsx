import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string, currentStatus: boolean) => void;
    onDelete: (id: string) => void;
    onSelect: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onSelect }) => {
    return (
        <div
            className={`group relative flex flex-col p-4 rounded-xl shadow-sm border transition-all duration-200 ${task.completed
                ? 'bg-[#f0fdf4] dark:bg-[#1a2e26]/50 border-primary/30 opacity-80'
                : 'bg-white dark:bg-[#1a2e26] border-transparent hover:border-primary/20'
                }`}
        >
            <div className="flex items-start gap-4">
                <div className="pt-0.5" onClick={() => onToggle(task.id, task.completed)}>
                    <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors ${task.completed
                        ? 'bg-primary border-primary'
                        : 'border-[#dce5e1] dark:border-gray-600 bg-transparent'
                        }`}>
                        {task.completed && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-1 w-full gap-2">
                        <h3
                            onClick={() => onSelect(task)}
                            className={`text-base font-bold cursor-pointer transition-all hover:text-primary ${task.completed ? 'text-gray-500 dark:text-gray-400 line-through decoration-2' : 'text-[#111815] dark:text-white'
                                }`}>
                            {task.title}
                        </h3>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors p-1 -mr-2 -mt-1"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    </div>

                    <p onClick={() => onSelect(task)} className={`text-sm leading-normal mb-3 cursor-pointer ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-[#638878] dark:text-[#9ab0a6]'}`}>
                        {task.description}
                    </p>

                    <div className="flex gap-2">
                        {task.details && (
                            <button
                                onClick={() => onSelect(task)}
                                className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20 transition-colors"
                            >
                                Ver Detalles
                            </button>
                        )}
                        {task.link && (
                            <Link to={task.link} className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1">
                                Guía
                                <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
