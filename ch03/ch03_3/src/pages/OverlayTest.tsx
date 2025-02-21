import {Title, Div, Icon, Overlay} from '../components'

export default function OverlayTest() {
  return (
    <section className={'mt-4'}>
      <Title>OverlayTest</Title>
      <Overlay opacityClass={'bg-black/70'}>
        <Div
          className={
            'relative flex items-center justify-center p-8 bg-white h-1/4 w-1/3'
          }>
          <Div className={'absolute'} right={'1rem'} top={'1rem'}>
            <Icon name={'close'} className={'text-gray-500'} />
          </Div>
          <p className={'text-5xl text-center'}>modal window</p>
        </Div>
      </Overlay>
    </section>
  )
}
