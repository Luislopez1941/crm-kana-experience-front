import React from "react";
import { Route, Routes} from "react-router-dom";

import UserManagement from "../../components/sidebar/sections/user-management/users/UserManagement";

const RouteUser: React.FC = () => {
  return (
    <Routes>
      <Route path={`/`} element={<UserManagement />} />
      {/* <Route path={`/${PrivateRoutes.USERS}`} element={<TypeYachtManagement />} /> */}
    </Routes>
  );
};

export default RouteUser;