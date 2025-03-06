import type {Action} from 'redux'
import * as D from '../../data'

export type State = D.IRandomUser

export type SetUserAction = Action<'@fetchUser/setUser'> & {
  payload: D.IRandomUser
}
export type ChangeEmailAction = Action<'@fetchUser/changeEmail'> & {
  payload: string
}

export type NameType = {
  title: string
  first: string
  last: string
}
export type ChangeNameAction = Action<'@fetchUser/changeName'> & {
  payload: NameType
}

export type PictureType = {large: string}
export type ChangePictureAction = Action<'@fetchUser/changePicture'> & {
  payload: PictureType
}

export type Actions =
  | SetUserAction
  | ChangeEmailAction
  | ChangeNameAction
  | ChangePictureAction
