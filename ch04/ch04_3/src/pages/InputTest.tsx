import {ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {Title} from '../components'
import {Input} from '../theme/daisyui'

export default function InputTest() {
  const [value, setValue] = useState<string>('')
  const [checked, setChecked] = useState<boolean>(false)

  const onChangeValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setValue(notUsed => e.target.value)
  }, [])
  const onChangeChecked = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.checked)
    setChecked(notUsed => e.target.checked)
  }, [])

  return (
    <section className={'mt-4'}>
      <Title>InputTest</Title>
      <div className={'mt-4 flex items-center justify-center p-4'}>
        <Input
          type={'text'}
          value={value}
          onChange={onChangeValue}
          className={'input-primary input-sm'}
        />
        <input
          type={'checkbox'}
          checked={checked}
          onChange={onChangeChecked}
          className={'ml-4 checkbox checkbox-primary input-sm'}
        />
      </div>
    </section>
  )
}
