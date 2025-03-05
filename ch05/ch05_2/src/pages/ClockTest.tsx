import {Title} from '../components'
import {useSelector, useDispatch} from 'react-redux'
import {useInterval} from '../hooks'
import type {AppState} from '../store'
import * as C from '../store/clock'

export default function ClockTest() {
  const clock = new Date(useSelector<AppState, C.State>(state => state.clock))
  const dispatch = useDispatch()
  // dispatch(액션) 이 호출되면 reducer(상태, 액션)를 통해서 상태(리덕스 저장소)로 전달됨.
  useInterval(() => dispatch(C.setClock(new Date().toISOString())))

  return (
    <section className={'mt-4'}>
      <Title>ClockTest</Title>
      <div className={'mt-4 flex flex-col items-center'}>
        <p className={'text-2xl text-blue-600 text-bold'}>{clock.toLocaleTimeString()}</p>
        <p className={'text-2xl text-blue-400 text-bold'}>{clock.toLocaleDateString()}</p>
      </div>
    </section>
  )
}
