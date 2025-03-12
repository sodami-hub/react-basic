import {Title} from '../../components'
import {useMemo} from 'react'
import CreateListForm from './CreateListForm'

import BoardList from '../BoardList'

import {useLists} from '../../store/useLists'

export default function Board() {
  const {lists, onCreateList, onRemoveList} = useLists()

  // 예는 useMemo를 사용해서 만들어진 요소들의 배열
  const children = useMemo(
    () =>
      lists.map(list => (
        <BoardList key={list.uuid} list={list} onRemoveList={onRemoveList(list.uuid)} />
      )),
    [lists, onRemoveList]
  )

  // 예는 함수...
  // const children = () =>
  //   lists.map(list => (
  //     <BoardList key={list.uuid} list={list} onRemoveList={onRemoveList(list.uuid)} />
  //   ))

  return (
    <section className={'mt-4'}>
      <Title>Board</Title>
      <div className={'flex justify-center mb-4'}>
        <p className={'label text-xs font-bold text-gray-300'}>새로운 목록 생성</p>
        <CreateListForm onCreateList={onCreateList} />
      </div>
      <div className={'flex flex-wrap justify-center items-center p-2 mt-4'}>
        {children}
      </div>
    </section>
  )
}
