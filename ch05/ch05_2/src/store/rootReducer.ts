import {combineReducers} from 'redux'
import * as Cards from './cards'
import * as Clock from './clock'
import * as R from './remoteUser'
import * as Counter from './counter'

export const rootReducer = combineReducers({
  clock: Clock.reducer,
  counter: Counter.reducer,
  remoteUser: R.reducer,
  cards: Cards.reducer
})
