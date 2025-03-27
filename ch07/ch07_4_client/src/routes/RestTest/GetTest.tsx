import {useState, useCallback} from 'react'
import {Button} from '../../theme/daisyui'
import {get} from '../../server'

export default function GetTest() {
  const [data, setData] = useState<object>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /*
  useEffect(() => {
    fetch('http://localhost:4000/test')
      .then(res => res.json()) // res는 Response 객체이고, res.json()은 JSON 데이터를 반환합니다.(다음 then 구문으로)
      .then(data => setData(data)) // data는 JSON 데이터입니다.
      .catch(error => setErrorMessage(error.message))
  }, [])
*/

  const getAllTest = useCallback(() => {
    get('/test')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setErrorMessage(err.message))
  }, [])
  const getOneTest = useCallback(() => {
    get('/test/1234')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => setErrorMessage(err.message))
  }, [])

  return (
    <div>
      <div className={'my-4'}>
        <div className={'flex justify-center mb-4'}>
          <Button onClick={getAllTest} className={'btn-primary mr-12'}>
            GET ALL
          </Button>
          <Button onClick={getOneTest} className={'btn-primary'}>
            GET ID:1234
          </Button>
        </div>
        <div className={'mt-4 text-center'}>
          <p> data : {JSON.stringify(data, null, 2)}</p>
          {errorMessage && <p>error : {errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}
