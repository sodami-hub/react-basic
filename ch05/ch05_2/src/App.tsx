import {Provider as ReduxProvider} from 'react-redux'
import {useStore} from './store'

export default function App() {
  const store = useStore()
  // react-redux 버전8이 되면서 리액트 버전 18부터는 ReduxProvider에 반드시 1개 이상의 자식 요소를 가져야 한다.
  return (
    <ReduxProvider store={store}>
      <div />
    </ReduxProvider>
  )
}
