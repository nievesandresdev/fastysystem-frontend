import { TrophyIcon, CubeIcon } from '@heroicons/react/24/solid';
import { Spinner } from '@/components/General';
import type { TopProduct, LowStockProduct } from '@/api/sale.service';

interface ProductAlertsProps {
    loading?: boolean;
    error?: { message?: string } | null;
    topProducts?: TopProduct[];
    lowStockProducts?: LowStockProduct[];
}

export default function ProductAlerts({ 
    loading = false, 
    error = null, 
    topProducts = [], 
    lowStockProducts = [] 
}: ProductAlertsProps) {
    return (
        <>
            {/* TOP productos más vendidos */}
            <div className="w-full rounded-[4px] bg-blue-2 p-2 shadow-lg">
                <div className="flex gap-3 items-center">
                    <TrophyIcon className="size-12 text-yellow-1" />
                    <h3 className="text-2xl font-semibold text-yellow-1 italic leading-4 text-left">
                        TOP 10 productos <br/> 
                        <span className="text-xs">más vendidos:</span>
                    </h3>
                </div>
                <div className="mt-2 pt-2 border-t-2 border-yellow-1">
                    {loading ? (
                        <div className="flex justify-center py-2">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="text-red-600 text-sm py-2">Error al cargar productos</div>
                    ) : topProducts.length === 0 ? (
                        <div className="text-yellow-1 text-sm py-2">No hay productos vendidos</div>
                    ) : (
                        <ul className="space-y-1 max-h-48 overflow-y-auto">
                            {topProducts.map((product, index) => (
                                <li key={product.id} className="flex items-center justify-between text-yellow-1 text-sm">
                                    <span className="font-semibold">{index + 1}. {product.name}</span>
                                    <span className="text-xs">({product.totalSold} vendidos)</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Productos con poco stock */}
            <div className="w-full rounded-[4px] bg-red-1 p-2 shadow-lg">
                <div className="flex gap-3 items-center">
                    <CubeIcon className="size-12 text-yellow-1" />
                    <h3 className="text-2xl font-semibold text-yellow-1 italic leading-4 text-left">
                        Productos con <br/> 
                        <span className="text-xs">poco stock:</span>
                    </h3>
                </div>
                <div className="mt-2 pt-2 border-t-2 border-yellow-1">
                    {loading ? (
                        <div className="flex justify-center py-2">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="text-red-600 text-sm py-2">Error al cargar productos</div>
                    ) : lowStockProducts.length === 0 ? (
                        <div className="text-yellow-1 text-sm py-2">No hay productos con stock bajo</div>
                    ) : (
                        <ul className="space-y-1 max-h-48 overflow-y-auto">
                            {lowStockProducts.map((product) => (
                                <li key={product.id} className="flex items-center justify-between text-yellow-1 text-sm">
                                    <span className="font-semibold">{product.name}</span>
                                    <span className="text-xs">Stock: {product.stock} / Min para alerta: {product.minStock}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

