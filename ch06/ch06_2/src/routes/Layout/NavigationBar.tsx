import {Link} from '../../components'

export default function NavigationBar() {
  return (
    <div className={'flex p-2 navbar bg-base-300'}>
      <Link to={'/'}>Home</Link>
      <Link to={'/board'} className={'ml-4'}>
        Board
      </Link>
      <Link to={'/temp'} className={'ml-4'}>
        Temp
      </Link>
    </div>
  )
}
