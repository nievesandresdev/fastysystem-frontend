import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMonthlyReportApi, type MonthlyReportData } from '@/api/sale.service';
import { Spinner } from '@/components/General';

const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function GeneralReport() {
    const [period, setPeriod] = useState<number>(3);
    const [data, setData] = useState<MonthlyReportData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Calcular fechas según el periodo seleccionado
            const endDate = new Date();
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - period);

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            const response = await getMonthlyReportApi({
                startDate: startDateStr,
                endDate: endDateStr
            });

            if (response.ok && response.data) {
                // Formatear los datos para la gráfica
                const formattedData = response.data.map(item => {
                    const [, month] = item.month.split('-');
                    const monthIndex = parseInt(month) - 1;
                    return {
                        ...item,
                        monthLabel: MONTHS_ES[monthIndex] || item.month,
                        totalProducts: Math.round(item.totalProducts),
                        totalProfit: Math.round(item.totalProfit * 100) / 100,
                        totalExpenses: Math.round(item.totalExpenses * 100) / 100
                    };
                });
                setData(formattedData);
            } else {
                setError('Error al cargar los datos');
            }
        } catch (err: any) {
            console.error('Error loading monthly report:', err);
            setError('Error al cargar el reporte mensual');
        } finally {
            setLoading(false);
        }
    };

    const chartData = data.map(item => ({
        mes: item.monthLabel,
        productos: item.totalProducts,
        ganancias: item.totalProfit,
        gastos: item.totalExpenses
    }));

    return (
        <section className="bg-gray-1 py-2 border-t-3 border-yellow-1">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Evolución de Ventas</h2>
                    <div className="flex items-center gap-2">
                        <label htmlFor="period-select" className="text-sm font-medium text-gray-700">
                            Período:
                        </label>
                        <select
                            id="period-select"
                            value={period}
                            onChange={(e) => setPeriod(Number(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-1 focus:border-yellow-1"
                        >
                            <option value={3}>3 meses</option>
                            <option value={6}>6 meses</option>
                            <option value={9}>9 meses</option>
                            <option value={12}>12 meses</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">
                        <p>{error}</p>
                        <button
                            onClick={loadData}
                            className="mt-4 px-4 py-2 bg-yellow-1 text-white rounded-md hover:bg-yellow-600 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No hay datos disponibles para el período seleccionado</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="mes" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                                tick={{ fontSize: 12 }}
                                label={{ value: 'Cantidad/Valor', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip 
                                formatter={(value: number, name: string) => {
                                    if (name === 'ganancias' || name === 'gastos') {
                                        return [`$${value.toFixed(2)}`, name === 'ganancias' ? 'Ganancias' : 'Gastos'];
                                    }
                                    return [value, 'Productos vendidos'];
                                }}
                                labelFormatter={(label) => `Mes: ${label}`}
                            />
                            <Legend 
                                formatter={(value) => {
                                    if (value === 'productos') return 'Productos vendidos';
                                    if (value === 'ganancias') return 'Ganancias';
                                    if (value === 'gastos') return 'Gastos';
                                    return value;
                                }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="productos" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                name="productos"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="ganancias" 
                                stroke="#f97316" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                name="ganancias"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="gastos" 
                                stroke="#6b7280" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                name="gastos"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}
