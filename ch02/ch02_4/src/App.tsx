import React, {use} from 'react'
import './App.css'

/*
export default function App() {
  const texts = [<p key={'1'}>hello</p>, <p key={'2'}>world</p>]
  // map 메서드를 사용한 방식
  const useMap = ['type', 'script'].map((text, index) => <p key={index}>{text}</p>)
  // children 을 사용하는 방식
  const useChildren = ['use', 'child'].map((text, index) => (
    <p key={index} children={text}></p>
  ))
  return (
    <div>
      {texts}
      {useMap}
      <div children={useChildren} />
    </div>
  )
}
*/

// P(P.tsx) 컴포넌트를 사용하는 방식  -> 이거 뭐지? 왜 쓰는건지 잘 모르겠네...
import P from './P'

export default function App() {
  const texts = ['hello', 'world!'].map((text, index) => (
    <P key={index} children={text} />
  ))
  return <div>{texts}</div>
}
