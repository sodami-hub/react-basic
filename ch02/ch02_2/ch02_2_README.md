# 02-2 JSX 구문 이해하기
## 🎈React.createElement 호출의 복잡성 문제
```html
<ul>
    <li>
        <a href='http://www.google.com'>
            <p>go to google</p>
        </a>
    </li>
</ul>
```
위와 같은 코드를 React.createElement 호출로 구현하면 다음과 같다.
```typescript jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

const CE = React.createElement

const rootVirtualDOM = CE('ul', null,[
    CE('li', null, [
        CE('a',{href: 'http://www.google.com', target: '_blank'},[
            CE('p', null, 'go to google')
        ])
    ])
])
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(rootVirtualDOM)
```
React.createElement 는 가상 DOM 객체를 만들어 주는 함수이지만, HTML 요소가 부모/자식 관계로 구성되면 지나치게 복잡해지는 문제가 있다.
위의 코드의 19~25 행은 의미가 직관적으로 다가오지 않는다.<br>
리액트 팀은 이러한 React.createElement 호출의 복잡성을 해결하고자 자바스크립트 언어에 없는 JSX 기능을 언어 확장형태로 추가했다.
이 JSX 기능은 리액트 프레임워크가 널리 사용되게 하는 결정적인 역할을 했다.<br>
위의 코드를 JSX 버전으로 다시 작성하면 다음과 같다.
```typescript jsx
import React from 'react' // 리액트 17 이후 버전부터는 JSX가 있더라도 React 임포트 문을 생략할 수 있다.
import ReactDOM from 'react-dom/client'

const rootVirtualDOM = (
    <ul>
        <li>
            <a href="http://www.google.com">
                <p>go to google</p>
            </a>
        </li>
    </ul>
)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(rootVirtualDOM)
```

## 🎈JSX = JavaScript + XML
JSX는 'Javascript XML' 의 줄이말로 XML 구문에 자바스크립트 코드르 결합하는 용도로 만들어진 구문이다. 앞서 살펴본 것 처럼 JSX는 React.createElement
호출 코드를 간결하게 하려고 고안한 것으로, 자바스크립트 언어를 확장하는 방식으로 구현되었다.<br>
리액트 코드 작성자는 복잡한 React.createElement 호출 코드를 여러 번 작성하는 대신 훨씬 간결한 JSX 코드만 작성하면 되므로 생산성이 크게 향상된다.

### 🕸️XML 용어 알아보기
<img src="../../images/02-08.jpg" width="400" alt="">

시작 태그에는 id, style과 같은 속성(attribute)을 함께 기술할 수 있으며, 송성값은 항상 ''이나 ""로 감싸줘야 된다.<br>
또한 시작 태그와 끝 태그 사이에는 <h1>hello world</h1> 와 같은 자식 요소를 삽입할 수 있다. 만일 자식 요소가 문자열일 때는 따옴표를 생략한다.<br>
만일 자식 요소가 없다면 <요소명/> 형태로 표현할 수 있는데, 이를 스스로 닫는 태그(self-closing tag)라고 한다.

### 🕸XML(혹은 HTML5) 표준 준수
리액트에서 JSX 구문을 작성할 때는 XML 규약을 엄격하게 준수해야 한다. 예를들어 HTML4에 익숙한 개발자나 디자이너는 스스로 닫는 태그 형태를 지키지 않을 때가 종종 있다.
그런데 리액트의 JSX 구문 분석기는 이런 형태의 코드를 이해하지 못하므로 오류가 발생한다. 

또한 XML에 자바스크립트 코드를 삽입하려면 XML 문법에는 없는 기능이 필요하다. JSX는 다음 코드에서 보듯 XML 구조에 중괄호 {}를 사용하여 자바스크립트 코드를 감싸는 형태의 문법을 제공한다.
```typescript jsx
<p>
    {/* string must be wrapped by Text */}
</p>
```
이런 시긍로 XML에 자바스크립트 코드를 삽입할 수 있어서 자바스크립트 변수에 들어 있는 값을 XML 구문 안에 표현할 수 있다.
```typescript jsx
const hello = 'hello world';
<p>
    {hello}
</p>
```
그런데 JSX 구문에서 중괄호 안의 자바스크립트 코드는 반드시 return 키워드 없이 값만을 반환해야 된다. 
이처럼 return 키워드 없이 값을 반환하는 구문을 타입스크립트에서는 표현식이라고 한다.

## 🎈표현식과 실행문, 그리고 JSX
표현식(expression)이란 return 키워드 없이 어떤 값을 반환하는 코드를 뜻한다. 프로그래밍 언어에서 표현식이란 1, true, 'hello world!'처럼 값으로 평가되는 어떤 것이다.
즉, 표현식이란 1+1과 같은 코드 조각, 함수 호출로 반환되는 값 등 <b>값이 될 수 있는 모든 것을 의미한다</b>.<br>
표현식과 대비되는 개념은 실행문(execution statement)이다. 실행문은 그 자체로 값이 아니다. 예를들어 if 문을 JSX 코드 안에서 사용하면 오류가 발생한다.
switch-case, for 문 또한 실행문이므로 JSX 안에서 사용할 수 없다.<br>
즉, JSX 코드를 구성하는 한 줄 한 줄 모두 React.createElement 호출 코드로 변환되어야 한다.

## 🎈배열과 JSX 구문
JSX 구문은 React.createElement 함수 호출을 간결하게 할 목적으로 만들어졌다. 변수나 배열에 객체를 담을 수 있다.<br>
프로젝트의 src/index.tsx 코드는 JSX 문 3개를 children 배열에 담아 ul의 자식 컴포넌트로 렌더링한다.

### 🕸 배열을 JSX 문으로 만들 때 주의 상항
XML 문법에서 XML 요소는 부모 없이 존재할 수 없다. JSX 역시 XML 이므로 컴포너트 여러 개를 배열로 담은 children 변수가 부모 컴포넌트 없이 {children} 형태로 존재할 수 없다.

### 🕸 데이터 배열을 컴포넌트 배열로 만들기
src/index.tsx - Array 클래스가 제공하는 map 메서드로 내용이 조금씩 다른 컴포넌트의 배열로 만드는 예이다.<br>
그런데 웹 브라우저에선 정상적으로 보이지만, 개발자 도구의 Console 탭에는 경고 메시지가 출력된다. 원인과 해결 방법은 02-3 에서 알아보겠다.

<img src="../../images/02-09.jpg" alt="" width="340">

이 코드를 더 발전시켜 가짜 데이터 유틸리티 함수로 10개의 요소의 배열을 만들어서 렌더링 해보겠다.