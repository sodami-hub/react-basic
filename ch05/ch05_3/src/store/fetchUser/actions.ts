import type * as T from './types'
import {NameType, PictureType} from './types'

export const setUser = (payload: T.State): T.SetUserAction => ({
  type: '@fetchUser/setUser',
  payload
})

export const changeEmail = (payload: string): T.ChangeEmailAction => ({
  type: '@fetchUser/changeEmail',
  payload
})

export const changeName = (payload: NameType): T.ChangeNameAction => ({
  type: '@fetchUser/changeName',
  payload
})

export const changePicture = (payload: PictureType): T.ChangePictureAction => ({
  type: '@fetchUser/changePicture',
  payload
})
