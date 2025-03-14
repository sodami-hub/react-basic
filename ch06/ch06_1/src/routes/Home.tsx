import type {FC} from 'react'
import {Link} from 'react-router-dom'

type HomeProps = {
  title?: string
}
/*
?? 연산자는 Null 병합 연산자(Nullish Coalescing Operator)라고 하며,
왼쪽 피연산자가 null 또는 undefined일 경우 오른쪽 피연산자를 반환합니다.
그렇지 않으면 왼쪽 피연산자를 반환합니다.
 */
const Home: FC<HomeProps> = ({title}) => {
  return (
    <div>
      <div className={'flex bg-gray-700 p-4'}>
        <Link to={'/'}>Home</Link>
        <Link to={'/welcome'} className={'ml-4'}>
          Welcome
        </Link>
        <Link to={'/board'} className={'ml-4'}>
          Board
        </Link>
      </div>
      <p className={'text-bold text-center text-xl'}>{title ?? 'Home'}</p>
    </div>
  )
}

export default Home
