import { Outlet } from 'react-router-dom';
import MainMenu from './MainMenu.jsx'
import { Http401Binder } from '@/components/Auth';
import { ExchangeSetting } from '@/components/Settings';
import { useAppSelector } from '@/hooks/store';

type AppLayoutProps = {
    rightPanel?: React.ReactNode;
};

export default function AppLayout({ rightPanel }: AppLayoutProps){
    const { current, isExchangeSettingOpen } = useAppSelector(s => s.exchange);
    
    // El modal se abre cuando no hay tasa activa O cuando se solicita manualmente
    const shouldOpenExchangeSetting = !current || isExchangeSettingOpen;

    return (
        <>
        <Http401Binder />
        <ExchangeSetting isOpen={shouldOpenExchangeSetting} />
        <section className="h-screen flex">
            <div className="flex-grow h-full">
                <MainMenu />
                <Outlet />
            </div>
            {rightPanel || <div></div>}
        </section>
        </>
    );
}