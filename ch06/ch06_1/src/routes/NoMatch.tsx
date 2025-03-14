import {useNavigate} from 'react-router-dom'
import {useCallback} from 'react'

export default function NoMatch() {
  const navigate = useNavigate()
  const goBack = useCallback(() => navigate(-1), [navigate])
  return (
    <div className={'flex flex-col justify-center items-center p-4'}>
      <p className={'text-xl p-4 mt-6 alert alert-info'}>Oops! No page found!</p>
      <button className={'btn btn-primary btn-xs mt-4'} onClick={goBack}>
        go back
      </button>
    </div>
  )
}
