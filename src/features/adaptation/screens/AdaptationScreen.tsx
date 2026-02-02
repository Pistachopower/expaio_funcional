// import React, { useState } from 'react';
// import { MentalSuitcase } from '../components/MentalSuitcase';
// import { SwissCode } from '../components/SwissCode';

// type Tab = 'mental' | 'code';

// export const AdaptationScreen: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<Tab>('mental');

//     return (
//         <div className="flex flex-col w-full h-full bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in">
//             {/* Header */}
//             <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
//                 <div className="w-full max-w-5xl mx-auto px-4 py-4">
//                     <div className="flex items-center gap-3 mb-4">
//                         <div className="flex items-center justify-center size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
//                             <span className="material-symbols-outlined" style={{ fontSize: 24 }}>sentiment_satisfied</span>
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold text-[#111815] dark:text-white">Adaptación</h1>
//                             <p className="text-sm text-[#638878] dark:text-gray-400">Tu guía emocional y cultural en Suiza.</p>
//                         </div>
//                     </div>

//                     {/* Tabs */}
//                     <div className="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
//                         <button
//                             onClick={() => setActiveTab('mental')}
//                             className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'mental'
//                                     ? 'bg-white dark:bg-card-dark text-purple-600 dark:text-purple-400 shadow-sm'
//                                     : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
//                                 }`}
//                         >
//                             <span className="material-symbols-outlined" style={{ fontSize: 20 }}>psychology</span>
//                             La Maleta Mental
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('code')}
//                             className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'code'
//                                     ? 'bg-white dark:bg-card-dark text-red-600 dark:text-red-400 shadow-sm'
//                                     : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
//                                 }`}
//                         >
//                             <span className="material-symbols-outlined" style={{ fontSize: 20 }}>flag</span>
//                             El Código Suizo
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Content */}
//             <div className="w-full max-w-5xl mx-auto px-4 py-6 pb-24">
//                 {activeTab === 'mental' ? <MentalSuitcase /> : <SwissCode />}
//             </div>
//         </div>
//     );
// };
