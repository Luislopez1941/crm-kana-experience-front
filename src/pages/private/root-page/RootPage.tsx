import React from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/header/Header'
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../../components/sidebar/sections/dashboard/Dashboard';
import './RootPage.css';
import RouteReservations from '../../../routes/sidebar/RouteReservations';

const RootPage = () => {
    return (
        <div className='root__page'>
            <Sidebar />
            <div className='main'>
                <Header />
                <div className='main__container'>
                    <Routes>
                    <Route path="*" element={<Dashboard />} />
                    <Route path="/reservations" element={<RouteReservations />} />
                </Routes>
                </div>
            </div>
        </div>
    )
}

export default RootPage