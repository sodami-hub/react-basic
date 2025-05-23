import {useRef, useCallback} from 'react'
import {Title} from '../components'
import type {ValidatableInputMethods} from '../theme/daisyui'
import {ValidatableInput, Button} from '../theme/daisyui'

export default function ValidatableInputTest() {
  const methodsRef = useRef<ValidatableInputMethods>(null)

  const validateEmail = useCallback(() => {
    if (methodsRef.current) {
      const [valid, valueOrErrorMessage] = methodsRef.current.validate()
      if (valid) alert(`${valueOrErrorMessage}는 유효한 이메일 주소입니다.`)
      else alert(valueOrErrorMessage)
    }
  }, [])

  return (
    <section className={'mt-4'}>
      <Title>ValidatableInputTest</Title>
      <div className={'flex justify-center mt-4'}>
        <div className={'flex flex-col w-1/3 p-2'}>
          <ValidatableInput type={'email'} ref={methodsRef} className={'input-primary'} />
          <Button onClick={validateEmail} className={'mt-4 btn-primary'}>
            VALIDATE
          </Button>
        </div>
      </div>
    </section>
  )
}
