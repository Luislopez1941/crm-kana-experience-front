
import { Route} from 'react-router-dom'
import RoutesWithNotFonud from '../../utils/routes-with-not-found'
import { PrivateRoutes } from '../../models/routes'
import RootPage from './root-page/RootPage'

const RouteProtector = () => {
  return (
    <RoutesWithNotFonud>
      <Route path={'*'} element={<RootPage />} />
      <Route path={PrivateRoutes.HOME} element={<RootPage />} />
    </RoutesWithNotFonud>
  )
}

export default RouteProtector
