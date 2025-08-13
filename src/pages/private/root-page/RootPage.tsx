import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/header/Header'
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../../components/sidebar/sections/dashboard/Dashboard';
import './RootPage.css';
import RouteReservations from '../../../routes/sidebar/RouteReservations';
import RouteYacht from '../../../routes/sidebar/RouteYacht';
import RouteTours from '../../../routes/sidebar/RouteTours';
import RouteClubs from '../../../routes/sidebar/RouteClubs';
import RouteUser from '../../../routes/sidebar/RouteUser';
import { PrivateRoutes } from '../../../models/routes';

const RootPage = () => {
    return (
        <div className='root__page'>
            <Sidebar />
            <div className='main'>
                <Header />
                <div className='main__container'>
                    <Routes>
                    <Route path="*" element={<Dashboard />} />
                    <Route path={`/${PrivateRoutes.RESERVATIONS}`} element={<RouteReservations />} />
                    <Route path={`/${PrivateRoutes.YACHTS}/*`} element={<RouteYacht />} />
                    <Route path={`/${PrivateRoutes.TOURS}/*`} element={<RouteTours />} />
                    <Route path={`/${PrivateRoutes.CLUBS}/*`} element={<RouteClubs />} />
                    <Route path={`/${PrivateRoutes.USERS}/*`} element={<RouteUser />} />
                </Routes>
                </div>
            </div>
        </div>
    )
}

export default RootPage