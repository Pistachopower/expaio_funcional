import React, { useState, useEffect } from 'react';
import { BackHeader } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';

interface ExpenseItem {
    id: string;
    name: string;
    amount: number;
    dbId?: string;
}

interface ReferenceData {
    alquiler: number;
    seguro_salud: number;
    transporte: number;
    comida: number;
    vuelo: number;
}

export const CalculatorScreen: React.FC = () => {
    const { user, profile } = useAuth();
    
    const [destCountry, setDestCountry] = useState({ nombre: 'tu destino', moneda: 'EUR', simbolo: '€' });
    const [originSymbol, setOriginSymbol] = useState('€');
    const [isLoading, setIsLoading] = useState(true);

    // Inputs — empiezan vacíos
    const [budgetStr, setBudgetStr] = useState('');
    const [months, setMonths] = useState(3);
    const [flightStr, setFlightStr] = useState('');

    // Expenses del usuario (guardados en BD)
    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
    const [newExpenseName, setNewExpenseName] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Referencia del país (sugerencia)
    const [refData, setRefData] = useState<ReferenceData | null>(null);
    const [showRefBanner, setShowRefBanner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!profile) return;
            setIsLoading(true);

            // Fetch Destination
            if (profile.pais_destino_id) {
                const { data: dest } = await supabase
                    .from('paises')
                    .select('nombre, moneda, simbolo_moneda')
                    .eq('id', profile.pais_destino_id)
                    .single();
                if (dest) {
                    setDestCountry({ nombre: dest.nombre, moneda: dest.moneda, simbolo: dest.simbolo_moneda });
                }
            }

            // Fetch Origin symbol
            if (profile.pais_origen_id) {
                const { data: origin } = await supabase
                    .from('paises')
                    .select('simbolo_moneda')
                    .eq('id', profile.pais_origen_id)
                    .single();
                if (origin) setOriginSymbol(origin.simbolo_moneda);
            }

            // Fetch reference costs (just store them, don't auto-apply)
            if (profile.pais_destino_id) {
                const { data: costos } = await supabase
                    .from('costos_referencia_pais')
                    .select('concepto, monto_estimado')
                    .eq('pais_id', profile.pais_destino_id);
                
                if (costos && costos.length > 0) {
                    const ref: any = {};
                    costos.forEach(c => { ref[c.concepto] = Number(c.monto_estimado); });
                    setRefData(ref as ReferenceData);
                    setShowRefBanner(true);
                }
            }

            // Fetch user's saved expenses
            if (user) {
                const { data: saved } = await supabase
                    .from('gastos_usuario')
                    .select('id, nombre, monto')
                    .eq('usuario_id', user.id)
                    .eq('tipo', 'mensual');
                
                if (saved && saved.length > 0) {
                    setExpenses(saved.map(s => ({
                        id: `user-${s.id}`,
                        name: s.nombre,
                        amount: Number(s.monto),
                        dbId: s.id,
                    })));
                    setShowRefBanner(false); // Ya tiene datos
                }
            }

            setIsLoading(false);
        };
        fetchData();
    }, [profile, user]);

    // Parsed numbers (empty string = 0)
    const budget = parseFloat(budgetStr) || 0;
    const flight = parseFloat(flightStr) || 0;

    // Calculations
    const monthlyTotal = expenses.reduce((acc, item) => acc + item.amount, 0);
    const totalRequired = flight + (monthlyTotal * months);
    const balance = budget - totalRequired;
    const hasData = budget > 0 || expenses.length > 0;
    const isViable = hasData && balance >= 0;
    const percentCovered = totalRequired > 0 ? Math.min(100, Math.max(0, (budget / totalRequired) * 100)) : (budget > 0 ? 100 : 0);

    // Load reference data into expenses
    const loadReferenceData = () => {
        if (!refData) return;
        
        const refExpenses: ExpenseItem[] = [];
        if (refData.alquiler) refExpenses.push({ id: 'ref-0', name: 'Alquiler', amount: refData.alquiler });
        if (refData.seguro_salud) refExpenses.push({ id: 'ref-1', name: 'Seguro Salud', amount: refData.seguro_salud });
        if (refData.transporte) refExpenses.push({ id: 'ref-2', name: 'Transporte', amount: refData.transporte });
        if (refData.comida) refExpenses.push({ id: 'ref-3', name: 'Comida/Otros', amount: refData.comida });

        if (refData.vuelo) setFlightStr(refData.vuelo.toString());

        setExpenses(prev => [...prev, ...refExpenses]);
        setShowRefBanner(false);
    };

    // Handlers
    const updateExpense = (id: string, amount: number) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, amount } : e));
    };

    const confirmDelete = async () => {
        if (!expenseToDelete) return;
        const expense = expenses.find(e => e.id === expenseToDelete);
        if (expense?.dbId) {
            await supabase.from('gastos_usuario').delete().eq('id', expense.dbId);
        }
        setExpenses(prev => prev.filter(e => e.id !== expenseToDelete));
        setExpenseToDelete(null);
    };

    const addExpense = async () => {
        if (!newExpenseName || !newExpenseAmount || !user) return;
        setIsSaving(true);
        const monto = parseFloat(newExpenseAmount) || 0;

        const { data, error } = await supabase
            .from('gastos_usuario')
            .insert({ usuario_id: user.id, nombre: newExpenseName, monto, tipo: 'mensual', es_basico: false })
            .select('id')
            .single();

        if (!error && data) {
            setExpenses(prev => [...prev, { id: `user-${data.id}`, name: newExpenseName, amount: monto, dbId: data.id }]);
        }
        setNewExpenseName('');
        setNewExpenseAmount('');
        setIsAdding(false);
        setIsSaving(false);
    };

    // Select all text on focus for easy replacement
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

    if (isLoading) {
        return (
            <div className="flex flex-col h-full animate-fade-in w-full">
                <BackHeader title="Viabilidad de Mudanza" />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl animate-spin mb-4">progress_activity</span>
                    <p className="text-sm text-gray-500">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-full flex-col bg-background-light dark:bg-background-dark overflow-y-auto animate-fade-in pb-24 w-full max-w-5xl mx-auto">
            <BackHeader
                title="Viabilidad de Mudanza"
                showHelp={true}
                helpTitle="¿Cómo funciona?"
                helpText={`Introduce tu presupuesto y los gastos estimados para vivir en ${destCountry.nombre}. La calculadora te dirá si te alcanza para cubrir los meses que elijas sin ingresos. Los gastos que añadas se guardan automáticamente.`}
            />

            {/* Status Card */}
            <div className="px-4 pb-4">
                {!hasData ? (
                    <div className="rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-gray-800">
                                <span className="material-symbols-outlined text-gray-400 text-2xl">edit_note</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-[#111815] dark:text-white">Empieza a calcular</h1>
                                <p className="text-sm text-gray-500">Introduce tu presupuesto y añade tus gastos estimados.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`rounded-xl p-5 shadow-sm border transition-all ${isViable ? 'bg-primary/10 border-primary/20' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">
                                    {isViable ? 'Plan Viable' : 'Presupuesto Insuficiente'}
                                </p>
                                <h1 className={`text-3xl font-bold tracking-tight ${isViable ? 'text-[#11211a] dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                                    {isViable ? '¡Estás listo!' : 'Te falta capital'}
                                </h1>
                            </div>
                            <div className={`flex items-center justify-center size-10 rounded-full ${isViable ? 'bg-primary text-white' : 'bg-red-500 text-white'}`}>
                                <span className="material-symbols-outlined text-2xl">{isViable ? 'check' : 'priority_high'}</span>
                            </div>
                        </div>
                        <p className="text-sm opacity-80 mb-2">
                            {isViable
                                ? `Tienes un colchón extra de ${destCountry.simbolo} ${balance.toLocaleString()} para imprevistos.`
                                : `Necesitas ${destCountry.simbolo} ${Math.abs(balance).toLocaleString()} más para cubrir ${months} ${months === 1 ? 'mes' : 'meses'}.`}
                        </p>
                        <div className="text-xs opacity-60 mb-3 space-y-0.5">
                            <p>Tu presupuesto: {destCountry.simbolo} {budget.toLocaleString()} | Necesitas: {destCountry.simbolo} {totalRequired.toLocaleString()}</p>
                            <p>({destCountry.simbolo} {flight.toLocaleString()} vuelo + {destCountry.simbolo} {monthlyTotal.toLocaleString()}/mes × {months} {months === 1 ? 'mes' : 'meses'})</p>
                        </div>
                        <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isViable ? 'bg-primary' : 'bg-red-500'}`}
                                style={{ width: `${percentCovered}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reference Data Banner */}
            {showRefBanner && refData && expenses.length === 0 && (
                <div className="px-4 pb-4">
                    <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-500 mt-0.5">tips_and_updates</span>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">Datos de referencia disponibles</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                                Tenemos costos estimados para {destCountry.nombre}. ¿Quieres usarlos como punto de partida?
                            </p>
                            <button
                                onClick={loadReferenceData}
                                className="text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Cargar datos de {destCountry.nombre}
                            </button>
                        </div>
                        <button onClick={() => setShowRefBanner(false)} className="text-blue-400 hover:text-blue-600">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                </div>
            )}

            <main className="flex-1 px-4 space-y-6 lg:flex lg:flex-row lg:space-y-0 lg:gap-6">
                {/* Budget & Plan */}
                <div className="flex-1 space-y-6">
                    <section className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">savings</span>
                            Tus Fondos y Plan
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">
                                    Tu Presupuesto ({destCountry.simbolo})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400">{destCountry.simbolo}</span>
                                    <input
                                        type="number"
                                        placeholder="Ej: 5000"
                                        value={budgetStr}
                                        onFocus={handleFocus}
                                        onChange={(e) => setBudgetStr(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-gray-50 dark:bg-[#11211a] border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary text-sm font-bold"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2">
                                    Meses sin empleo
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setMonths(m => Math.max(1, m - 1))}
                                        className="size-12 rounded-xl bg-gray-100 dark:bg-[#1e2e28] hover:bg-gray-200 dark:hover:bg-[#2a4035] flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 transition-colors active:scale-95"
                                    >−</button>
                                    <div className="flex-1 h-12 flex items-center justify-center bg-gray-50 dark:bg-[#11211a] rounded-xl border border-gray-200 dark:border-gray-700">
                                        <span className="text-lg font-bold text-[#111815] dark:text-white">{months} {months === 1 ? 'Mes' : 'Meses'}</span>
                                    </div>
                                    <button
                                        onClick={() => setMonths(m => Math.min(24, m + 1))}
                                        className="size-12 rounded-xl bg-gray-100 dark:bg-[#1e2e28] hover:bg-gray-200 dark:hover:bg-[#2a4035] flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 transition-colors active:scale-95"
                                    >+</button>
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
                            Tus Gastos Estimados
                        </h3>

                        <div className="space-y-6">
                            {/* One Time */}
                            <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Costo Único</h4>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Vuelo / Viaje ({destCountry.simbolo})</label>
                                    <input
                                        type="number"
                                        placeholder="Ej: 250"
                                        value={flightStr}
                                        onFocus={handleFocus}
                                        onChange={(e) => setFlightStr(e.target.value)}
                                        className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#11211a] border-gray-200 dark:border-gray-700 text-sm focus:border-primary focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Monthly */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mensual ({destCountry.simbolo})</h4>
                                    {!isAdding && (
                                        <button onClick={() => setIsAdding(true)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                            <span className="material-symbols-outlined text-[14px]">add</span> Añadir Gasto
                                        </button>
                                    )}
                                </div>

                                {expenses.length === 0 && !isAdding ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <span className="material-symbols-outlined text-3xl mb-2 block">receipt_long</span>
                                        <p className="text-sm">No tienes gastos añadidos.</p>
                                        <p className="text-xs mt-1">Pulsa "Añadir Gasto" para empezar.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {expenses.map(expense => (
                                            <div key={expense.id} className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-0.5 ml-1">{expense.name}</p>
                                                    <input
                                                        type="number"
                                                        value={expense.amount}
                                                        onFocus={handleFocus}
                                                        onChange={(e) => updateExpense(expense.id, parseFloat(e.target.value) || 0)}
                                                        className="w-full p-2 rounded-lg bg-gray-50 dark:bg-[#11211a] border-gray-200 dark:border-gray-700 text-sm focus:border-primary focus:ring-primary"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setExpenseToDelete(expense.id)}
                                                    className="mt-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {isAdding && (
                                    <div className="flex items-end gap-2 bg-gray-50 dark:bg-[#1e2e28] p-3 rounded-lg animate-fade-in mt-3">
                                        <div className="flex-[2]">
                                            <input
                                                autoFocus
                                                placeholder="Ej: Alquiler"
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
                                            <button onClick={addExpense} disabled={isSaving || !newExpenseName || !newExpenseAmount} className="p-1.5 bg-primary text-white rounded-lg hover:brightness-105 disabled:opacity-50">
                                                <span className="material-symbols-outlined text-[18px]">{isSaving ? 'progress_activity' : 'check'}</span>
                                            </button>
                                            <button onClick={() => { setIsAdding(false); setNewExpenseName(''); setNewExpenseAmount(''); }} className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {expenses.length > 0 && (
                                <div className="pt-2 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 mt-2">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Gasto Mensual Total</span>
                                    <span className="text-lg font-bold text-primary">{monthlyTotal.toLocaleString()} {destCountry.simbolo}</span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {/* Delete Modal */}
            {expenseToDelete && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800 animate-slide-up">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined">delete</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#111815] dark:text-white">¿Eliminar gasto?</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Este gasto se eliminará de tu presupuesto.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setExpenseToDelete(null)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm">Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm shadow-md shadow-red-500/20">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
