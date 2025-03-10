import {useState, useCallback, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useToggle} from '../hooks'
import {Title, Avatar} from '../components'
import {Button} from '../theme/daisyui'
import * as D from '../data'
import type {AppState} from '../store'
import * as F from '../store/fetchUser'

export default function RemoteUserTest() {
  const dispatch = useDispatch()
  const {
    loading,
    errorMessage,
    fetchUser: user
  } = useSelector<AppState, AppState>(state => state)

  const getRemoteUser = useCallback(() => {
    dispatch<any>(F.getRemoteUser())
  }, [dispatch])

  const changeName = useCallback(() => {
    dispatch<any>(F.changeNameByFetching())
  }, [dispatch])

  const changeEmail = useCallback(() => {
    dispatch<any>(F.changeEmailByFetching())
  }, [dispatch])

  const changePicture = useCallback(() => {
    dispatch<any>(F.changePictureByFetching())
  }, [dispatch])

  const err = (len: number): boolean => {
    return len != 0
  }

  useEffect(getRemoteUser, [getRemoteUser])

  return (
    <section className={'mt-4'}>
      <Title>RemoteUserTest</Title>
      <div className={'flex justify-center mt-4'}>
        <Button className={'btn-sm btn-primary'} onClick={getRemoteUser}>
          GET REMOTE USER
        </Button>
        <Button className={'ml-4 btn-sm btn-accent'} onClick={changeName}>
          CHANGE NAME
        </Button>
        <Button className={'ml-4 btn-sm btn-success'} onClick={changeEmail}>
          CHANGE_EMAIL
        </Button>
        <Button className={'ml-4 btn-sm btn-secondary'} onClick={changePicture}>
          CHANGE PICTURE
        </Button>
      </div>
      {loading && (
        <div className={'flex items-center justify-center'}>
          <Button className={'btn-circle loading'}></Button>
        </div>
      )}
      {err(errorMessage.length) && (
        <div className={'p-4 mt-4 bt-red-300'}>
          <p className={'text-3xl text-red-800'}>error : {errorMessage}</p>
        </div>
      )}

      <div className={'flex justify-center mt-4 p-4'}>
        <Avatar src={user.picture.large} />
        <div className={'ml-4'}>
          <p className={'text-xl text-bold'}>
            {user.name.title}. {user.name.first}. {user.name.last}
          </p>
          <p className={'italic  text-gray-600'}>{user.email}</p>
        </div>
      </div>
    </section>
  )
}
