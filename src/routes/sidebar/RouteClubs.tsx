import React from "react";
import { Route, Routes} from "react-router-dom";
import YachtManagement from "../../components/sidebar/sections/yacht-management/yacht/YachtManagement";
import TypeYachtManagement from "../../components/sidebar/sections/yacht-management/yacht-types/YachtTypes";
import { PrivateRoutes } from "../../models/routes";

const RouteYacht: React.FC = () => {
  return (
    <Routes>
      <Route path={`/`} element={<YachtManagement />} />
      <Route path={`/${PrivateRoutes.TYPE_YACHTS}`} element={<TypeYachtManagement />} />
    </Routes>
  );
};

export default RouteYacht;