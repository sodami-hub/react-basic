import {Button} from '../../theme/daisyui'

export default function Size() {
  return (
    <section className={'mt-4'}>
      <h2 className={'font-bold text-5xl text-center'}>Basic</h2>
      <div className={'mt-4 flex justify-evenly'}>
        <Button className={'btn-lg btn-primary'}>btn-lg</Button>
        <Button className={'btn-md btn-secondary'}>btn-md</Button>
        <Button className={'btn-sm btn-accent'}>btn-sm</Button>
        <Button className={'btn-xs btn-info'}>btn-xs</Button>
      </div>
    </section>
  )
}
