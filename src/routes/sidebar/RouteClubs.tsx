import React from "react";
import { Route, Routes} from "react-router-dom";
import ClubManagement from "../../components/sidebar/sections/club-management/clubs/ClubManagement";
import ClubTypes from "../../components/sidebar/sections/club-management/club-types/ClubTypes";
import { PrivateRoutes } from "../../models/routes";

const RouteClubs: React.FC = () => {
  return (
    <Routes>
      <Route path={`/`} element={<ClubManagement />} />
      <Route path={`/${PrivateRoutes.CLUB_TYPES}`} element={<ClubTypes />} />
    </Routes>
  );
};

export default RouteClubs;