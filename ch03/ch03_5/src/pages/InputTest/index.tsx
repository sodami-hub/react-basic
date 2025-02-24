import Basic from './Basic'
import Color from './Color'
import Size from './Size'
import Border from './Border'

export default function inputTest() {
  return (
    <section className={'mt-4'}>
      <h2 className={'font-bold text-5xl text-center'}>inputTest</h2>
      <div className={'mt-4'}>
        <Size />
        <Border />
        <Color />
        <Basic />
      </div>
    </section>
  )
}
