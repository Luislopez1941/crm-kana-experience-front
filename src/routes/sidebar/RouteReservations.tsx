import React from "react";
import { Route, Routes} from "react-router-dom";
import Reservations from "../../components/sidebar/sections/reservations/Reservations";


const RouteReservations: React.FC = () => {
  return (
    <Routes>
      {/* <Route path='/' element={<ExistenciaAlmacen />} /> */}
      <Route path={`/`} element={<Reservations />} />
    </Routes>
  );
};

export default RouteReservations;