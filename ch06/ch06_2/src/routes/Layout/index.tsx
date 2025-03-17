import {Outlet} from 'react-router-dom'
import Footer from './Footer'
import NavigationBar from './NavigationBar'

export default function Layout() {
  return (
    <>
      <NavigationBar />
      <Outlet />
      <Footer />
    </>
  )
}
