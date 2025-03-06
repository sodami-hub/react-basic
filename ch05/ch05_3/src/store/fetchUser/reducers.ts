import * as T from './types'

const initialState: T.State = {
  email: '',
  name: {title: '', first: '', last: ''},
  picture: {large: ''}
}

export const reducer = (state: T.State = initialState, action: T.Actions) => {
  switch (action.type) {
    case '@fetchUser/setUser':
      return action.payload
    case '@fetchUser/changePicture':
      return {...state, picture: action.payload}
    case '@fetchUser/changeName':
      return {...state, name: action.payload}
    case '@fetchUser/changeEmail':
      return {...state, email: action.payload}
  }
  return state
}
