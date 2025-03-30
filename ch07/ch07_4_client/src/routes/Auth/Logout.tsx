import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {Modal, ModalContent, ModalAction} from '../../theme/daisyui'
import {useToggle} from '../../hooks'
import {useAuth} from '../../context'
import {Button} from '../../theme/daisyui'

export default function Logout() {
  const [open, toggleOpen] = useToggle(true)
  const navigate = useNavigate()
  const {logout} = useAuth()

  const onAccept = useCallback(() => {
    logout(() => {
      toggleOpen() // 대화상자 닫기
      navigate('/') // 메인 페이지로 이동
    })
  }, [logout, navigate, toggleOpen])

  const onCancel = useCallback(() => {
    toggleOpen() // 대화 상자 닫기
    navigate(-1) // 이전 페이지로 돌아감
  }, [navigate, toggleOpen])

  return (
    <Modal open={open}>
      <ModalContent
        className={'flex flex-col items-center justify-center'}
        closeIconClassName={'btn-primary btn-outline'}
        onCloseIconClicked={onCancel}>
        <p className={'text-xl text-center'}>Are u sure u want to log out?</p>
        <ModalAction>
          <Button className={'btn-primary btn-sm'} onClick={onAccept}>
            LOGOUT
          </Button>
          <Button className={'btn-secondary btn-sm'} onClick={onCancel}>
            CANCEL
          </Button>
        </ModalAction>
      </ModalContent>
    </Modal>
  )
}
