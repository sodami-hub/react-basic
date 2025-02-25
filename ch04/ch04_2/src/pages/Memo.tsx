import {Title, Avatar} from '../components'
import * as D from '../data'
import {useMemo} from 'react'

export default function UseOrCreateTest() {
  const headTexts = useMemo<string[]>(
    () => ['NO.', 'NAME', 'JOB TITLE', 'EMAIL ADDRESS'],
    []
  )

  const users = useMemo<D.IUser[]>(() => D.makeArray(20).map(D.makeRandomUser), [])
  const head = useMemo<any>(
    () => headTexts.map(text => <th key={text}>{text}</th>),
    [headTexts]
  )
  const body = useMemo<any>(
    () =>
      users.map((user, index) => (
        <tr key={user.uuid}>
          <th>{index + 1}</th>
          <td className={'flex items-center'}>
            <Avatar src={'user.avatar'} size={'1.5rem'} />
            <p className={'ml-2'}>{user.name}</p>
          </td>
          <td>{user.jobTitle}</td>
          <td>{user.email}</td>
        </tr>
      )),
    [users]
  )
  return (
    <div className={'mt-4'}>
      <Title>CreateOrUseTest</Title>
      <div className={'mt-4 overflow-x-auto p-4'}>
        <table className={'table table-zebra table-compact w-full'}>
          <thead>
            <tr>{head}</tr>
          </thead>
          <tbody>{body}</tbody>
        </table>
      </div>
    </div>
  )
}
