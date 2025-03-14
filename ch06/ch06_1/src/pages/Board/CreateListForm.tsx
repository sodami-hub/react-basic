import type {FC, ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {Icon} from '../../theme/daisyui'
import * as D from '../../data'
import {useNavigate} from 'react-router-dom'

export type CreateListFormProps = {
  onCreateList: (uuid: string, title: string) => void
}

const CreateListForm: FC<CreateListFormProps> = ({onCreateList}) => {
  const [value, setValue] = useState<string>(D.randomTitleText())
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(() => e.target.value)
  }, [])
  const addList = useCallback(() => {
    onCreateList(D.randomUUID(), value)
    setValue(() => D.randomTitleText())
  }, [value, onCreateList])

  const history = useNavigate()
  const goBack = () => history(-1)

  return (
    <div className={'flex justify-center p-2'}>
      <input
        placeholder={'title'}
        value={value}
        onChange={onChange}
        className={'input-xs input-bordered input input-primary'}
      />
      <Icon
        name={'add'}
        onClick={addList}
        disabled={!value.length}
        className={'ml-2 btn-primary btn-xs'}
      />
      <Icon
        name={'arrow_back'}
        className={'ml-4 btn-primary btn-xs'}
        iconClassName={'btn-sm'}
        onClick={goBack}
      />
    </div>
  )
}

export default CreateListForm
