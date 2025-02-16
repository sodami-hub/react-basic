## 가상 DOM 이해하기
### 🎈src/index.tsx 살펴보기
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

### 🎈react와 react-dom 패키지
<img src="../../images/02-01.jpg" alt="리액트 패키지 구조">
리액트 프로젝트는 항상 react와 react-dom패키지가 필요하다. react는 그림에서 보듯 리액트 앱이 동작하는 환경과 무관하게 공통으로 사용하는 기능을 제공하는 패키지이다.
반면에 react-dom/client를 비롯하여 react-dom/server, react-native 등 이른바 렌더러(renderer)라고 하는 패키지는 앱이 동작하는 환경(플랫폼)에 종속적인 기능을 제공하는 데 특화된 패키지이다.

그림을 보면 CSR(client side rendering)방식으로 동작하는 앱은 react와 react-dom/client 패키지 조합, SSR(server side rendering) 방식과, 모바일 앱이 어떤 조합으로 만들어지는지 볼 수 있다.
그리고 이 그림에서 react와 렌더러 패키지의 경계에는 가상 DOM이라는 메커니즘이 자리 잡고 있다. 가상 DOM의 의미를 알려면 먼저 XML 마크업 언어를 알아야 한다.

### 🎈XML 마크업 언어
Jack이라는 이름과 32이라는 Jack의 나이라는 두 값의 연관성을 사람과 컴퓨터가 모두 알 수 있도록 다음과 같이 적을 수 있다. 다음과 같은 텍스트는
마크업 언어 가운데 가장 많이 사용하는 XML문서 규약을 적용하여 작성한 것이다.
```xml
<Person name="Jack" age="32"/>
```
웹 분야에서 문서(document)는 마크업 언어로 작성한 텍스트가 담긴 파일이나 인터넷 망을 통해 전송되는 스트림을 의미한다. 즉, XML 형식으로 작성한 문저열은 XML 문서,
HTML 형식으로 작성한 문자열은 HTML 문서라고 한다.<br>
XML이나 HTML 문서는 여러 가지 요소(element)로 구성된다. HTML 문서는 html,head,meta,body,div 등의 HTML 요소로 구성된다. 웹 브라우저는 HTML 문서의 요소를 트리 구조로 파악한다. 
HTML 문서의 트리구조에서 각 요소를 기준으로 자신보다 아래에 있으면 자식 요소, 위에 있으면 부모 요소라고 한다.<br>

<img src="../../images/02-02.jpg" alt="HTML 문서의 트리 구조" width="300" />
<img src="../../images/02-03.jpg" alt="" width="300">

### 🎈문서 객체 모델이란?
웹 브라우저는 HTML 형식의 문자열을 화면에 출력할 때 문자열을 분석(parsing)하여 특별한 형식의 자바스크립트 객체 조합으로 바꾼다.
이 특별한 형식의 자바스크립트 객체는 모두 자신의 특징에 맞는 인터페이스를 구현하는데, 이들 인터페이스를 총칭하여 문서 객체 모델(document object model, DOM) 이라고 한다.<br>
웹 브라우저의 자바스크립트 엔진은 window 라는 이름의 전역 변수를 기본으로 제공한다. 여기서 window는 웹 브라우저의 특정 웹 페이지를 의미하는 객체이다. 
window 객체는 Window타입 객체로서 Window타입을 브라우저 객체 모델(browser object model,BOM) 이라고 한다.<br>

<img src="../../images/02-04.jpg" alt="" width="300"/>

#### document 객체
웹 페이지가 HTML 문서를 화면에 출력할 때 window객체는 document 라는 이름의 속성 객체로 HTML 문서 기능을 사용할 수 있게 해준다.
HTML 문서의 html 요소는 오직 1개만 있어야 하므로, window.document(줄여서 document)는 html 요소를 의미한다.
#### document.head와 document.body 객체
HTML 문서의 html 요소는  head와 body 태그를 1개씩만 가질 수 있다. document 객체는 이런 조건에 맞추어 head 요소를 위미하는 head 속성 객체와
body 요소를 의미하는 body 속성 객체를 제공한다.
#### document.createElement 메서드
웹 브라우저는 DOM의 다양한 인터페이스를 각각의 목적에 맞게 구현한 객체로 생성할 수 있도록 document.createElement 메서드를 제공한다. 
이 메서드는 다음과 같은 형태로 사용할 수 있다.
```javascript
// let element = document.createElement(tagName[,options]); MDN 에서 발췌한 메서드 사용법

let newDiv = document.createElement("div")
```
#### HTMLElement 인터페이스
위의 예시에서 newDiv 변수의 타입은 무엇일까? HTMLElement 는 모든 종류의 HTML 요소가 구현하는 인터페이스이다.

<img src="../../images/02-05.jpg" alt="" width="600"/>

위의 그림에서 보듯 대부분 HTMLElement를 상속한 자신들의 인터페이스를 구현한다. 이 인터페이스의 상속 구조를 참고할 때 newDiv 객체의 타입은
HTMLDivElement 임을 알 수 있다.

#### HTMLElement의 부모 요소 상속 구조
HTMLElement 자체는 다음 그림에서 보듯이 부모 인터페이스 3개를 상속한다. 이 가운데 Node 타입을 살펴보겠다.

<img src="../../images/02-06.jpg" alt="" width="300"/>

HTMLElement의 부모 인터페이스인 Node는 appendChild 메서드를 제공한다. HTMLElement는 모든 HTML 태그의 부모 인터페이스이므로 모든 HTML 태그는 appendChild 메서드를 가진다.
다음은 MDN에서 발췌한 appendChild 사용법이다.
```javascript
let aChild = element.appendChild(aChild);
```
다음은 좀 더 구체적인 예이다. 자바스크립트로 HTML 요소를 웹 페이지에 나타나게 하려면 createElement와 appendChild 과정을 거쳐야한다.
```javascript
let p = document.createElement("p") // <p> element 생성
// <p> element 를 <body>의 마지막 자식 요소로 추가
document.body.appendChild(p)
```
위 코드에서 createElement가 HTML DOM 요소 객체를 생성해 주는 역할을 한다면, appendChild는 생성된 DOM 객체를 웹 브라우저 화면에 출력해 주는 역할을 한다.
여기서 DOM 객체를 웹 브라우저 화면에 나타나게 하는 것을 렌더링(rendering) 이라고 한다.<br>
실제로는 많은 DOM 객체가 한꺼번에 생성되고, 각각의 DOM 객체는 appendChild 호출을 거쳐 부모/자식 관계로 얽힌 거대한 트리 구조가 된다.
웹 브라우저에서는 이 DOM 객체들의 트리 구조를 DOM 트리라고 한다.

### 🎈자바스크립트만 사용하는 프런트엔드 개발(물리 DOM)
src/index.tx 파일 내용을 리액트와 상관없는 자바스크립트 코드만으로 구현한다. 

### 🎈리액트를 사용하는 프런트엔드 개발(가상 DOM)
react 패키지는 createElement라는 함수를 제공한다. 이 함수의 여러가지 정의 중 우리가 살펴볼 내용의 정의를 보면
```typescript jsx
function createElement<P extends {}>(
    type: FunctionComponent<P>| ComponentClass<P> | string,
    props?: Attributes & P | null,
...children: ReactNode[]
): FunctionComponentElement<P>;
```
첫 번째 매개변수 type의 타입은 FunctionComponent<P>, ComponentClass<P>, string 중에 하나일 수 있다.
두 번째 매개변수 props 변수 이름 뒤에 ?가 붙었으므로 생략할 수 있는 선택 배개변수(optional argument)이다.
따라서 <p> 요소를 생성하고 싶다면 'p' 문자열을 사용하면 된다.
```javascript
const p = React.createElement('p')
```
만일 <p>Hello world!</p> 형태의 HTML을 생성하려고 할 때 XML 구문에서 'Hello world!'는 유효한 HTML 요소이므로,
이 문자열은 <p> 요소의 자식 요소가 될 수 있다. 즉, 물리 DOM 버전을 리액트 프레임워크 사용 버전으로 다음과 같이 구현할 수 있다.
```javascript
const pVirtualDOM = React.createElement('p',null,'Hello world!')
```

#### root.render 메서드
물리 DOM 버전의 document.body.appendChild(pPhysicalDOM) 이 코드는 pPhysicalDOM 객체를 DOM 트리에 추가해 주며,
그 결과 pPhysicalDOM 객체가 화면에 나타난다.<br>
이 원리를 가상 DOM 버전에 적용해 보면 pVirtualDOM 은 생성됐지만 가상 DOM 트리에 추가되지 않았다. 
주의할 점은 pVirtualDOM 은 document.body.appendChild 가 이해할 수 있는 DOM 객체가 아니다.
따라서 pVirtualDOM 이 화면에 나타나려면 root.render 함수가 필요하다. 이 함수가 가상 DOM 을 물리 DOM 으로 전환해 준다.<br>
리액트에서 가상 DOM 객체의 렌더링은 react-dom 렌더러가 수행한다. root.render(pVirtualDOM) 부분이 가상 DOM 객체를 화면에 렌더링하려고 시도하는 부분이다.
그런데 root.render 메서드는 변환한 가상 DOM 객체를 부착할 물리 DOM 객체가 필요하다.<br>
src/index.html 파일에는 id 속성값이 root인 <div> 요소가 있는데, 리액트에서는 이 요소가 ReactDOM.createRoot 가 필요로 하는 역할을 수행한다.

#### document.getElementById 메서드
이 메서드는 이미 생성된 특정 물리 DOM 객체를 찾아주는 역할을 한다.

#### index.tsx 코드 의미 알아보기
```typescript jsx
const pVirtualDOM = React.createElement('p', null, 'Hello virtual DOM world!')
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
```
위 코드를 그림으로 표현하면 다음과 같다.

<img src="../../images/02-07.jpg" width="300" alt="">

리액트는 React.createElement 함수로 다양한 HTML 요소를 가상 DOM 트리 구조로 구현한 뒤, render 메서드가 호출되는 순간 이 가상 DOM 트리를 물리 DOM 트리로 변환해 준다.
처음에는 "왜 이렇게 복잡하게 구현할까?" 라는 의문이 생길 수 있다. 이 의문은 가상 DOM 트리가 물리 DOM 트리로 처음 바뀔 때, 즉 처음 렌더링될 때만을 생각하면 타당할 수 있다.
하지만 최초 렌더링 이후 가상 DOM 트리 구조에 변화가 생겨, 이 변화를 사용자에게 알리려고 다시 렌더링되는 상황을 생각하면 마음이 달라진다.<br>
예를 들어 <p>의 요소를 'Welcome to our site!'로 바꾼다고 생각해 보겠다. 이때는 가상 DOM 트리를 물리 DOM 트리로 변환하는 문제가 아니라,
이미 존재하는 물리 DOM 트리에 특정 HTML 요소의 속성값을 바꾸는 문제이다. 즉, 특정 HTML 요소의 DOM 객체를 찾아 해당 요소의 속성값(여기서는 innerText)을 변경하는 문제이다.<br>
이 문제를 일반화하여 "임의의 물리 DOM 트리에서 일부 HTML 요소의 속성값을 변경될 때 이를 탐지하여 DOM 트리에 반영할 수 있는가?"라는 문제로 바꿔 생각해보겠다.
이경우 물리 DOM 세계에서는 속성값을 바꿔야 되는 요소를 document.getElementById('아이디')로 찾아서 해당 요소의 DOM 객체를 얻은 뒤, DOM 객체가 제공하는 속성이나 메서드로 작업을 하면된다.<br>
하지만 문제는 '아이디' 부분에 있다. HTML 요소를 <p> 처럼 간결하게 사용하지 못하고, 항상<p id='아이디'> 형태로 id 속성을 명시해야 되고,
HTML 요소가 많아질수록 중복되지 않게 아이디값을 만드는 것도 쉽지 않다. 리액트는 가상 DOM 이라는 개념을 도입하여 이 아이디 문제를 해결하고 있다.
<br>
<br>
다음 절에서는 React.createElement 호출을 간소하게 해주는 JSX 구문을 알아보겠다.

