import React from 'react';
import { BackHeader } from '../../../components';

export const TransportGuideScreen: React.FC = () => {
    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in pb-24 w-full max-w-5xl mx-auto">
            <BackHeader title="Vuelos a Suiza" />

            <div className="p-4 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-[#111815] dark:text-white mb-2">Conexiones desde España</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Suiza está muy bien conectada. Los aeropuertos principales son Zúrich (ZRH), Ginebra (GVA) y Basilea (BSL).
                    </p>
                </section>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 items-center">
                        <div className="size-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold tracking-tighter shrink-0">
                            SWISS
                        </div>
                        <div>
                            <h3 className="font-bold text-[#111815] dark:text-white">Swiss International</h3>
                            <p className="text-xs text-gray-500 mt-1">La aerolínea nacional. Incluye agua y chocolate 🍫. Vuela desde Madrid, Barcelona, Málaga, Palma, Valencia...</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 items-center">
                        <div className="size-12 bg-yellow-400 rounded-lg flex items-center justify-center text-red-700 font-bold tracking-tighter shrink-0">
                            IB
                        </div>
                        <div>
                            <h3 className="font-bold text-[#111815] dark:text-white">Iberia</h3>
                            <p className="text-xs text-gray-500 mt-1">Fuerte conexión Madrid-Ginebra y Madrid-Zúrich. Buena opción si conectas desde otras ciudades españolas.</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 items-center">
                        <div className="size-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold tracking-tighter shrink-0">
                            easyJet
                        </div>
                        <div>
                            <h3 className="font-bold text-[#111815] dark:text-white">EasyJet</h3>
                            <p className="text-xs text-gray-500 mt-1">El rey del bajo coste en Suiza. Hubs enormes en Ginebra y Basilea. Vuelos directos desde muchas ciudades españolas (Alicante, Santiago, Sevilla...).</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 items-center">
                        <div className="size-12 bg-yellow-300 rounded-lg flex items-center justify-center text-gray-800 font-bold tracking-tighter shrink-0">
                            VY
                        </div>
                        <div>
                            <h3 className="font-bold text-[#111815] dark:text-white">Vueling</h3>
                            <p className="text-xs text-gray-500 mt-1">Principalmente desde Barcelona a Zúrich, Ginebra y Basilea.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mt-4">
                    <h3 className="font-bold text-primary mb-1 text-sm">Tip de Ahorro: Basilea (Mulhouse)</h3>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        El aeropuerto de Basilea (EuroAirport) está técnicamente en Francia. A veces es mucho más barato volar allí y coger el tren a Zúrich o Berna (aprox 1h).
                    </p>
                </div>
            </div>
        </div>
    );
};
