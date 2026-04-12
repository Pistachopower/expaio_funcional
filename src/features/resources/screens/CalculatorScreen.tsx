import React, { useState, useEffect } from 'react';
import { BackHeader } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';

export const CalculatorScreen: React.FC = () => {
    const { profile } = useAuth();
    
    // Country & Currency State
    const [destCountry, setDestCountry] = useState({ nombre: 'Suiza', moneda: 'CHF', simbolo: 'CHF' });
    const [originCurrency, setOriginCurrency] = useState('EUR');
    const [originSymbol, setOriginSymbol] = useState('€');
    const [exchangeRate, setExchangeRate] = useState(0.94); // Default EUR/CHF
    const [isLoading, setIsLoading] = useState(true);

    // Inputs Principales
    const [budgetOrigin, setBudgetOrigin] = useState(5000);
    const [months, setMonths] = useState(3);
    const [flightOrigin, setFlightOrigin] = useState(250);

    useEffect(() => {
        const fetchData = async () => {
            if (profile) {
                // Fetch Destination Info
                if (profile.pais_destino_id) {
                    const { data: dest } = await supabase
                        .from('paises')
                        .select('nombre, moneda, simbolo_moneda')
                        .eq('id', profile.pais_destino_id)
                        .single();
                    if (dest) {
                        setDestCountry({
                            nombre: dest.nombre,
                            moneda: dest.moneda,
                            simbolo: dest.simbolo_moneda
                        });
                    }
                }

                // Fetch Origin Info
                if (profile.pais_origen_id) {
                    const { data: origin } = await supabase
                        .from('paises')
                        .select('moneda, simbolo_moneda')
                        .eq('id', profile.pais_origen_id)
                        .single();
                    if (origin) {
                        setOriginCurrency(origin.moneda);
                        setOriginSymbol(origin.simbolo_moneda);
                    }
                }
                setIsLoading(false);
            }
        };
        fetchData();
    }, [profile]);

    // Simple exchange rate effect (mock for now, could be API)
    useEffect(() => {
        if (originCurrency === destCountry.moneda) {
            setExchangeRate(1);
        } else if (originCurrency === 'EUR' && destCountry.moneda === 'CHF') {
            setExchangeRate(0.94);
        } else if (originCurrency === 'EUR' && destCountry.moneda === 'USD') {
            setExchangeRate(1.08);
        } else {
            setExchangeRate(1); // Fallback
        }
    }, [originCurrency, destCountry.moneda]);

    // Lista de Gastos (Básicos + Personalizados)
    interface ExpenseItem {
        id: string;
        name: string;
        amount: number;
        isBasic: boolean;
    }

    const [expenses, setExpenses] = useState<ExpenseItem[]>([
        { id: '1', name: 'Alquiler', amount: 1200, isBasic: true },
        { id: '2', name: 'Seguro Salud', amount: 350, isBasic: true },
        { id: '3', name: 'Transporte', amount: 80, isBasic: true },
        { id: '4', name: 'Comida/Otros', amount: 450, isBasic: true },
    ]);

    const [newExpenseName, setNewExpenseName] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // State for delete confirmation modal
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

    // Calculations
    const budgetInDest = Math.round(budgetOrigin * exchangeRate);

    // Total Mensual Recurrente
    const monthlyTotalDest = expenses.reduce((acc, item) => acc + item.amount, 0);

    // Costos Únicos
    const oneTimeCostsDest = Math.round(flightOrigin * exchangeRate);

    // Gran Total Requerido
    const totalRequiredDest = oneTimeCostsDest + (monthlyTotalDest * months);

    const balance = budgetInDest - totalRequiredDest;
    const isViable = balance >= 0;
    const percentCovered = Math.min(100, Math.max(0, (budgetInDest / totalRequiredDest) * 100));

    // Handlers
    const updateExpense = (id: string, amount: number) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, amount } : e));
    };

    const promptDelete = (id: string) => {
        setExpenseToDelete(id);
    };

    const confirmDelete = () => {
        if (expenseToDelete) {
            setExpenses(prev => prev.filter(e => e.id !== expenseToDelete));
            setExpenseToDelete(null);
        }
    };

    const addExpense = () => {
        if (newExpenseName && newExpenseAmount) {
            setExpenses(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    name: newExpenseName,
                    amount: parseFloat(newExpenseAmount) || 0,
                    isBasic: false
                }
            ]);
            setNewExpenseName('');
            setNewExpenseAmount('');
            setIsAdding(false);
        }
    };

    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in pb-24 w-full max-w-5xl mx-auto">
            <BackHeader
                title="Viabilidad de Mudanza"
                showHelp={true}
                helpTitle="¿Cómo funciona?"
                helpText={`Esta calculadora estima si tus ahorros son suficientes para vivir en ${destCountry.nombre} sin ingresos durante el tiempo que elijas. Incluye el tipo de cambio actual y los gastos básicos estimados.`}
            />

            {/* Header Result Card */}
            <div className="px-4 pb-4">
                <div className={`rounded-xl p-5 shadow-sm border transition-colors ${isViable ? 'bg-primary/10 border-primary/20' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">
                                {isViable ? 'Plan Viable' : 'Presupuesto Ajustado'}
                            </p>
                            <h1 className={`text-3xl font-bold tracking-tight ${isViable ? 'text-[#11211a] dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                                {isViable ? '¡Estás listo!' : 'Te falta capital'}
                            </h1>
                        </div>
                        <div className={`flex items-center justify-center size-10 rounded-full ${isViable ? 'bg-primary text-white' : 'bg-red-500 text-white'}`}>
                            <span className="material-symbols-outlined text-2xl">{isViable ? 'check' : 'priority_high'}</span>
                        </div>
                    </div>

                    <p className="text-sm opacity-80 mb-4">
                        {isViable
                            ? `Tienes un colchón extra de ${destCountry.simbolo} ${balance.toLocaleString()} para imprevistos.`
                            : `Necesitas ${destCountry.simbolo} ${Math.abs(balance).toLocaleString()} más para cubrir ${months} meses.`}
                    </p>

                    <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${isViable ? 'bg-primary' : 'bg-red-500'}`}
                            style={{ width: `${percentCovered}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <main className="flex-1 px-4 space-y-6 lg:flex lg:flex-row lg:space-y-0 lg:gap-6">
                {/* Inputs */}
                <div className="flex-1 space-y-6">
                    <section className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">savings</span>
                            Tus Fondos y Plan
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                                    <span>Presupuesto Actual ({originCurrency})</span>
                                    <span className="text-primary">≈ {budgetInDest} {destCountry.simbolo}</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400">{originSymbol}</span>
                                    <input
                                        type="number"
                                        value={budgetOrigin}
                                        onChange={(e) => setBudgetOrigin(Number(e.target.value))}
                                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-[#11211a] border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary text-sm font-bold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2">
                                    Meses de Colchón (sin empleo)
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setMonths(m => Math.max(1, m - 1))}
                                        className="size-12 rounded-xl bg-gray-100 dark:bg-[#1e2e28] hover:bg-gray-200 dark:hover:bg-[#2a4035] flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 transition-colors"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 h-12 flex items-center justify-center bg-gray-50 dark:bg-[#11211a] rounded-xl border border-gray-200 dark:border-gray-700">
                                        <span className="text-lg font-bold text-[#111815] dark:text-white">{months} {months === 1 ? 'Mes' : 'Meses'}</span>
                                    </div>
                                    <button
                                        onClick={() => setMonths(m => Math.min(24, m + 1))}
                                        className="size-12 rounded-xl bg-gray-100 dark:bg-[#1e2e28] hover:bg-gray-200 dark:hover:bg-[#2a4035] flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Costs */}
                <div className="flex-1 space-y-6">
                    <section className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-500">payments</span>
                            Estimación de Costos
                        </h3>

                        <div className="space-y-6">
                            {/* One Time */}
                            <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Costos Únicos</h4>
                                <div className="grid grid-cols-1 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Vuelo / Viaje ({originSymbol})</label>
                                        <input type="number" value={flightOrigin} onChange={(e) => setFlightOrigin(Number(e.target.value))} className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#11211a] border-gray-200 dark:border-gray-700 text-sm" />
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm bg-gray-50 dark:bg-[#1e2e28] p-2 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Total Inicial ({destCountry.simbolo})</span>
                                    <span className="font-bold dark:text-white">{oneTimeCostsDest.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Recurring */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mensual ({destCountry.simbolo})</h4>
                                    {!isAdding && (
                                        <button onClick={() => setIsAdding(true)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                            <span className="material-symbols-outlined text-[14px]">add</span> Añadir Gasto
                                         </button>
                                     )}
                                 </div>

                                <div className="flex flex-col gap-3">
                                    {expenses.map(expense => (
                                        <div key={expense.id} className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 mb-0.5 ml-1">{expense.name}</p>
                                                <input
                                                    type="number"
                                                    value={expense.amount}
                                                    onChange={(e) => updateExpense(expense.id, parseFloat(e.target.value) || 0)}
                                                    className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#11211a] border-gray-200 dark:border-gray-700 text-sm focus:border-primary focus:ring-primary"
                                                />
                                            </div>
                                            {!expense.isBasic ? (
                                                <button
                                                    onClick={() => promptDelete(expense.id)}
                                                    className="mt-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            ) : (
                                                <div className="w-9 mt-4"></div>
                                            )}
                                        </div>
                                    ))}

                                    {isAdding && (
                                        <div className="flex items-end gap-2 bg-gray-50 dark:bg-[#1e2e28] p-2 rounded-lg animate-fade-in">
                                            <div className="flex-[2]">
                                                <input
                                                    autoFocus
                                                    placeholder="Nombre"
                                                    value={newExpenseName}
                                                    onChange={(e) => setNewExpenseName(e.target.value)}
                                                    className="w-full p-2 rounded-lg bg-white dark:bg-[#11211a] border-gray-200 dark:border-gray-700 text-sm mb-2"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder={`Monto (${destCountry.simbolo})`}
                                                    value={newExpenseAmount}
                                                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                                                    className="w-full p-2 rounded-lg bg-white dark:bg-[#11211a] border-gray-200 dark:border-gray-700 text-sm"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1 pb-1">
                                                <button onClick={addExpense} className="p-1.5 bg-primary text-white rounded-lg hover:brightness-105">
                                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                                </button>
                                                <button onClick={() => setIsAdding(false)} className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 mt-2">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Gasto Mensual Total</span>
                                <span className="text-lg font-bold text-primary">{monthlyTotalDest.toLocaleString()} {destCountry.simbolo}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {expenseToDelete && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800 animate-slide-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined">delete</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#111815] dark:text-white">¿Eliminar gasto?</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            Vas a eliminar este gasto de tu presupuesto. Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setExpenseToDelete(null)}
                                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-md shadow-red-500/20 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
