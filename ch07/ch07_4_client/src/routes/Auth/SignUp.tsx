/*
ChangeEvent 타입은 React 에서 폼 요소의 변경 이벤트를 처리할 때 사용되는 타입이다. 주로 input, select, textarea 등
의 값이 변경될 때 발생하는 이벤트를 나타낸다.
*/
import type {ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from '../../context'
import * as D from '../../data'

type SignUpFormType = Record<'email' | 'password' | 'confirmPassword', string>
const initialFormState = {email: D.randomEmail(), password: '1', confirmPassword: '1'}

export default function SignUp() {
  const [{email, password, confirmPassword}, setForm] =
    useState<SignUpFormType>(initialFormState)

  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const navigate = useNavigate()
  const {signup} = useAuth()
  const createAccount = useCallback(() => {
    console.log(email, password, confirmPassword)
    if (password === confirmPassword) {
      signup(email, password, () => navigate('/'))
    } else {
      alert('password is not equal to confirmPassword')
    }
  }, [email, password, confirmPassword, navigate, signup])

  return (
    <div
      className={
        'flex flex-col min-h-screen border-gray-200 rounded-xl shadow-xl bg-gray-100 border'
      }>
      <div
        className={
          'flex flex-col items-center justify-center flex-1 max-w-sm px-2 mx-auto'
        }>
        <div className={'w-full px-6 py-8 text-gray-400 bg-white rounded shadow-md'}>
          <h1 className={'mb-8 text-2xl text-center text-primary'}>Sign Up</h1>
          <input
            type={'text'}
            className={'w-full p-3 mb-4 input input-primary'}
            name={'email'}
            placeholder={'Email'}
            value={email}
            onChange={changed('email')}
          />
          <input
            type={'password'}
            className={'w-full p-3 mb-4 input input-primary'}
            name={'password'}
            placeholder={'Password'}
            value={password}
            onChange={changed('password')}
          />
          <input
            type={'password'}
            className={'w-full p-3 mb-4 input input-primary'}
            name={'confirm_password'}
            placeholder={'Confirm Password'}
            value={confirmPassword}
            onChange={changed('confirmPassword')}
          />
          <button
            type={'submit'}
            className={'w-full btn btn-primary'}
            onClick={createAccount}>
            CREATE ACCOUNT
          </button>
        </div>

        <div className={'mt-6 text-grey-800'}>
          Already have an account?
          <Link className={'btn btn-link btn-primary'} to={'/login/'}>
            LOG IN
          </Link>
        </div>
      </div>
    </div>
  )
}
