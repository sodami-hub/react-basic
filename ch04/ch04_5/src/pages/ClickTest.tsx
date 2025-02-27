import {Title} from '../components'
import {useRef, useCallback} from 'react'
import {Button} from '../theme/daisyui'

export default function ClickTest() {
  const inputRef = useRef<HTMLInputElement>(null)
  const onClick = useCallback(() => inputRef.current?.click(), [])

  return (
    <section className={'mt-4'}>
      <Title>ClickTest</Title>
      <div className={'flex justify-center items-center mt-4'}>
        <Button className={'btn-primary mr-4'} onClick={onClick}>
          Click Me
        </Button>
        <input ref={inputRef} className={'hidden'} type={'file'} accept={'image/*'} />
      </div>
    </section>
  )
}
