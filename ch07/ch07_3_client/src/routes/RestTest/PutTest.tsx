import {useState, useCallback} from 'react'
import {Button} from '../../theme/daisyui'
import {put} from '../../server'
import * as D from '../../data'
/*
Body 타입은 Record<'id' | string, any>로 선언되어 있습니다. 이는 id라는 필수 속성과 임의의 문자열 키를 가지는 객체를 나타낸다.
각 키의 값은 any 타입으로 설정되어 있어, 다양한 타입의 값을 가질 수 있습니다. 즉, Body 타입은 다음과 같은 형태의 객체를 의미한다. :
{
  id: any,
  [key: string]: any
}
*/
type Body = Record<'id' | string, any>

type Data = {
  ok: boolean
  body?: Body
  errorMessage?: string
}

export default function PutTest() {
  const [data, setData] = useState<Data | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const putTest = useCallback(() => {
    put('/test/1234', D.makeRandomCard())
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setErrorMessage(err.message))
  }, [])

  return (
    <div className={'mb-4'}>
      <div className={'flex justify-center mb-4'}>
        <Button onClick={putTest} className={'btn-primary'}>
          PUT ID:1234
        </Button>
      </div>
      <div className={'mt-4 text-center'}>
        <p>id : {data?.body?.id}</p>
        <p>data : {JSON.stringify(data, null, 2)}</p>
        {errorMessage && <p>error : {errorMessage} </p>}
      </div>
    </div>
  )
}
