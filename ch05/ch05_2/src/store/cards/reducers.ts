import * as T from './types'

const initialState: T.State = []

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case '@card/removeCard':
      return state.filter(card => card.uuid !== action.payload)
    case '@card/addCard':
      return [...state, action.payload]
  }
  return state
}
