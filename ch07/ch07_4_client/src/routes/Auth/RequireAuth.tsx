import type {FC, PropsWithChildren} from 'react'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../context'

type RequireAuthProps = {}

const RequireAuth: FC<PropsWithChildren<RequireAuthProps>> = ({children}) => {
  const {jwt} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!jwt) {
      // 허가되지 않은 사용자
      navigate('/login') // jwt 토큰이 없으므로 로그인화면으로 이동
    }
  }, [jwt, navigate])

  return <>{children}</> // jwt 토큰이 있으므로 children이 element가 되게 함
}

export default RequireAuth
