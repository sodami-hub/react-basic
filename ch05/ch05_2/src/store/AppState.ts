import * as Cards from './cards'
import * as Clock from './clock'
import * as R from './remoteUser'
import * as Counter from './counter'

export type AppState = {
  clock: Clock.State
  counter: Counter.State
  remoteUser: R.State
  cards: Cards.State
}
