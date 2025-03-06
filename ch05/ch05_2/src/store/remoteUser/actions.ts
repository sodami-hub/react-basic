import type * as T from './types'
import {NameType, PictureType} from './types'

export const setUser = (payload: T.State): T.SetUserAction => ({
  type: '@remoteUser/setUser',
  payload
})

export const changeEmail = (payload: string): T.ChangeEmailAction => ({
  type: '@remoteUser/changeEmail',
  payload
})

export const changeName = (payload: NameType): T.ChangeNameAction => ({
  type: '@remoteUser/changeName',
  payload
})

export const changePicture = (payload: PictureType): T.ChangePictureAction => ({
  type: '@remoteUser/changePicture',
  payload
})
