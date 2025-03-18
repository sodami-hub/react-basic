import type {FC, PropsWithChildren} from 'react'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../context'

type RequireAuthProps = {}

const RequireAuth: FC<PropsWithChildren<RequireAuthProps>> = ({children}) => {
  const {loggedUser} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loggedUser) {
      // 허가되지 않은 사용자
      alert('you are not logged user!')
      navigate(-1) // 이전 페이지로 돌아감
    }
  }, [loggedUser, navigate])

  return <>{children}</>
}

export default RequireAuth
