## 가상 DOM 이해하기
#### src/index.tsx 살펴보기
```angular2html
// 리액트 18이후의 형태
import React from 'react'  // 개발과 직접 관련된 코드
import ReactDOM from 'react-dom/client' // 개발과 직접 관련된 코드
import './index.css'
import App from './App' // 개발과 직접 관련된 코드 
import reportWebVitals from './reportWebVitals'

// 개발과 직접 관련된 코드
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
) 
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

reportWebVitals()
```
- 8행의 App은 리액트 프레임워크에서 컴포넌트라고 한다.
- 12~19행은 리액트의 핵심 기능을 모두 보여준다.
- React.StrictMode는 코드가 잘못되었는지 판단하여 오류 메시지를 보여주는 컴포넌트이다.
- 마지막줄은 앱의 성능을 측정하는 기능으로, 리액트 개발과는 직접적인 관련이 없다.

- 아래는 리액트17버전의 index.tsx 이다.
```angular2html
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />,document.getElementById('root'))
```

- index.tsx 파일 내용이 아뀐것은 서버 쪽 렌더링 기능이 향상된 것과 관련이 있다.

#### react와 react-dom 패키지
<img src="../../images/02-01.jpg" alt="리액트 패키지 구조">
리액트 프로젝트는 항상 react와 react-dom패키지가 필요하다. react는 그림에서 보듯 리액트 앱이 동작하는 환경과 무관하게 공통으로 사용하는 기능을 제공하는 패키지이다.
반면에 react-dom/client를 비롯하여 react-dom/server, react-native 등 이른바 렌더러(renderer)라고 하는 패키지는 앱이 동작하는 환경(플랫폼)에 종속적인 기능을 제공하는 데 특화된 패키지이다.

그림을 보면 CSR(client side rendering)방식으로 동작하는 앱은 react와 react-dom/client 패키지 조합, SSR(server side rendering) 방식과, 모바일 앱이 어떤 조합으로 만들어지는지 볼 수 있다.
그리고 이 그림에서 react와 렌더러 패키지의 경계에는 가상 DOM이라는 메커니즘이 자리 잡고 있다. 가상 DOM의 의미를 알려면 먼저 XML 마크업 언어를 알아야 한다.

#### XML 마크업 언어

