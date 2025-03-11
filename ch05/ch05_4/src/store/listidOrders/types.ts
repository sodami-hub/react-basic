import type {Action} from 'redux'
import type {UUID} from '../commonTypes'
export * from '../commonTypes'

export type State = UUID[]

export type SetListidOrders = Action<'@listidOrders/set'> & {
  payload: State
}

export type AddListidToOrders = Action<'@listidOrders/add'> & {
  payload: UUID
}

export type RemoveListIdFromOrders = Action<'@listidOrders/remove'> & {
  payload: UUID
}

export type Actions = SetListidOrders | AddListidToOrders | RemoveListIdFromOrders
