import type {Action} from 'redux'
import * as D from '../../data'

export type Card = D.ICard
export type State = Card[]

export type AddCardAction = Action<'@card/addCard'> & {
  payload: Card
}
export type RemoveCardAction = Action<'@card/removeCard'> & {
  payload: string
}

export type Actions = AddCardAction | RemoveCardAction
