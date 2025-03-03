import ReduxClock from './pages/ReduxClock'
import UseReducerClock from './pages/UseReducerClock'

import {Provider as ReduxProvider} from 'react-redux'
import type {Action} from 'redux'
import {configureStore} from '@reduxjs/toolkit'

type AppState = {
  today: Date
}

const initialAppState = {
  today: new Date()
}

const rootReducer = (state: AppState = initialAppState, action: Action) => state
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware()
})

export default function App() {
  return (
    <ReduxProvider store={store}>
      <main className={'p-8'}>
        <UseReducerClock />
        <ReduxClock />
      </main>
    </ReduxProvider>
  )
}
