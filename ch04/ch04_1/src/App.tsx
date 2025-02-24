import {useClock} from './hooks'
import Clock from './pages/Clock'

export default function App() {
  const time = useClock()
  return <Clock today={time} />
}
