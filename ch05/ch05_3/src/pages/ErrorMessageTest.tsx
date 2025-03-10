import {useCallback} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import type {AppState} from '../store'
import {Title} from '../components'
import {Button} from '../theme/daisyui'
import * as E from '../store/errorMessage'
import * as D from '../data'

export default function ErrorMessageTest() {
  const dispatch = useDispatch()
  const errorMessage = useSelector<AppState, E.State>(({errorMessage}) => errorMessage)

  const generateError = useCallback(() => {
    dispatch<any>(E.generateErrorMessage(D.randomSentence(7)))
  }, [dispatch])

  const err = (len: number): boolean => {
    return len != 0
  }

  return (
    <section className={'mt-4'}>
      <Title>ErrorMessageTest</Title>
      <div className={'mt-4'}>
        <div className={'flex justify-center mt-4'}>
          <Button className={'btn-sm btn-primary'} onClick={generateError}>
            Gen Error MSG
          </Button>
        </div>
        {err(errorMessage.length) && (
          <div className={'flex justify-center items-center'}>
            <p className={'text-2xl text-red-600 text-bold'}>error: {errorMessage}</p>
          </div>
        )}
      </div>
    </section>
  )
}
