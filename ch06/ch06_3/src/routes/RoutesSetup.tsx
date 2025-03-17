import {Routes, Route} from 'react-router-dom'
import NoMatch from './NoMatch'
import Layout from './Layout'
import Board from '../pages/Board'
import LandingPage from './LandingPage'

import Signup from './Auth/SignUp'
import Login from './Auth/Login'
import Logout from './Auth/Logout'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path={'/'} element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path={'/board'} element={<Board />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
      <Route path={'/signup'} element={<Signup />} />
      <Route path={'/login'} element={<Login />} />
      <Route path={'/logout'} element={<Logout />} />
      <Route path={'*'} element={<NoMatch />} />
    </Routes>
  )
}
