import { useApiQuery } from '@/hooks/useApi';
import { getCurrentPeriodStatsApi, getTopProductsAndLowStockApi } from '@/api/sale.service';
import { ExclamationTriangleIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'
import PeriodStatsCards, { type CurrentPeriodStats } from './PeriodStatsCards';
import ProductAlerts from './ProductAlerts';

export default function ReportResumePanel(){
    const { data, loading, error } = useApiQuery(
        () => getCurrentPeriodStatsApi(),
        []
    );

    const { data: productsData, loading: productsLoading, error: productsError } = useApiQuery(
        () => getTopProductsAndLowStockApi(),
        []
    );

    const stats: CurrentPeriodStats | null = data?.data || null;
    const topProducts = productsData?.data?.topProducts || [];
    const lowStockProducts = productsData?.data?.lowStockProducts || [];

    return (
        <>
            <div className="w-[440px] border-gray-1 border-3 bg-yellow-1 p-2 flex flex-col gap-2 h-full overflow-auto">
                <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="size-6 text-orange-1" />
                    <h1 className="text-xl font-semibold italic leading-6 text-black-1">
                        Datos del periodo actual:
                    </h1>
                </div>
                <PeriodStatsCards 
                    loading={loading}
                    error={error}
                    stats={stats}
                />

                <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="size-6 text-orange-1" />
                    <h1 className="text-xl font-semibold italic leading-6 text-black-1">
                        Alerta de productos:
                    </h1>
                </div>
                
                <ProductAlerts
                    loading={productsLoading}
                    error={productsError}
                    topProducts={topProducts}
                    lowStockProducts={lowStockProducts}
                />
                <div className="mb-2"></div>
            </div>
        </>
    );
}