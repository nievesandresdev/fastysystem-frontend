import { useApiQuery } from '@/hooks/useApi';
import { getSalesStatsApi, type SalesStatsResponse } from '@/api/sale.service';
import { type ExpenseListFilters, getAllExpensesWithEffectApi, type ExpenseListResponse } from '@/api/expense.service';

interface ExpenseSummaryProps {
    filters: ExpenseListFilters;
    onReload: () => void;
}

const ExpenseSummary = ({ filters, onReload }: ExpenseSummaryProps) => {
    // Query para obtener estadísticas de ventas usando directamente los filtros
    const { data: salesStats, loading: salesLoading } = useApiQuery<SalesStatsResponse>(
        () => getSalesStatsApi({
            startDate: filters.startDate || '',
            endDate: filters.endDate || ''
        }),
        [(filters as any)._reload] // Solo se ejecuta cuando se fuerza recarga
    );

    // Query para obtener gastos del período (solo con efecto)
    const { data: expensesData, loading: expensesLoading } = useApiQuery<ExpenseListResponse>(
        () => getAllExpensesWithEffectApi(filters),
        [(filters as any)._reload] // Solo se ejecuta cuando se fuerza recarga
    );

    if (salesLoading || expensesLoading) {
        return (
            <div className="px-4 pt-3">
                <div className="text-center py-4">
                    <p className="text-base">Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    const summary = salesStats?.data?.summary;
    const expenses = expensesData?.data || [];
    
    // Calcular total de gastos
    const totalExpenses = expenses.reduce((sum: number, expense: any) => {
        return sum + parseFloat(expense.amount);
    }, 0);
    
    // Calcular saldo neto (ganancias en moneda de cambio - gastos en moneda de cambio)
    const netProfit = summary ? parseFloat(summary.totalProfitExchange) - totalExpenses : 0;
    const isPositive = netProfit >= 0;

    return (
        <div className="px-4 pt-3">
            {/* Bloque 1: Ventas Totales */}
            <div className="mb-3">
                <div className="bg-blue-500 px-2 py-1 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Ventas Totales
                    </h2>
                    <span className="bg-white text-blue-500 px-2 py-0.5 rounded-full text-xs font-bold">
                        Numero de ventas: {summary?.salesCount || 0}
                    </span>
                </div>
                <div className="bg-white border-l-2 border-r-2 border-b-2 border-blue-500 p-3">
                    {summary ? (
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="text-gray-600">Ventas en Moneda Local: </span>
                                <span className="font-bold text-blue-600">{summary.totalSalesLocal} Bs</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-600">Ventas en Moneda Cambio: </span>
                                <span className="font-bold text-blue-600">{summary.totalSalesExchange}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Sin datos disponibles para el período</p>
                    )}
                </div>
            </div>
            
            {/* Bloque 2: Resumen de Ganancias */}
            <div className="mb-3">
                <div className="bg-green-500 px-2 py-1 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Resumen de Ganancias
                    </h2>
                </div>
                <div className="bg-white border-l-2 border-r-2 border-b-2 border-green-500 p-3">
                    {summary ? (
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="text-gray-600">Ganancias en Moneda Local: </span>
                                <span className="font-bold text-green-600">{summary.totalProfitLocal} Bs</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-600">Ganancias en Moneda Cambio: </span>
                                <span className="font-bold text-green-600">{summary.totalProfitExchange} </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Sin datos disponibles para el período</p>
                    )}
                </div>
            </div>

            {/* Bloque 3: Saldo Neto (Ganancias - Gastos) */}
            <div className="mb-3">
                <div className={`px-2 py-1 flex items-center justify-between ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}>
                    <h2 className="text-lg font-semibold text-white">
                        {isPositive ? 'Saldo Positivo' : 'Saldo Negativo'}
                    </h2>
                </div>
                <div className={`bg-white border-l-2 border-r-2 border-b-2 p-3 ${isPositive ? 'border-green-500' : 'border-red-500'}`}>
                    <div className="space-y-2">
                        {/* Ganancias */}
                        <div className="text-sm">
                            <span className="text-gray-600">Ganancias del período: </span>
                            <span className="font-bold text-green-600">
                                +{summary?.totalProfitExchange || '0'} (moneda de cambio)
                            </span>
                        </div>
                        
                        {/* Gastos */}
                        <div className="text-sm">
                            <span className="text-gray-600">Gastos del período: </span>
                            <span className="font-bold text-red-600">
                                -{totalExpenses.toFixed(2)} $
                            </span>
                        </div>
                        
                        {/* Línea separadora */}
                        <div className="border-t border-gray-300 my-2"></div>
                        
                        {/* Saldo neto */}
                        <div className="text-base font-bold">
                            <span className="text-gray-700">Saldo Neto: </span>
                            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                                {isPositive ? '+' : ''}{netProfit.toFixed(2)} $
                            </span>
                        </div>
                        
                        {/* Mensaje de estado */}
                        <div className="text-xs text-gray-500 italic">
                            {isPositive 
                                ? '✅ El negocio está generando ganancias netas' 
                                : '⚠️ El negocio está en pérdidas netas'
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseSummary;
