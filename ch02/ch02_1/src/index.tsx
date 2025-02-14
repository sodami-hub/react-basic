import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
// import App from './App'
// import reportWebVitals from './reportWebVitals'
//
// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )
//
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()

// 물리 DOM - 자바스크립트의 프런트엔드 개발 방법
/*
let pPhysicalDOM = document.createElement('p')
pPhysicalDOM.innerText = 'Hello physical DOM world!'
document.body.appendChild(pPhysicalDOM)
*/

// 가상 DOM - 리액트 프레임워크 사용 버전
const pVirtualDOM = React.createElement('p', null, 'Hello virtual DOM world!')
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(pVirtualDOM) // 이 코드가 없으면 화면에 렌더링되지 않는다.
