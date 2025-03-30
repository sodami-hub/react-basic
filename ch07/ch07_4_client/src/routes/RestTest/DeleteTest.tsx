import {useState, useCallback} from 'react'
import {Button} from '../../theme/daisyui'
import {del} from '../../server'
import {useAuth} from '../../context'

export default function DeleteTest() {
  const [data, setData] = useState<object>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const {jwt} = useAuth()
  const deleteTest = useCallback(() => {
    del('/test/1234', jwt)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setErrorMessage(err.message))
  }, [])

  return (
    <div className={'my-4'}>
      <div className={'flex justify-center mb-4'}>
        <Button onClick={deleteTest} className={'btn-primary'}>
          DELETE ID:1234
        </Button>
      </div>
      <div className={'mt-4 text-center'}>
        <p>data : {JSON.stringify(data, null, 2)}</p>
        {errorMessage && <p>error : {errorMessage} </p>}
      </div>
    </div>
  )
}
