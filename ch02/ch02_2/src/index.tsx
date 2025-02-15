import React from 'react'
import ReactDOM from 'react-dom/client'
import * as D from './data'

// 배열과 JSX 구문
/*
const children = [
  <li>
    <a href="http://www.google.com" target="_blank">
      <p>go to google</p>
    </a>
  </li>,
  <li>
    <a href="http://www.daum.net" target="_blank">
      <p>go to daum</p>
    </a>
  </li>,
  <li>
    <a href="http://www.naver.com" target="_blank">
      <p>go to naver</p>
    </a>
  </li>
]
const rootVirtualDOM = <ul>{children}</ul>

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(rootVirtualDOM)
*/

// 데이터 배열을 컴포넌트 배열로 만들기
/*
const children = [0, 1, 2].map((n: number) => <h3>Hello world! {n}</h3>)
const virtualDOM = <div>{children}</div>

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(virtualDOM)
*/

// 가짜 데이터 유틸리티 함수로 10개의 요소의 배열을 만들어서 렌더링

const child = D.makeArray(10).map((notUsed, index) => (
  <div key={index}>
    <p>{D.randomId()}</p>
    <p>{D.randomName()}</p>
    <p>{D.randomJobTitle()}</p>
    <p>{D.randomSentence()}</p>
    <p>{D.randomSentence()}</p>
    <img src={D.randomImage()} width={280} height={250} />
  </div>
))

const rootVirtualDOM = <div>{child}</div>

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(rootVirtualDOM)
