# 04-4 useEffect와 useLayoutEffect 훅 이해하기
이 절에서는 컴포넌트 생명 주기와 관련이 있는 useEffect와 useLayoutEffect 훅을 알아본다.

## 🎈컴포넌트의 생명 주기란?
리액트 프레임워크는 컴포넌트를 생성하고 렌더링하다가 어떤 시점이 되면 소멸한다. 이러한 과정을 컴포넌트의 생명 주기라고 표현한다.
컴포넌트의 생명 주기는 클래스 컴포넌트가 더 직관적이므로 클래스 컴포넌트로 시계를 만들면서 리액트 컴포넌트의 생명 주기에 관해 알아보겠다.

## 🎈클래스 컴포넌트에서 상태 구현하기
/src/pages/ClassLifecycle.tsx 파일에 코들르 작성한다. 이 코드는 현재 today 변숫값을 컴포넌트의 상태로 만들어야 한다.  
클래스 컴포넌트에서 상태는 항상 state 라는 이름의 멤버 속성으로 구현해야 한다는 제약 조건이 있다. 다음 코드에서는 state 속성에
다시 today 멤버 속성을 만들고 초깃값을 설정해 제약 조건을 만족하게 한다. 그리고 render() 메서드에서 this.state.today 형태로
today 멤버 속상값을 얻을 수 있는데, 객체에 적용하는 비구조화 할당 구문을 사용해 의미를 좀 더 분명하게 했다.

```typescript jsx
export default class ClassLifecycle extends Component {
  state = {
    // 상태를 구성하는 속성 나열
    today: new Date
  }
  render() {
    const {today} = this.state
  }
}
```

### 🕸️컴포넌트 마운트
리액트 컴포넌트는 가상 DOM 객체 형태로 생성되어 어떤 시점에 물리 DOM 트리의 멤버 객체가 되며, 이 과정에서 처음 렌더링이 일어나는데
이 시점을 컴포넌트가 마운트되었다고 표현한다. 즉, 가상 DOM 객체가 물리 DOM 객체로 바뀌는 시점을 마운트되었다고 표현한다.  
리액트는 클래스 컴포넌트가 componentDidMount() 라는 메서드를 가지면 마운트되는 시점에 이 메서드를 호출한다. 다음 코드에서는 컴포넌트가
마운트되는 시점에 시계를 만들고자 componentDidMount() 메서드에서 setInterval() 함수를 호출했다.
```typescript jsx
// 컴포넌트가 마운트될 때 시계 만들기
export default class ClassLifecycle extends Component {
  componentDidMount() {
    const duration = 1000
    const intervalId = setInterval((콜백_함수), duration)
  }
  ... (생략) ...
}
```
이제 콜백 함수를 구현해야 하는데, 이때 모든 클래스 컴포넌트의 부모 클래스인 Component 클래스가 제공하는 setState() 메서드가 필요하다.

### 🕸️setState() 메서드
Component 클래스는 다음과 같은 setState() 메서드를 제공한다.
```typescript jsx
setState<K extends keyof S>(
  state: ((prevState: Readonly<S>, props: Readonly<P>) => 
  Pick<S, K> | S | null) | (Pick<S, K> | S | null),
  callback?: () => void): void;
```
정의가 무척 복잡해 보이지만 보통은 다음처럼 호출한다.
```typescript jsx
const id = setInterval(콜백_함수, 간격)
this.setState({intervalId:id})
```
물론 속성 이름과 값의 변수 이름이 같을 때는 다음과 같이 사용할 수 있다.
```typescript jsx
const intervalId = setInterval(콜백_함수, 간격)
this.setState({intervalId})
```
setState() 는 클래스가 state 라는 이름의 멤버 속성을 가지고 있다는 가정으로 설계된 메서드이다. 앞서 클래스 컴포넌트가 상태를 가지려면
반드시 state라는 멤버 속성이 있어야 한다고 한 이유는 setState() 메서드가 이런 방식으로 구현됐기 때문이다.  
다음 코드는 컴포넌트가 마운트되는 시점에 setInterval()을 호출해 1초마다 this.state.today 값을 현재 시각으로 바꿔준다. 즉, 시계를 구현한 것이다.
```typescript jsx
export default class ClassLifecycle extends Component {
  state = {
    today:new Date(),
    IntervalId: null as unknown as NodeJS.Timer  // 타입스크립트가 요구하는 방식
  }
  componentDidMount() {
    const duration = 1000
    const intervalId = setInterval(()=>this.setState({today:new Date()}), duration)
    this.setState({intervalId})
  }
}
```

### 🕸️클래스 컴포넌트의 언마운트
컴포넌트가 생성되고 마운트되어 웹 페이지에 나타난 후 어떤 시점이 되면 컴포넌트는 소멸한다. 리액트에서는 컴포넌트가 물리 DOM 객체로 있다가
소멸하는 것을 언마운트되었다고 표현한다. 그리고 리액트는 클래스 컴포넌트가 componentWillUnmount() 메서드를 구현하고 있으면
언마운트가 일어나기 직전에 이 메서드를 호출한다.  
앞선 코드에서 componentDidMount() 메서드에서 setInterval() 함수를 호출했는데, setInterval()은 더 이상 사용하지 않으면 반드시
clearInterval() 함수가 호출될 거라는 전제로 설계됐습니다. 만일 clearInterval() 을 호출하지 않으면 메모리 누수가 발생한다.  
다음은 언마운트되기 직전에 clearInterval() 을 호출해 메모리 누수가 발생하지 않게 하는 코드이다.
```typescript jsx
componentWillUnmount() {
  clearInterval(this.state?.intervalId)
}
```
지금까지의 내용을 종합해서 ClassLifecycle.tsx 파일에 코드를 작성한다.

## 🎈useLayoutEffect 와 useEffect 훅 알아보기
react 패키지는 useEffect 와 useLayoutEffect 훅을 제공한다. 두 훅은 다음처럼 사용법이 같으며 콜백 함수는 훅이 실행될 때 처음 한 번은 반드시 실행된다.
이런 특징 때문에 의존성 목록이 빈 배열 [] 일지라도 한 번은 콜백 함수를 호출한다.  
그리고 이런 설계는 클래스 컴포넌트의 componentDidMount() 메서드를 구현한 것과 사실상 같은 효과를 보인다. 다른 점 이라면
componentDidMount() 는 한 번 실행되지만 두 훅은 의존성 목록이 변경될 때마다 콜백할수를 실행한다는 것이다.
```
useeffect(콜백_함수, 의존성_목록)
useLayoutEffect(콜백_함수, 의존성_목록)
콜백_함수 = ()= {}
```
두 훅의 콜백 함수는 다음처럼 함수를 반환할 수도 있는데, 이때 반환 함수는 컴포넌트가 언마운트될 때 한번만 호출된다.
```
콜백_함수 = () => {
    return 반환_함수 // 언마운트 될 때 한 번만 호출
}
```

### 🕸️useLayoutEffect 와 useEffect 훅의 차이점
useLayoutEffect 훅은 동기로 실행하고, useEffect 훅은 비동기로 실행한다. 이 말은 useLayoutEffect 훅은 콜백 함수가 끝날 때까지
프레임워크가 기다린다는 의미이다. 반면에 useEffect 는 콜백 함수의 종료를 기다리지 않는다. 리액트 공식 문서에서는 될 수 있으면 useEffect 훅을 사용하고
구현이 안 될때만 useLayoutEffect 훅을 사용하라고 권한다. 따라서 useEffect 훅을 위주로 사용하겠다.

### 🕸️useInterval 커스텀 훅 고찰해 보기
04-1 에서 다음처럼 useInterval 커스텀 훅을 제작한 바 있따. useEffect 의 콜백 함수 부분은 메모리 누수를 막으려고 setInterval() 호출로 얻은 id 값에
clearInterval()을 호출하는 함수를 반환했다.
```typescript jsx
import {useEffect} from 'react'

export const useInterval = (callback: () => void, duration: number = 1000) => {
  useEffect(() => {
    const id = setInterval(callback, duration)
    return () => clearInterval(id)
  }, [callback, duration])
}
```
useInterval은 다음과 같은 형태로 사용하므로 비록 의존성 목록이 빈 배열[]은 아니지만, callback과 duration의존성은 사실상 변하지 않는다.
이 때문에 setInterval() 함수는 한 번만 실행된다.
```typescript jsx
const [today,setToday] = useState<Date>(new Date())
useInterval (()=>setToday(new Date()))
```

### 🕸️useEventListener 커스텀 훅 만들기
리액트 개발을 하다 보면 가끔 DOM이나 window 객체에 이벤트 처리기를 부착해야 할 때가 있다. HTMLElement와 같은 DOM 타입들은 EventTarget 타입의 상속 타입으로,
EnventTarget은 addEventListener() 와 removeEventListener() 라는 메서드를 제공한다.  
그런데 앞서 setInterval 처럼 addEventListener() 메서드를 호출하면 반드시 removeEventListener() 메서드를 호출해 주어야 메모리 누수가 발생하지 않는다.
이러한 내용을 useEventListener 라는 커스텀 훅으로 만들어보겠다.
src/hooks/useEventListener.ts 파일을 만든다. 이 파일에 useEventListener 커스텀 훅을 구현한다. 이 코드는 EventTarget의 addEventListener 메서드가
가진 매개변수 타입을 그대로 사용하고 있다. 코드에서 target과 callback은 null일 수 있으므로 null 이 아닐 때만 addEventListener를 호출하는 방식으로 구현했다.
다만 target이나 callback이 초깃값은 null 이었지만 어떤 값으로 바뀔 때를 대비해 useEffect의 의존성 목록에 담았다.

### 🕸️useWindowResize 커스텀 훅 만들기
웹 분야에서 반응형 디자인이란 웹 브라우저의 크기에 따라 웹 페이지를 구성하는 HTML 요소들의 크기와 위치를 변하게 해서 최상의 사용자 경험을 주는 설계를 의미한다.
그런데 데스크톱에서는 모바일이나 태블릿과 달리 사용자가 웹 브라우저의 크기를 마우스로 바꿀 수 있다. 이 때문에 데스크톱을 대상으로 할 때는 웹 페이지의 크기가 변경될 때마다
이를 탐지해서 그에 맞는 형태로 HTML 요소들의 크기와 위치를 바꿔 줘야 한다. 이런 기능을 하는 커스텀 훅을 만들어보겠다.
src/hooks/useWindowResize.ts 파일을 생성하고 코드를 작성한다. 02-1 에서 알아봤듯이 window 객체의 타입인 Window는 EventTarget을 상속하므로 앞서 제작한
useEventListener의 target 매개변수에 사용할 수 있다. 또한 웹 페이지의 크기는 window 객체의 innerWidth와 innerHeight 속성값으로 알 수 있다.
그리고 이벤트 타입을 resize로 하면 웹 페이지의 크기가 변경되는 것을 탐지할 수 있다.  
이제 src/pages/WindowResizeTest.tsx 파일을 열고 useWindowResize 커스텀 훅을 사용하는 코드를 작성한다. 코드를 저장한 후 웹 브라우저 크기를 조절해보면
웹 페이지에 표시된 값이 실시간으로 바뀌는 것을 확인할 수 있다.

###  🕸️fetch() 함수와 Promise 클래스 고찰해 보기
fetch() 함수와 Promise 클래스는 자바스크립트 엔진에서 기본으로 제공하는 API 이다. fetch()는 HTTP 프로토콜의 GET, POST, PUT, DELETE 같은 HTTP 메서드를
프로그래밍으로 쉽게 사용하게 해준다.  
다음은 fetch() API의 타입 정의이다. fetch는 blob(), json(), text() 와 같은 메서드가 있는 Response 타입 객체를 Promise 방식으로 얻을 수 있게 해준다.
```typescript jsx
declare function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;

interface Response {
  blob() : Promise<Blob>;
  json() : Promise<any>;
  text() : Promise<string>;
}
```
여기서 fetch()의 첫 번째 매개변수 input의 타입인 RequestInfo는 다음과 같다.
```typescript jsx
type RequestInfo = Request | string;
```
보통 HTTP GET 메서드를 사용하는데, HTTP GET 메서드를 사용할 때 fetch()는 다음 형태로 사용한다.
```typescript jsx
fetch(접속할_URL)
```
다음은 사용자 정보를 무작위로 생성해 JSON 포맷으로 보내주는 API 사이트에 fetch()로 접속하는 예이다.
```typescript jsx
fetch('https://randomuser.me/api/')
```
그런데 fetch()는 Promeise<Response> 타입 객체를 반환한다. Promise 클래스는 비동기 콜백 함수를 쉽게 구현하려고 만든 것으로, then(), catch(), finally() 메서드를 제공한다.
다음은 Promise의 3가지 메서드를 사용한 예이다.
```typescript jsx
fetch('https://randomuser.me/api/')
  .then(res=>res.json())
  .then((data:unknown)=>console.log(data))
  .catch((err:Error) =>console.log(err.message))
  .finally(()=>console.log('always called'))
```
then() 메서드는 모든 게 정상일 때 설정된 콜백 함수를 호출한다. 만일 then() 메서드의 콜백 함수가 값이나 또 다른 Promise 객체를 반환할 때는 then() 메서드를 다시 호출해 콜백 함수가 반환한 값을 얻을 수 있다.
catch() 메서드는 오류가 발생할 때 자바스크립트 엔진이 기본으로 제공하는 Error 타입의 값을 콜백 함수의 입력 매개변수로 전달해 호출해 준다.
catch()가 Error 객체를 넘겨 주므로 어떤 오류가 발생했는지 알 수 있다. finally()메서드는 then() 이나 catch()의 콜백 함수가 호출된 다음, 항상 자신에 설정된 콜백 함수를 호출한다.
다음은 위의 코드로 얻은 데이터의 정보이다.

<img src="../../images/04-05.png" width="400">

그런데 보통은 정보 가운데 일부만 사용한다. 이름과 이메일 등 데이터의 일부만 가져오려면 다음처럼 가져올 데이터의 타입을 선언한다.

```typescript jsx
type IRandomUser = {
  email : string
  name : {title:string; first:string, last:string}
  picture : {large:string}
}
```
그리고 수신한 data에서 results 항목만 다음처럼 추려 낸다.
```typescript jsx
const {result} = data as {results:IRandomUser[]}
```
그리고 다음처럼 유틸리티 함수를 만들어 email, name, picture 항목만 다시 추려낸다.
```typescript jsx
const convertRandomUser = (result:unknown) => {
  const {email, name,picture} = result as IRandomUser
  return {email, name, picture}
}
```
최종적으로 API 서버에서 얻은 데이터는 다음 코드 형태로 얻을 수 있다.
```typescript jsx
fetch('https://randomuser.me/api/')
.then(res=>res.json())
.then((data:unknown) => {
  const {result} = data as {results: IRandomUser[] }
  const user = convertRandomUser(results[0])
})
```
지금까지의 내용을 실습해 보겠다. src/data/fetchRandomUser.ts 파일을 생성하고 코드를 작성한다.

### 🕸️API 서버에서 가져온 사용자 정보 화면에 표시하기
src/pages/FetchTest 컴포넌트를 구현하겠다. 원격지 API 서버에서 데이터를 가져올 때는 시간이 걸린다. 그리고 통신 오류가 발생할 수 있다. 이 2가지를 고려할 때
API 서버에서 데이터를 가져올 때는 다음처럼 3개의 상태와 각각의 초깃값이 필요하다.
```typescript jsx
// API 서버에서 데이터를 가져올 때 상태와 초깃값
import {useToggle} from '../hooks'
import * as D from '../data'

const [loading, toggleLoading] = useToggle(false)
const [randomUser, setRandomuser] = useState<D.IRandomUser | null>(null)
const [error, setError] = useState<Error | null>(null)
```

다음은 앞서 만든 3개 상태의 세터 함수를 호출해 API 서버에서 데이터를 가져오는 코드이다.
```typescript jsx
const getRandomUser = useCallback(()=> {
  toggleLoading()
  D.fetchRandomUser().then(setRandomUser).catch(setError).finally(toggleLoading)
},[])
```
loading 값은 초깃값이 false 이므로 API 서버 접속 전에 toggleLoading()을 호출해 주면 사용자에게 현재 데이터를 가져오는 중임을 알릴 수 있다.
그리고 정상이든 비정상이든 서버로부터 무엇인든 얻으면 finally() 로 loading값을 다시 false로 만들어 준다. 04-3에서 구현한 useToggle 커스텀 훅은 이런 로직을 구현할 때
효율적으로 사용할 수 있다.
다음은 오류가 발생했을 때 JSX 문장 예이다. error는 널 값일 수 있으므로 이런 패턴으로 코드를 작성해야 된다.
```typescript jsx
{error && <p>{error.message}</p>}
```
마찬가지 이유로 널값일 수 있는 randomUser 데이터를 고려해 다음과 같은 패턴의 JSX문을 구현한다. 참고로 조건이 있는 JSX 문을 만들 때는 `{조건 &&()}` 형태의 코드를 먼저 만들고
소괄호 안에 화면 UI를 구성하면 오류 없이 쉽게 만들 수 있다.
```typescript jsx
{ randomUser && (
  <div>
    <Avatar src = {randomUser.picture.large} />
    <div>
      <p>
        {randomUser.name.title}.{randomUser.name.first}
        {randomUser.name.last}
      </p>
      <p> {randomUser?.email} </p>
    </div>
  </div>
)}
```
다음은 지금까지 살펴본 내용을 토대로 작성한 FetchTest.tsx 이다. 이 코드는 getRandomUser() 라는 함수를 먼저 구현한 후 2곳에서 호출했다.
이 함수의 구현 패턴은 컴포넌트가 마운트될 때 초기 화면을 쉽게 만들어 주고, 버튼의 onClick 이벤트 속성에 설정하는 콜백 함수를 쉽게 구현하도록 돕는다.
실행 결과를 확인하면 API 서버에서 가져온 사용자 정보가 표시되고 버튼을 누르면 새로 가져온다










































