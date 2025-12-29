import React, { useState } from 'react';

export const InfoButton: React.FC<{ title: string; text: string }> = ({ title, text }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block ml-1.5 align-middle">
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
                className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors shadow-sm"
            >
                <span className="material-symbols-outlined text-[14px] font-bold">question_mark</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-4 bg-white dark:bg-[#1a2e26] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-[70] animate-slide-up">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <span className="material-symbols-outlined text-[18px]">info</span>
                            <h4 className="font-bold text-sm tracking-tight">{title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            {text}
                        </p>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-0.5 border-x-[8px] border-x-transparent border-t-[8px] border-t-white dark:border-t-[#1a2e26]"></div>
                    </div>
                </>
            )}
        </div>
    );
};
