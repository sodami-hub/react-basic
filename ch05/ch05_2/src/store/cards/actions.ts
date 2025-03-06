import type * as T from './types'

export const addCard = (payload: T.Card): T.AddCardAction => ({
  type: '@card/addCard',
  payload
})

export const removeCard = (payload: string): T.RemoveCardAction => ({
  type: '@card/removeCard',
  payload
})
