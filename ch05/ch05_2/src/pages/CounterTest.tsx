import {Subtitle, Title} from '../components'
import {useDispatch, useSelector} from 'react-redux'
import * as C from '../store/counter'
import {AppState} from '../store'
import {useCallback} from 'react'
import {Icon} from '../theme/daisyui'

export default function CounterTest() {
  const dispatch = useDispatch()

  // rootReducer와 AppState의 속성명을 같게 해야 된다.
  const counter = useSelector<AppState, C.State>(({counter}) => counter)
  const increase = useCallback(() => dispatch(C.increaseCounter()), [dispatch])
  const decrease = useCallback(() => dispatch(C.decreaseCounter()), [dispatch])

  return (
    <section className={'mt-4'}>
      <Title>CounterTest</Title>
      <div className={'mt-4 flex items-center justify-center text-blue-500 text-bold'}>
        <Icon name={'add_circle'} iconClassName={'text-3xl'} onClick={increase} />
        <Subtitle>{counter}</Subtitle>
        <Icon name={'remove_circle'} iconClassName={'text-3xl'} onClick={decrease} />
      </div>
    </section>
  )
}
