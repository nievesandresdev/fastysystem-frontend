import { Outlet } from 'react-router-dom';
import MainMenu from './MainMenu.jsx'
import { Http401Binder } from '@/components/Auth';
import { ExchangeSetting } from '@/components/Settings';
import { useAppSelector } from '@/hooks/store';

export default function AppLayout({ rightPanel }){
    const { current } = useAppSelector(s => s.exchange);

    return (
        <>
        <Http401Binder />
        <ExchangeSetting isOpen={!current} />
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