import React from 'react'
import logo from './logo.svg'
import './App.css'

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// 사용자 컴포넌트의 구현 index.tsx를 간결하게 함.
/*
export default function App() {
  return (
    <ul>
      <li>
        <a href="http://www.google.com">
          <p>go to google</p>
        </a>
      </li>
    </ul>
  )
}
*/

import {Component} from 'react'
// 클래스 컴포넌트 방식으로 구현하기
/*
export default class App extends Component<any, any> {
  render() {
    return (
      <ul>
        <li>
          <a href="http://www.google.com">
            <p>go google</p>
          </a>
        </li>
      </ul>
    )
  }
}
*/

// JSX 구문만으로는 부족한 로직 추가하기

/* // 첫번째 방법
export default class App extends Component<any, any> {
  render() {
    const isLoading = true
    if (isLoading) return <p>loading...</p>

    return (
      <ul>
        <li>
          <a href="http://www.google.com">
            <p>go google</p>
          </a>
        </li>
      </ul>
    )
  }
}
*/

//  두번째 방법 단축평가 형태로 구현하기
/*
export default class App extends Component<any, any> {
  render() {
    const isLoading = true
    const children = (
      <li>
        <a href="http://www.google.com">
          <p>go to gooooooogle</p>
        </a>
      </li>
    )
    return (
      <div>
        {isLoading && <p>loading...</p>}
        {!isLoading && <ul>{children}</ul>}
      </div>
    )
  }
}
 */

// 세번째 방법
/*
export default class App extends Component<any, any> {
  render() {
    const isLoading = true
    const children = isLoading ? (
      <p>loading ...</p>
    ) : (
      <ul>
        <li>
          <a href="http://www.google.com">
            <p>go to Google</p>
          </a>
        </li>
      </ul>
    )
    return <div>{children}</div>
  }
}
*/

// ClassComponent.tsx 를 사용하는 형태로 변경
/*
import ClassComponent from './ClassComponent'

export default class App extends Component<any, any> {
  render() {
    return (
      <ul>
        <ClassComponent />
        <ClassComponent />
      </ul>
    )
  }
}
*/

// 좀더 융통성 있는 코드
import ClassComponent from './ClassComponent'
import ArrowComponent from './ArrowComponent'

export default class App extends Component<any, any> {
  render() {
    return (
      <ul>
        <ClassComponent href={'http://www.google.com'} text={'go to Gooooogle'} />
        <ArrowComponent href={'http://www.naver.com'} text={'go to Naver'} />
      </ul>
    )
  }
}
