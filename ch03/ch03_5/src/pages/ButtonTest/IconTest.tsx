import {Icon} from '../../theme/daisyui'

export default function IconTest() {
  const onclick = () => alert('Icon clicked')
  return (
    <section className={'mt-4'}>
      <h2 className={'font-bold text-5xl text-center'}>IconTest</h2>
      <div className={'flex items-center justify-around mt-4'}>
        <Icon
          className={'btn btn-primary btn-lg'}
          iconClassName={'text-5xl'}
          name={'settings'}
          onClick={onclick}
        />
        <Icon
          className={'btn btn-primary btn-md'}
          iconClassName={'text-3xl'}
          name={'done'}
          onClick={onclick}
        />
        <Icon
          className={'btn btn-primary btn-sm'}
          iconClassName={'text-xl'}
          name={'menu'}
          onClick={onclick}
        />
        <Icon className={'btn-success btn-xs'} name={'file_upload'} onClick={onclick} />
      </div>
    </section>
  )
}
