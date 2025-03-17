import {Link} from '../../components'
import {Link as RRLink} from 'react-router-dom'
import {useAuth} from '../../context'

export default function NavigationBar() {
  const {loggedUser} = useAuth()

  return (
    <div className={'flex justify-between bg-base-300'}>
      <div className={'flex p-2 navbar bg-base-300'}>
        <Link to={'/'}>Home</Link>
        {loggedUser && (
          <Link to={'/board'} className={'ml-4'}>
            Board
          </Link>
        )}
        <Link to={'/temp'} className={'ml-4'}>
          Temp
        </Link>
      </div>
      <div className={'flex p-2 items-center'}>
        {!loggedUser && (
          <RRLink to={'/login'} className={'btn btn-sm btn-primary'}>
            Login
          </RRLink>
        )}

        {!loggedUser && (
          <RRLink to={'/signup'} className={'ml-4 btn btn-sm btn-outline btn-primary'}>
            SignUp
          </RRLink>
        )}
        {loggedUser && (
          <RRLink to={'/logout'} className={'mx-4'}>
            Logout
          </RRLink>
        )}
      </div>
    </div>
  )
}
