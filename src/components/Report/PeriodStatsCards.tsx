import { CalculatorIcon } from '@heroicons/react/24/solid'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { CalendarDaysIcon } from '@heroicons/react/24/solid'
import { Spinner } from '@/components/General';

export interface CurrentPeriodStats {
    startDate: string;
    endDate: string;
    transactionCount: number;
    totalLocal: number;
    totalExchange: number;
}

interface PeriodStatsCardsProps {
    loading?: boolean;
    error?: { message?: string } | null;
    stats?: CurrentPeriodStats | null;
}

export default function PeriodStatsCards({ loading = false, error = null, stats = null }: PeriodStatsCardsProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-VE', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-VE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatCurrency = (value: number, decimals: number = 2) => {
        const parts = value.toFixed(decimals).split('.');
        return {
            integer: parts[0],
            decimal: parts[1] || '00'
        };
    };

    return (
        <>
        
        {/* card 1 */}
        <div className="w-full rounded-[4px] bg-red-1 p-2 shadow-lg">
            <div className="flex gap-3 items-center">
                <CalendarDaysIcon className="size-12 text-yellow-1" />
                <h3 className="text-2xl font-semibold text-yellow-1 italic leading-6">
                    Periodo actual:
                </h3>
                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-red-600 text-sm">Error</div>
                ) : stats ? (
                    <div>
                        <h3 className="text-xl text-yellow-1 font-semibold">
                            {formatDate(stats.startDate)}
                            <span className="text-sm"> a las {formatTime(stats.startDate)}</span>
                        </h3>
                        <h3 className="text-lg text-yellow-1 font-semibold">
                            {formatDate(stats.endDate)} <span className="text-sm"> ahora mismo</span>
                        </h3>
                    </div>
                ) : null}
            </div>
        </div>
        {/* card 2 */}
        <div className="w-full rounded-[4px] bg-blue-1 p-2 shadow-lg">
            <div className="flex gap-3 items-end">
                <CalculatorIcon className="size-12 text-yellow-1" />
                <h3 className="text-2xl font-semibold text-yellow-1 italic leading-4">
                    N° de ventas <br/> 
                    <span className="text-xs">en periodo:</span>
                </h3>
                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-red-600 text-sm">Error</div>
                ) : stats ? (
                    <h1 className="ml-auto text-5xl font-semibold text-yellow-1">{stats.transactionCount}</h1>
                ) : (
                    <h1 className="ml-auto text-5xl font-semibold text-yellow-1">0</h1>
                )}
            </div>
        </div>
        {/* card 3 */}
        <div className="w-full rounded-[4px] bg-orange-1 p-2 shadow-lg">
            <div className="flex gap-3 items-end">
                <CalculatorIcon className="size-12 text-yellow-1" />
                <h3 className="text-2xl font-semibold text-yellow-1 italic leading-4">
                    Total en ventas Bs <br/> 
                    <span className="text-xs">en periodo:</span>
                </h3>
                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-red-600 text-sm">Error</div>
                ) : stats ? (
                    <h1 className="ml-auto text-3xl font-semibold text-yellow-1">
                        {formatCurrency(stats.totalLocal).integer}
                        <span className="text-xs">,{formatCurrency(stats.totalLocal).decimal} </span>Bs
                    </h1>
                ) : (
                    <h1 className="ml-auto text-3xl font-semibold text-yellow-1">
                        0<span className="text-xs">,00 </span>Bs
                    </h1>
                )}
            </div>
        </div>
        {/* card 4 */}
        <div className="w-full rounded-[4px] bg-blue-2 p-2 shadow-lg">
            <div className="flex gap-3 items-end">
                <CurrencyDollarIcon className="size-12 text-yellow-1" />
                <h3 className="text-2xl font-semibold text-yellow-1 italic leading-4">
                    Total en ventas (REF)<br/> 
                    <span className="text-xs">en periodo:</span>
                </h3>
                {loading ? (
                    <Spinner />
                ) : error ? (
                    <div className="text-red-600 text-sm">Error</div>
                ) : stats ? (
                    <h1 className="ml-auto text-3xl font-semibold text-yellow-1">
                        {formatCurrency(stats.totalExchange).integer}
                        <span className="text-xs">,{formatCurrency(stats.totalExchange).decimal} </span>USD
                    </h1>
                ) : (
                    <h1 className="ml-auto text-3xl font-semibold text-yellow-1">
                        0<span className="text-xs">,00 </span>USD
                    </h1>
                )}
            </div>
        </div>
       
        </>
    );
}

