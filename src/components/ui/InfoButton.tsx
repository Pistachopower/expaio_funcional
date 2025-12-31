import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export const InfoButton: React.FC<{ title: string; text: string }> = ({ title, text }) => {
    const [isOpen, setIsOpen] = useState(false);

    const Modal = (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
            {/* Backdrop with heavy blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-white dark:bg-[#0c1612] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-up border border-gray-100 dark:border-white/5 flex flex-col max-h-[90vh]">
                <div className="p-8 sm:p-10 overflow-y-auto no-scrollbar">
                    {/* Header with Icon */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="size-20 rounded-3xl bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-5xl">info</span>
                        </div>
                        <h4 className="text-2xl font-black tracking-tight text-[#111815] dark:text-white leading-tight">
                            {title}
                        </h4>
                    </div>

                    {/* Body Text */}
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium text-center mb-10">
                        {text}
                    </p>

                    {/* Action Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-5 bg-primary text-[#11211a] text-lg font-black rounded-3xl shadow-2xl shadow-primary/40 hover:brightness-110 active:scale-[0.98] transition-all transform uppercase tracking-wider"
                    >
                        Entendido
                    </button>
                </div>

                {/* Decorative secondary element */}
                <div className="h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50 w-full shrink-0"></div>
            </div>
        </div>
    );

    return (
        <div className="relative inline-block ml-1.5 align-middle">
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
                className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 active:scale-90 transition-all shadow-sm border border-primary/20 focus:outline-none group"
                title="Saber más"
            >
                <span className="material-symbols-outlined text-[24px] font-black group-hover:scale-110 transition-transform">question_mark</span>
            </button>

            {isOpen && createPortal(Modal, document.body)}
        </div>
    );
};
