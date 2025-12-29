import React, { useState } from 'react';
import { BackHeader } from '../../../components';

export const HousingVerificationScreen: React.FC = () => {
    const [showModal, setShowModal] = useState(true);

    return (
        <div className="relative flex h-full w-full flex-col overflow-x-hidden bg-white dark:bg-[#11211a] animate-fade-in max-w-2xl mx-auto">
            <BackHeader title="Verification Report" />

            <div className="flex-1 flex flex-col gap-6 p-4 pb-24 overflow-y-auto">
                <div className="flex flex-col items-center justify-center py-6 relative">
                    <div className="relative size-40 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-[12px] border-gray-100 dark:border-white/10"></div>
                        <div className="absolute inset-0 rounded-full border-[12px] border-danger border-r-transparent border-b-transparent border-l-transparent -rotate-45"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-[#111815] dark:text-white">32</span>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Trust Score</span>
                        </div>
                    </div>
                    <div className="mt-4 px-4 py-1.5 rounded-full bg-danger/10 border border-danger/20 text-danger text-sm font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">gpp_bad</span>
                        High Risk Detected
                    </div>
                </div>

                <div className="rounded-xl bg-background-light dark:bg-white/5 p-5 border border-dashed border-warning relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-warning text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">ANOMALY</div>
                    <div className="flex gap-3 mb-4">
                        <div className="size-10 rounded-full bg-warning/20 flex items-center justify-center text-warning shrink-0">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <div>
                            <p className="text-[#111815] dark:text-white font-bold text-sm">"Miraculous" Size/Price Ratio</p>
                            <p className="text-gray-500 text-xs">This offer is statistically improbable.</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-medium text-gray-500">
                                <span>Price (CHF)</span>
                                <span>Matched</span>
                            </div>
                            <div className="flex h-2 w-full gap-1">
                                <div className="h-full bg-gray-300 dark:bg-white/20 w-1/2 rounded-l"></div>
                                <div className="h-full bg-primary w-1/2 rounded-r"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start gap-4 rounded-xl bg-white dark:bg-white/5 p-4 shadow-sm border border-gray-100 dark:border-white/5">
                        <div className="size-10 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
                            <span className="material-symbols-outlined">call</span>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-[#111815] dark:text-white text-sm font-bold leading-tight">Foreign Phone Number</p>
                                <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded">RISK</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs font-normal leading-relaxed">
                                Listing uses a <strong>+44 (UK)</strong> prefix. Local Geneva listings typically use +41.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#11211a]/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#1e2b25] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-danger/30">
                        <div className="bg-danger/10 p-6 flex flex-col items-center text-center border-b border-danger/10">
                            <div className="size-16 rounded-full bg-white dark:bg-[#1e2b25] flex items-center justify-center mb-4 shadow-sm">
                                <span className="material-symbols-outlined text-danger text-4xl">warning</span>
                            </div>
                            <h3 className="text-xl font-bold text-[#111815] dark:text-white mb-2">Miraculous Offer Alert</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                This apartment is <span className="font-bold text-danger">2x larger</span> than average for this price. In Switzerland, this is the #1 indicator of advance-fee fraud.
                            </p>
                        </div>
                        <div className="p-6 pt-4 flex flex-col gap-4">
                            <button onClick={() => setShowModal(false)} className="w-full py-3.5 rounded-xl bg-danger hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-danger/25 transition-all active:scale-[0.98]">
                                Acknowledge Risk & View Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
