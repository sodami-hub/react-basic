import {Div} from '../../components'
import {useMemo} from 'react'
import CustomerComment from './CustomerComment'
import * as D from '../../data'

export default function Promotion() {
  const comments = useMemo(() => D.makeArray(3).map(D.makeRandomCustomerComment), [])
  const children = useMemo(
    () =>
      comments.map(comment => (
        <CustomerComment customerComment={comment} key={comment.uuid} />
      )),
    [comments]
  )

  return (
    <section className={'mt-4'}>
      <h2 className={'ml-4 text-5xl font-bold'}>What our customer says:</h2>
      <div className={'flex justify-center w-full p-4'}>
        <Div
          width={'15%'}
          minWidth={'15%'}
          className={'flex items-center justify-center text-white bg-primary'}>
          Your message here
        </Div>
        <div className={'flex flex-wrap justify-center p-4 mt-4'}>{children}</div>
        <Div
          width={'15%'}
          minWidth={'15%'}
          className={'flex items-center justify-center text-white bg-primary'}>
          Your advertisement here
        </Div>
      </div>
    </section>
  )
}
