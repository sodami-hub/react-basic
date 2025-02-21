import {Title, Div, Subtitle} from '../components'
import * as D from '../data'

const src = D.randomImage(1200, 400)
export default function BackgroundImageTest() {
  return (
    <section className={'mt-4'}>
      <Title>BackgroundImageTest</Title>
      <Div className={'mt-4 b-gray-300 h-80 bg-cover'} src={src}>
        <Subtitle className={'text-gray-500'}>Some Text here</Subtitle>
      </Div>
    </section>
  )
}
