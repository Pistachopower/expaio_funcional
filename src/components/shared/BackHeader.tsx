import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderProps } from '../../types';
import { InfoButton } from '../ui/InfoButton';

export const BackHeader: React.FC<HeaderProps & { helpTitle?: string; helpText?: string }> = ({ title, showHelp = false, helpTitle, helpText, onBackOverride }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between sticky top-0 z-20 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center w-full max-w-5xl mx-auto">
                <button onClick={onBackOverride || (() => navigate(-1))} className="text-[#111815] dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-[#111815] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display pr-10 truncate">{title}</h2>
                {showHelp && helpTitle && helpText && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <InfoButton title={helpTitle} text={helpText} />
                    </div>
                )}
            </div>
        </div>
    );
};
