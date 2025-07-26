import { BrowserRouter as Router, Route } from 'react-router-dom';
import RoutesWithNotFound from './utils/routes-with-not-found';
import { PublicRoutes, PrivateRoutes } from './models/routes';
import RouteProtector from './pages/private/RouteProtector';
import AuthGuard from './guards/auth.guard';
import Login from './pages/login/Login';
import './App.css'



function App() {
  return (
    <Router>
      <RoutesWithNotFound>
        <Route path={`/${PublicRoutes.LOGIN}`} element={<Login />} />
        <Route element={<AuthGuard privateValidation={true} />}>
          <Route path={`/*`} element={<RouteProtector />} />
        </Route>
      </RoutesWithNotFound>
    </Router>
  )
}

export default App
