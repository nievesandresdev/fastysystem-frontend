import { useState } from 'react';
import ClosureInfoModal from '@/components/Closure/ClosureInfoModal';
import ClosureResultModal from '@/components/Closure/ClosureResultModal';
import { FlexTable, Pagination } from '@/components/General';
import { createClosureApi, getAllClosuresApi, type CreateClosureResponse, type ClosureListFilters } from '@/api/closure.service';
import { useApiQuery } from '@/hooks/useApi';

// Helper para convertir a número de forma segura
const safeNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (value === null || value === undefined) return 0;
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? 0 : parsed;
};

const formatExtraBalance = (balance: number): string => {
    const numBalance = safeNumber(balance);
    if (numBalance > 0) {
        return `Dinero extra: ${numBalance.toFixed(2)} Bs`;
    } else if (numBalance < 0) {
        return `Pérdida: ${Math.abs(numBalance).toFixed(2)} Bs`;
    } else {
        return "Equilibrado";
    }
};

// Función para obtener el primer día del mes actual
const getFirstDayOfMonth = (): string => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
};

// Función para obtener el último día del mes actual
const getLastDayOfMonth = (): string => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
};

export default function GeneralReport(){
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CreateClosureResponse['data'] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    
    // Estado para el modal de detalles de un cierre existente
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedClosure, setSelectedClosure] = useState<any>(null);

    // Filtros y paginación
    const [filters, setFilters] = useState<ClosureListFilters>({
        startDate: getFirstDayOfMonth(),
        endDate: getLastDayOfMonth(),
        page: 1,
        perPage: 8
    });

    // Consulta de cierres - se ejecuta solo cuando cambia page, perPage o _reload
    const { data: closures, loading: closuresLoading } = useApiQuery(
        () => getAllClosuresApi(filters), 
        [filters.page, filters.perPage, (filters as any)._reload]
    );

    const handleRealizarClick = () => {
        setIsInfoModalOpen(true);
    };

    const handleConfirmClosure = async () => {
        setIsInfoModalOpen(false);
        setIsResultModalOpen(true);
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await createClosureApi();
            setResult(response.data);
            // Recargar la lista después de crear un cierre
            reloadList();
        } catch (err: any) {
            console.error('Error al crear cierre:', err);
            const errorMessage = err?.data?.data?.error?.message || err?.data?.error || err?.message || 'Error desconocido al realizar el cierre';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseResultModal = () => {
        setIsResultModalOpen(false);
        setResult(null);
        setError(null);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev: ClosureListFilters) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        // Forzar recarga agregando timestamp para disparar la consulta
        setFilters(prev => ({ 
            ...prev, 
            page: 1,
            _reload: Date.now() // Campo temporal para forzar recarga
        }));
    };

    const toggleFilter = (patch: Partial<ClosureListFilters>) => {
        setFilters(prev => ({ ...prev, ...patch, page: 1 }));
    };

    const reloadList = () => {
        setFilters(prev => ({ 
            ...prev, 
            _reload: Date.now()
        }));
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-VE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
        <section className="bg-gray-1 py-2 border-t-3 border-yellow-1 pb-20">
            <div className="relative pb-3 px-4 flex">
                <div>
                    <h1 className="text-xl font-semibold">Lista de cierres</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div>
                            <label className="text-sm font-semibold mr-2">Desde el:</label>
                            <input 
                                type="date" 
                                name="startDate"
                                value={filters.startDate || ''}
                                onChange={handleFilterChange}
                                className="h-9 text-base px-2" 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold mr-2">Hasta el:</label>
                            <input 
                                type="date" 
                                name="endDate"
                                value={filters.endDate || ''}
                                onChange={handleFilterChange}
                                className="h-9 text-base px-2" 
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="h-9 px-4 rounded-[4px] text-yellow-1 text-center bg-blue-2 hover-bg-black-1 mt-auto cursor-pointer"
                        >
                            Buscar
                        </button>
                    </div>
                </div>
                <button 
                    onClick={handleRealizarClick}
                    className="text-xl font-semibold h-[88px] px-6 rounded-[4px] text-yellow-1 text-center bg-black-1 hover-bg-orange-1 cursor-pointer ml-auto"
                >
                    Realizar CIERRE
                </button>
            </div>
            <div className="border-t-3 border-yellow-1 px-4 pt-1 min-h-[calc(100vh-276px)]">
                {!closuresLoading && (!closures?.data?.data || closures.data.data.length === 0) ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-500 mb-2">No hay cierres registrados</p>
                            <p className="text-base text-gray-600">No se encontraron cierres en el rango de fechas seleccionado</p>
                        </div>
                    </div>
                ) : (
                    <FlexTable
                        columns={[
                            { 
                                key: "openAt", label: "FECHA INICIO", className: "w-[14%] bg-orange-100",
                                render: (c) => (<span className="text-base font-semibold">{formatDateTime(c.openAt)}</span>)
                            },
                            { 
                                key: "closedAt", label: "FECHA DE CIERRE", className: "w-[14%] bg-orange-100",
                                render: (c) => (<span className="text-base font-semibold">{formatDateTime(c.closedAt)}</span>)
                            },
                            { 
                                key: "totalProductsSold", label: "PRODUCTOS VENDIDOS", className: "w-[10%] bg-white",
                                render: (c) => (<span className="text-base font-semibold">{c.totalProductsSold}</span>)
                            },
                            { 
                                key: "totalLocal", label: "RESUMEN CALCULADO EN BS", className: "w-[12%] bg-green-100",
                                render: (c) => (<span className="text-base font-semibold">{parseFloat(c.totalLocal).toFixed(2)}</span>)
                            },
                            { 
                                key: "totalExchange", label: "RESUMEN CALCULADO EN ($ ó €)", className: "w-[12%] bg-green-100",
                                render: (c) => (<span className="text-base font-semibold">{parseFloat(c.totalExchange).toFixed(2)}</span>)
                            },
                            { 
                                key: "paymentBreakdown", label: "BALANCE", className: "flex-grow bg-blue-100",
                                render: (c) => (
                                    <span className="text-base font-semibold">
                                        {formatExtraBalance(safeNumber(c.paymentBreakdown?.extraBalance))}
                                    </span>
                                )
                            },
                            { 
                                key: "actions", label: "ACCIONES", className: "bg-red-100 w-[12%]",
                                render: (c) => (
                                    <button 
                                        onClick={() => {
                                            setSelectedClosure(c);
                                            setDetailModalOpen(true);
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm font-semibold"
                                    >
                                        Ver más detalle
                                    </button>
                                )
                            }
                        ]}
                        data={closures?.data?.data ?? []}
                        isLoading={closuresLoading}
                        selectedRow={selectedRow}
                        selectRowFn={(id) => setSelectedRow(id)}
                        currentPage={filters.page}
                        numRows={filters.perPage}
                        hoverSelect={true}
                    />
                )}
            </div>

            {/* Paginación */}
            {Boolean(closures?.data?.data?.length) && (
                <div className="bg-gray-1 flex justify-between items-center px-4 fixed bottom-0 left-0 w-full shadow">
                    <h2 className="text-base font-semibold"> 
                        <span className="text-3xl text-red-1 font-bold">{closures?.data?.total ?? 0} </span>
                        Cierres en lista
                    </h2>
                    <div className="border-l-3 border-yellow-1 flex gap-4 pl-2 ml-4 items-center">
                        <h2 className="text-base font-semibold">Cierres por pagina:</h2>
                        <button 
                            className={`px-3 py-1 rounded cursor-pointer shadow ${filters.perPage == 8 ? 'bg-green-500 text-white font-bold' : 'bg-gray-200 hover-bg-gray-2'}`}
                            onClick={() => toggleFilter({ perPage: 8 })}
                        >
                            8 
                        </button>
                        <button 
                            className={`px-3 py-1 rounded cursor-pointer shadow ${filters.perPage == 12 ? 'bg-green-500 text-white font-bold' : 'bg-gray-200 hover-bg-gray-2'}`}
                            onClick={() => toggleFilter({ perPage: 12 })}
                        >
                            12
                        </button>
                    </div>
                    <Pagination
                        page={closures?.data?.page ?? 1}
                        totalPages={closures?.data?.totalPages ?? 0}
                        onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
                    />
                </div>
            )}
        </section>
        <ClosureInfoModal 
            isOpen={isInfoModalOpen} 
            onClose={() => setIsInfoModalOpen(false)} 
            onConfirm={handleConfirmClosure}
        />
        <ClosureResultModal 
            isOpen={isResultModalOpen}
            onClose={handleCloseResultModal}
            loading={loading}
            result={result || undefined}
            error={error || undefined}
            mode="create"
        />
        <ClosureResultModal 
            isOpen={detailModalOpen}
            onClose={() => {
                setDetailModalOpen(false);
                setSelectedClosure(null);
            }}
            loading={false}
            result={selectedClosure ? { 
                closure: selectedClosure, 
                salesCount: 0 // TODO: Agregar conteo real de ventas si es necesario
            } : undefined}
            error={undefined}
            mode="detail"
        />
        </>
    )
}