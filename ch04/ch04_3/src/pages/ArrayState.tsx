import {useCallback, useMemo, useState} from 'react'
import * as D from '../data'
import {Title, Div} from '../components'
import {Icon} from '../theme/daisyui'

export default function ArrayState() {
  const [images, setImages] = useState<string[]>([])

  const addImage = useCallback(
    () => setImages(images => [D.randomImage(), ...images]),
    []
  )
  const clearImages = useCallback(() => setImages(notUsed => []), [])

  const children = useMemo(
    () =>
      images.map((image, index) => (
        <Div
          key={index}
          src={image}
          className={'w-1/5 m-2 bg-center'}
          height={'5rem'}
          minHeight={'5rem'}
        />
      )),
    [images]
  )

  return (
    <section className={'mt-4'}>
      <Title>ArrayState</Title>
      <div className={'flex justify-center mt-4'}>
        <div data-tip={'add image'} className={'tooltip'}>
          <Icon
            name={'add'}
            onClick={addImage}
            className={'mr-12 btn-primary'}
            iconClassName={'text-3xl'}
          />
        </div>
        <div data-tip={'clear image'} className={'tooltip'}>
          <Icon
            name={'clear_all'}
            onClick={clearImages}
            className={'mr-12 btn-primary'}
            iconClassName={'text-3xl'}
          />
        </div>
      </div>
      <div className={'flex justify-center flex-wrap mt-4'}>{children}</div>
    </section>
  )
}
