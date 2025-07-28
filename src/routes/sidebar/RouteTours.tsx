import React from "react";
import { Route, Routes} from "react-router-dom";
import { PrivateRoutes } from "../../models/routes";
import TourManagement from "../../components/sidebar/sections/tour-management/tours/TourManagement";
import TourTypes from "../../components/sidebar/sections/tour-management/tour-types/TourTypes";

const RouteTours: React.FC = () => {
  return (
    <Routes>
      <Route path={`/`} element={<TourManagement />} />
      <Route path={`/${PrivateRoutes.TOUR_TYPES}`} element={<TourTypes />} />
      </Routes>
  );
};

export default RouteTours;