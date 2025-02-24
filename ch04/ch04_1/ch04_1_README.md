# 04-1 처음 만나는 리액트 훅
리액트 훅을 사용한 간단한 프로젝트를 만들어 보겠다. 리액트 훅과 커스텀 훅에 관해 알아본다.  
pages/Clock.tsx 파일에 코드를 작성한다. 이 Clock 컴포넌트는 Date 타입의 today 속성을 갖고 있다. Date는 자바스크립트 엔진이 기본으로 제공하는 날짜와 시간 타입이다.
그리고 현재 시각과 날짜는 toLocaleTimeString()과 toLocaleDateString() 메서드를 호출하면 알 수 있다.  
그리고 App.tsx 파일을 구현하고 실행하면 웹 브라우저에서 현재 시간과 날짜를 볼 수 있다. 하지만 현재는 앱이 실행된 시점의 시각만 보일 뿐,
시간이 겡신되지는 않는다. 이제 리액트 훈을 알아보면서 이 화면을 시계처럼 동작하게 만들어 보겠다.

## 🎈리액트 훅이란?
리액트 프레임워크는 2019년 2월 16.0.0 버전을 내놓으면서 리액트 훅이라는 혁신적인 기능을 선보였다. 리액트 훅은 다음 표에서 보듯 useState, useEffect 등
'use'라는 접두사가 들어가는 일련의 함수이다. 리액트 훅 함수는 반드시 함수 컴포넌트에서만 사용해야 한다.

<img src="../../images/04-01.jpg" width="300">
<img src="../../images/04-02.jpg" width="300">

## 🎈리액트 훅의 탄생 배경
리액트 버전 16.8.0 이전 버전에서 사용자 컴포넌트는 다음처럼 React.Component를 상속하고 render 메서드를 반드시 구현하는 클래스 기반 컴포넌트였다.
```typescript jsx
// 클래스 기반 컴포넌트 예
import React from 'react'
export default class MyComponent extends React.Component {
  render() {return <div/>}
}
```
그런데 클래스 컴포넌트는 클래스에 많은 기능이 숨어 있어 코드가 직관적이지 않다. 그리고 생명 주기 메서드가 많은 경우 각각의 의미와 정확한 구현 방법을 알기 어렵고,
컴포넌트에 구현한 일부 코드를 다른 컴포넌트를 구현할 때 재사용할 방법도 마땅치 않다.  
리액트 훅은 클래스 컴포넌트를 구현할 때 복잡함과 모호함을 극복할 목적으로 만들었다. 리액트 훅은 함수 컴포넌트에 다양한 기능을 구현할 수 있게 해준다.
따라서 리액트 프레임워크에서는 컴포넌트를 리액트 훅을 사용하는 함수 컴포넌트 형태로 구현할 것을 권장한다.

## 🎈리액트 훅 코드 패턴과 의존성 목록
리액트 훅 함수는 여러 가지 종류가 있지만 매개변수가 1개인 것과 2개인 것으로 나눌 수 있다.

<img src="../../images/04-03.jpg" width="500">

매개변수가 1개인 훅 함수들은 다음과 같은 코드 패턴을 공통으로 사용한다.
```
훅_함수<값의_타입>(값)

// 매개변수가 1개인 useRef 훅을 사용하는 예. Date클래스는 자바 스크립트 엔진이 기본 제공한다. 
const today: Date = useRef<Date>(new Date)
// -> 타입스크립트의 타입 추론 기능을 활용한 타입 부분 생략한 형태
const today = useRef(new Date)
```
만일 값이 null일 수 있을 때는 값 타입에 합집합을 나타내는 | 구문을 사용한 다음 패턴을 사용한다.
```
//null 허용 훅 함수 사용 패턴
훅_함수<값_타입 | null>(값)
```
매개변수가 2개인 훅 함수들은 다음과 같은 코드 패턴을 공통을 사용한다. 요기서 의존성 목록은 콜백 함수에서 사용되는 변수나 함수의 값이 일정하지 않고 수시로 변할 수 있을 때,
해당 변수나 함수를 아이템으로 갖는 배열을 의미한다. 리액트 프레임워크는 의존성 목록에 있는 아이템 중 하나라도 변화가 있으면 콜백 함수를 새로 고침해 변한 값을 콜백 함수에 반영해준다.
```
//매개변수 2개인 훅 함수 코드 패턴
훅_함수<값의_타입)(콜백_함수, 의존성_목록)

// 매개변수가 2개인 useEffect 훅은 사용하는 예, 콜백 함수를 가장 간단한 형태인 ()=>{} 로 구현했고, 의존성 목록은 배열이어야 하므로 빈 배열 []을 사용함
// 의존성 목록이 빈 배열일 때 콜백 함수는 한 번만 실행된다.

useEffect(()=>{}, [])
```

## 🎈setInterval API로 시계 만들기
자바스크립트 언어는 setInterval이라는 API를 기본으로 제공한다. 이 API는 갱신 주기때마다 콜백 함수를 계속 호출한다.
```
// setInterval 사용법
const id =setInterval(콜백_함수, 갱신_주기)
콜백_함수 = () => {}
```
setInterval API 는 id 값을 반환하는ㄷ ㅔ더 이상 setInterval을 호출하지 않으려면 다음처럼 기본으로 제공하는 clearInterval API를 호출하면 된다.
여기서 주의할 점은 setInterval은 시스템 메모리 자원을 사용하므로, setInterval 콜백 함수가 동작하지 않게 할 때, 반드시 clearInterval 함수를 호출하여
메모리 누수가 생기지 않게 해야 한다.
```
//setInterval 콜백 함수를 멈추게 하는 clearInterval() 함수
clearInterval(id)
```
다음은 setInterval을 사용해 시계를 만드는 코드이다.
```typescript
let today = new Date()
  const duration = 1000
  const id = setInterval(() => {
    today = new Date()
    // forceUpdate() 갱신된 시각이 웹 화면에 반영되도록, App 을 다시 렌더링하기위한 가상의 함수
  }, duration)
```
App 컴포넌트가 갱신한 시각을 화면에 반영하려면 개념적으로 위와같은 코드가 필요하다. 그런데 이 코드는 App이 다시 렌더링 될 때마다 매변 setInterval 호출이 발생하는
심각한 문제가 있다. 즉, setInterval 쪽 코드는 컴포넌트가 처음 렌더링 될 때 한 번만 호출되어야 하는데, useEffect 훅 함수가 이 목적에 부합한다.

## 🎈useEffect 훅 사용하기
useEffect 훅을 사용하려면 일단 다음 코드를 작성해야 한다.
```
import {useEffect} from 'react'

// 사용법. useEffect는 의존성 목록에 있는 조건 중 어느 하나라도 충족되면 그때마다 콜백 함수를 다시 실행한다.
useEffect(콜백_함수, 의존성_목록)
```
컴포넌트가 생성될 때 한 번만 실행하게 하려면 의존성 목록을 빈배열([])로 만들면 된다. 의존성 목록이 단순히 []일 때 useEffect는 첫 번째 매개변수의
콜백 함수를 한 번만 실행한다.  
다음 코드는 useEffect의 콜백 함수에서 setInterval 함수를 호출한다. 현재 의존성 목록이 []이므로 setInterval은 컴포넌트가 생성될 때 처음 한 번만 실행된다.

```typescript jsx
// setInterval 함수를 한 번만 호출하는 useEffect훅 사용법
export default function App() {
  let time = new Date()
  useEffect(() => {
    const id = setInterval(()=> {
      time=new Date()
    }, 1000)
  }, [])
  return <></>
}
```
그런데 useEffect는 다음처럼 함수를 반환할 수 있다.

```typescript jsx
useEffect(()=> {
  // 컴포넌트가 생성될 때 실행
  return ()=> {} // 컴포넌트가 소멸할 때 한 번 실행
},[])
```
다음 코드는 setInterval 함수를 호출하려고 App 컴포넌트에서 useEffect 훅을 사용하는 초기 모습니다. 이 코드 패턴은 useEffect뿐만 아니라 나머지 리액트 훅 함수를 사용할 때도 똑같이 적용할 수 있다.
App.tsx 를 열고 작성한다. 다만 이 코드는 화면이 자동으로 갱신하지 않는 버그가 있다.  
setInterval 콜백 함수 안에서는 time 변수가 정상적으로 갱신되고 있는데도 웹 브라우저 화면은 이를 반영하지 못하고 있다.
그리고 이 현상은 리액트의 경고 메시지와 연관이 있는 듯하다(사실 내 개발 환경에서는 경고 메시지가 없다.). useRef 훅을 사용해보겠다.

## 🎈useRef 훅 사용하기
기본 앱 파일에서 today 변숫값을 useRef 훅으로 설정한다. 이 코드의 의미는 04-5 에서 알아보겠다. 이제 경고 메시지는 사라지지만 웹 페이지에는 today 값이 반영되지 않고 있다.
그 이유는 useRef 훅은 컴포넌트를 다시 렌더링하지 않기 때문이다. 이제 useRef와 유사하지만 컴포넌트를 다시 렌더링해 주는 useState 훅을 사용해보겠다.

## 🎈useState 훅 사용하기
useState 훅은 다음처럼 사용한다. useState가 반환하는 세터(setter)는 현재 값이 변경되면 자동으로 해당 컴포넌트를 다시 렌더링하는 기능이 있다.
```
// useState 사용법
const [현재_값, 세터] = useState(초기값)
세터 = (새로운_값) => void
```

다음 코드에서 useState 훅을 사용해 현재 시각 time과 이 값을 변경하는 setToday() 함수를 얻고 있다. 그런 다음 useEffect의 콜백 함수 내부에 있는 setInterval의 콜백 함수에서
1초 간격으로 계속 setToday(new Date())를 호출해 현재 시각 today값을 변경하고 있다. 이처럼 useState가 반환한 setToday() 함수는 현재 값인 today가 변경되면
컴포넌트를 자동으로 다시 렌더링하는 기능이 있따. 이제 웹 브라우저에서 1초 간격으로 갱신하는 시계 앱을 볼 수 있을 것이다.

## 🎈 커스텀 훅이란?
리액트 훅은 여러 훅 함수를 조합해 마치 새로운 함수가 있는 것처럼 만들 수 있는데, 이렇게 조합한 새로운 훅 함수를 커스텀 훅이라고 한다.
커스텀 훅은 리액트 훅뿐만 아니라 기존에 제작한 커스텀 훅 함수를 사용해서 만들 수도 있다. 커스텀 훅 함수는 '훅'이라는 의미를 강조하고자 함수 이름에 'use'라는 접두어를 붙여서 만든다.
이제 useInterval과 useClock이라는 2개의 커스텀 훅 함수를 만들어 보겠다.  
src/hooks 디렉터리를 생성하고 index.ts, useInterval.ts, useClock.ts 파일을 생성한다. useInterval.ts 파일에 앞서 작성한 useEffect 훅 함수 패턴을 참고해 useInterval, useClock 커스텀 훅 함수를 구현하고
index.ts 파일에 반영한다.  
마지막으로 앞서 작성한 useClose 함수를 App.tsx 파일에 적용한다. 이제 App 컴포넌트는 useClock 함수 덕분에 매우 간결해졌다.

## 🎈 리액트 훅 함수의 특징
1. 같은 리액트 훅을 여러 번 호출할 수 있다.
2. 함수 몸통이 아닌 몸통 안 복합 실행문의 {} 안에서 호출할 수 없다.
3. 비동기 함수를 콜백 함수로 사용할 수 없다.
  
이러한 특징을 차례로 살펴보겠다. 다음 코드는 useState 훅을 2번, useEffect 훅을 2번 호출한다. 리액트 훅은 이처럼 똑같은 이름의 훅 함수를 각기 다른 목적으로 여러 번 호출할 수 있으며,
이는 함수 컴포넌트를 구현할 때 매우 자연스러운 코드 패턴이다.

```typescript jsx
import {useState} from "react";

export default function App() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  
  useEffect(()=>{},[])
  useEffect(() => {}, []);
}
```
  
다음 코든느 함수 컴포넌트 몸통 안의 {} 블록 안에서 useState 훅을 호출한다. 이때 x, setX는 지역 변수가 되어 {} 블록 안에서만 유효하므로 코드를 이렇게 작성하면 안된다.
이는 훅 함수 몸통에서 훅 함수를 호출하는 것도 마찬가지이다.

```typescript jsx
// 지역 변수 블록 안에서 호출 1.
export default function App() {
  { // 지역 변수 블록
    const [x, setX] = useState<number>(0) // 이렇게 구현하면 안 됨
  }
}

// 지역 변수 블록 안에서 호출 2.
export default function App() {
  if (true) { // 지역 변수 블록, if문, for문 도 지역변수 블록이다.
    const [x, setX] = useState<number>(0) // 이렇게 구현하면 안 됨
  }
}
```
  
마지막으로 리액트 훅 함수는 비동기 콜백 함수를 입력받을 수 없다. 즉, 다음 코드는 useEffect의 매개변수 콜백 함수에 async 키워드가 붙었으므로 불가능하다.
```typescript jsx
export default function App() {
  useEffect(async () => {
    await Promise.resolve(1)
  }, [])
}
```
