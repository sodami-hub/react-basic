import {Input} from '../../theme/daisyui'

export default function Basic() {
  return (
    <section className={'mt-4'}>
      <h2 className={'font-bold text-5xl text-center'}>CopyMe</h2>
      <div className={'mt-4 flex justify-evenly'}>
        <input className={'input input-primary'} />
        <input className={'input-primary'} />
      </div>
    </section>
  )
}
