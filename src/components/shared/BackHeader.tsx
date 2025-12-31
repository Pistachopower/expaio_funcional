import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderProps } from '../../types';
import { InfoButton } from '../ui/InfoButton';

export const BackHeader: React.FC<HeaderProps & { helpTitle?: string; helpText?: string }> = ({ title, showHelp = false, helpTitle, helpText, onBackOverride }) => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-[100] w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 p-4 pb-2">
            <div className="flex items-center justify-between w-full max-w-5xl mx-auto relative">
                {/* Left: Back Button */}
                <div className="w-10">
                    <button
                        onClick={onBackOverride || (() => navigate(-1))}
                        className="text-[#111815] dark:text-white flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors pointer-events-auto"
                        type="button"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                </div>

                {/* Center: Title */}
                <h2 className="text-[#111815] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display truncate px-4">
                    {title}
                </h2>

                {/* Right: Help Button Area */}
                <div className="w-10 flex justify-end items-center relative z-[110]">
                    {showHelp && helpTitle && helpText && (
                        <InfoButton title={helpTitle} text={helpText} />
                    )}
                </div>
            </div>
        </div>
    );
};
