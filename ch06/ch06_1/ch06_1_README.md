# 06-1 처음 만나는 리액트 라우터
이 절에서는 리덕스와 함께 리액트 생태계에서 가장 널리 사용되는 리액트 라우터 패키지의 기본 기능을 알아본다.
리액트 라우터는 사용자가 요청한 URL에 따라 알맞은 자원을 제공하는 기능을 한다.

## 🎈 URL 이란?
리액트 라우터를 이해하려면 URL 과 location, history 와 같은 이름의 객체가 제공하는 속성이나 메서드를 알아야 한다.
먼저 URL 은 인터넷에서 자원의 위치를 의미한다. 자원이란 HTML, CSS, 이미지 등 브라우저가 이해할 수 있는 모든 형태의
데이터를 뜻한다.  
URL 은 웹 브라우저가 특정 웹 서버에 원하는 자원을 요청할 때 사용된다. 다음 그림은 URL 의 구성 요소들을 나타낸다.

<img src="../../images/06-01.png" alt="url 구성요소" width="500">

가장 간단한 형태는 'http://localhost:3000' 처럼 프로토콜과 도메인만을 명시한 형태로, 이때 웹 브라우저는 생략된 경로
'/'를 추가한 'http://localhost:3000/' 을 도메인 localhost:3000 에 요청하며, localhost:3000 은 경로 '/' 에
해당하는 자원을 HTTP 프로토콜을 사용하여 웹 브라우저 쪽으로 응답한다.

### 🕸️ location 객체 알아보기
웹 브라우저에서 URL은 주소 창에 입력한다. 그러면 웹 브라우저는 window.location 형태로 얻을 수 있는 location 객체를 제공한다.  
**location 객체의 속성**
- href : 주소 창에 입력된 URL 전체 문자열을 얻고 싶거나, 다른 URL을 프로그래밍으로 설정하고 싶을 때
- protocol : URL의 프로토콜 문자열을 얻고 싶을 때, 마지막의 콜론(:)도 포함 됨
- host : 도메인과 포트 번호가 결합된 문자열을 얻고 싶을 때 사용
- pathname : '/' 문자 뒤 경로 부분의 문자열을 얻고 싶을 때 사용
- search : 쿼리 매개변수 문자열을 얻고 싶을 때 사용
- hash : 프래그먼트 문자열을 얻고 싶을 때 사용

### 🕸️ 웹 브라우저가 제공하는 history 객체 알아보기
웹 브라우저는 또한 window.history 형태로 얻을 수 있는 history 객체도 제공한다. location 객체가 URL 을 구성하는 각종 요소를
속성으로 제공한다면, history 객체는 '앞으로 가기', '뒤로 가기' 등 페이지 이동을 프로그래밍으로 할 수 있게 하는 메서드를 제공한다.  
- back() : 뒤로 가기를 프로그래밍으로 하려 할 때 사용
- forward() : 앞으로 가기를 프로그래밍으로 하려 할 때 사용
- go(숫자 혹은 URL) : go(-1) 은 뒤로 가기에 해당하고, go(1) 은 앞으로 가기에 해당, go(-2)는 2번 뒤로 가기에 해당

### 🕸️ 라우팅이란?
URL 의 'L' 은 위치 제공자라는 의미이다. 웹 서버는 많은 자원을 제공하므로 원하는 자원을 얻으려면 자원이 있는 경로와 쿼리 매개변수 등을
조합하여 웹 서버로 하여금 원하는 자원이 구체적으로 무엇인지를 알게 해야 한다. 이 때 `웹 서버에서 URL에 명시된 자원을 찾는 과정을
라우팅`이라고 한다.  
보통 웹에서 라우팅은 항상 서버에서 일어난다. 그런데 앞서 알아본 location과 history 객체의 기능으로 실제로는 라우팅이 웹 브라우저,
즉 클라이언트에서 일어나지만 사용자 관점에서는 서버 쪽 라우팅과 똑같은 사용자 경험을 줄 수 있다. 이처럼 웹 브라우저에서 발생하는
라우팅을 클라이언트 측 라우팅이라고 한다.

### 🕸️ SPA 방식 웹 앱의 특징
웹 서버와 웹 브라우저가 여러 HTML 파일을 주고받는 방식을 다중 페이지 앱 줄여서 MPA라고 한다. 반면에 라우팅이 웹 브라우저에서만
일어나는 웹 방식을 단일 페이지 앱, 줄여서 SPA 라고 한다.  
SPA 방식 웹 앱은 사용자가 처음 서버에 접속할 때 다양한 컴포넌트들로 구성된 1개의 HTML 파일을 웹 브라우저에 전송한다.
그리고 이 HTML 파일에 포함된 자바스크립트 코드가 동작하면서 사용자가 원하는 내용을 DOM 구조로 만들어가면서 보여 준다.  
SPA 방식 웹 앱에서 클라이언트 측 라우팅(CSR)은 수많은 컴포넌트 중 특정 컴포넌트를 찾아 화면에 보여 준다. SPA 방식 웹 앱은
자바스크립트 코드가 동작하므로 데스크톱 앱을 사용하는 것처럼 느끼게 해준다. 또한 CSR 은 프로그래밍으로 URL을 입력하지만 
실제 서버에 전송하는 URL 이 아니므로 사용자가 보고 있는 컴포넌트가 바뀌어도 화면 새로 고침이 발생하지 않는다.

## 🎈 리액트 라우터 패키지란?
리액트 라우터는 리덕스오 더불어 리액트 커뮤니티에서 가장 널리 사용되는 CSR 패키지이다. 리액트 라우터는 2014년에 처음 만들어졌다.
리액트 라우터 6 버전 부터는 리액트 훅 기술에 기반을 두고 있다.  
리액트 라우터 또한 컨텍스트 기반으로 설계되었으므로 다음처럼 컨텍스트 제공자인 BrowserRouter를 최상위 컴포넌트로 사용해야 한다.

```typescript jsx
import {BrowserRouter} from "react-router-dom";

export default function App() {
  return <BrowserRouter>
    /* 리액트 라우터 기능 사용 컴포넌트 */
  </BrowserRouter>
}
```

## 🎈 NoMatch 컴포넌트 만들기
src/routes 디렉터리의 NoMatch.tsx 파일에 코드(기본 코드)를 작성한다. 참고로 alert, alert-error 클래스는 daisyui
패키지가 제공하는 alert 컴포넌트가 제공하는 클래스이다.  
리액트 라우터 패키지를 사용하려면 Routes, Route, 그리고 Link 라는 이름의 컴포넌트를 알아야 한다.
리액트 라우터는 다음처럼 Routes 와 Route 컴포넌트를 제공한다.
```typescript jsx
import {Routes, Route} from 'react-router-dom'
```
Route 컴포넌트는 path 와 element 라는 속성을 제공하며, 다음 코드는 주소 창에 경로 '/' 가 있을 때 Home 이란 이름의
컴포넌트를 화면에 보이게 설정(라우팅)하는 예이다.
```typescript jsx
import Home from './Home'
<Route path="/" element={<Home />} />
```
만일 모든 경로를 element 속성에 설정한 컴포넌트로 라우팅하고 싶다면 다음처럼 path 경로에 "*"을 설정한다.
```typescript jsx
import NoMatch from './NoMatch'
<Routh path="*" element={<NoMatch />} />
```
그런데 Route 컴포넌트는 단독으로 사용할 수 없고 항상 Routes 컴포넌트의 자식 컴포넌트로 사용해야 한다. 다음 src/routes
디렉터리의 RoutesSetup.tsx 파일은 모든 경로에 대해 NoMatch 컴포넌트가 화면에 나타나도록 설정한다. 그런데 Route는
독립적일 수 없으므로 Routes 컴포넌트의 자식 컴포넌트로 사용되고 있다.

## 🎈 Home 컴포넌트 만들기
이번에는 경로가 '/'일 때 Home.tsx 파일이 화면에 나타나도록 하겠다. 먼저 src/routes 디렉터리의 Home.tsx 파일을 작성한다.
코드는 앞서 NoMatch와 다르게 title 이란 이름의 선택 속성을 제공한다.  
그리고 RoutesSetup.tsx 에 Home 컴포넌트의 라우트 경로를 설정한다. 이 코드는 왜 Route 컴포넌트가 component 라는 이름이 아닌
element 라는 이름의 속성을 제공하는지 힌트를 준다. 즉, 만일 component={Home} 처럼 사용하도록 설계했다면 라우트 경로에 맞는
컴포넌트가 제공하는 속성을 사용할수 없지만, element 는 element={<Home title="hello"/>} 형태로 컴포넌트의 속성에
적절한 값을 설정할 수 있기 때문이다.  
이제 웹 브라우저에서 '/' 와 '/welcome' 은 다른 형태로 보여진다.

## 🎈 Link 컴포넌트 알아보기
HTML 에서 다른 웹 사이트로 이동하거나 특정 경로의 내용을 보려면 `<a href="다른_사이트_url>` 요소를 사용한다. 다만 a 요소는
클라이언트 측 라우팅을 위한 용도로는 바로 사용할 수 없다. 이 때문에 리액트 라우터는 a 요소를 감싼 Link 컴포넌트를 제공한다.
```typescript jsx
import {Link} from 'react-router-dom'
```
Link 컴포넌트는 a 요소의 href 속성 대신 다음처럼 to 속성을 제공한다. 이 코드는 'Home'이라는 텍스트를 마우스로 클릭하면
'/' 로 이동한다.
```typescript jsx
<Link to={"/Home"}>Home</Link>
```
이제 src/routes 디렉터리의 Home.tsx 파일을 수정해서 Link 컴포넌트가 화면에 나타나도록 한다. 그리고 /board 경로에 실제로
src/pages/Board 컴포넌트가 화면에 나타나도록 RoutesSetup.tsx 파일을 수정한다.  
실행결과를 보면 위쪽의 [Home]과 [Welcome]을 클릭했을 때 각 경로에 해당하는 컴포넌트가 나탄가고,
[Board]를 클릭하면 보드가 나타난다. 그런데 보드가 나타날 때는 화면 위쪽에 내비겨이션 메뉴가
나타나지 않는다. 이 문제는 다음 절에서 해결하도록 한다.

## 🎈 useNavigate 훅 알아보기
리액트 라우터는 useNavigate 훅을 제공한다. useNavigate() 훅을 호출하면 navigate 함수를 얻는다.
navigate 함수는 매개변수로 전달한 경로로 이동하게 해준다. 그리고 window.history 객체의 go 메서드처럼
-1과 같은 숫자로 '뒤로 가기' 등의 효과를 줄 수도 있다.
```typescript jsx
import {useNavigate} from "react-router-dom";

const navigate = useNavigate()
navigate('/')
navigate(-1)
```
src/routes 디렉터리의 NoMatch.tsx 파일에 useNavigate 훅이 제공하는 기능을 추가한다.
navigate(-1) 코드는 이전 페이지로 이동한다. 이 코드는 Link 컴포넌트가 useNavigate 훅을 좀 더
쉽게 사용하도록 제공된 컴포넌트라는 것을 알게 해준다.

## 🎈 라우트 변수란?
라우트를 설정할 때 라우트 경로는 다음처럼 콜론(:)을 붙일 수 있는데, 이처럼 콜론 앞에 붙인 uuid,title 과 같은 심볼을
**라우트 변수**라고 한다. 라우트 변수는 라우트 경로의 일정 부분이 수시로 바뀔 때 사용한다. 예를 들어 다음처럼 cardid는
마치 변수에 담긴 값처럼 수시로 바뀔 수 있다.
```typescript jsx
<Route path={"/board/card/:cardid"} element={<Card />} />
```
이러한 라우트 변수를 이용해 src/pages/BoardList 디렉터리의 index.tsx 파일을 수정하겠다. 카드의 uuid 값을 라우트 경로에
포함해 '/board/card' 부분은 같지만, 경로 끝의 카드 uuid 값에 따라 라우트 경로가 수시로 바뀌도록 했다.  
실행 결과는 보드에소 목록과 카드를 하나 만들고 카드를 클릭하면 현재 '/board/card/:cardid' 경로에 대한 화면 컴포넌트가
없으므로 NoMatch 컴포넌트가 나타난다. 이제 이런 라유트 변수가 있는 경로에 컴포넌트를 설정하는 방법을 알아보겠다.

## 🎈 Card 컴포넌트 만들기
src/routes 디렉터리에 RoutesSetup.tsx 파일에 Card.tsx에 대한 라우트 경로를 작성한다. 코드에서 cardid라는 이름의
라우트 변수를 사용한다.

## 🎈 Card 컴포넌트에 리액트 라우터 훅 적용하기
이제 리액트 라우터가 제공하는 몇 가지 훅을 알아보고 Card 컴포넌트에 적용해 보겠다.

### 🕸️ useLocation 훅 알아보기
리액트 라우터는 다음과 같이 useLocation 훅을 제공한다. useLocation 은 location 객체를 얻는다.
```typescript jsx
import {useLocation} from 'react-router-dom'

const location = useLocation()
```
location 객체는 웹 브라우저가 기본으로 제공하는 window.location 과 개념적으로 비슷하지만 완전히 똑같지는 않다.
location 객체가 어떤 정보를 담고 있는지 src/routes 디렉터리의 Card.tsx 파일을 구현해 보겠다.

코드를 실행해서 생성한 카드를 클릭해보면 다음과 같은 정보를 확인할 수 있다. 이 가운데 location.pathname 으로
현재 실행된 라우트 경로를 얻을 수 있음을 확인할 수 있다.

<img src="../../images/06-02.png" width="600">

### 🕸️ useParams 훅 알아보기
리액트 라우터는 useParams 훅을 제공한다. useParams 훅을 사용해서 params 객체를 얻을 수 있고, 이 객체로부터 라우트 매개변숫값을 얻는다.
```typescript jsx
import {useParams} from 'react-router-dom'

const params = useParams()
```
Card.tsx 에 다음과 같은 코드를 추가해서 결과를 보겠다.
```typescript jsx
cosnt params = useParmas()

<p> params: {JSON.stringify(params, null, 2)} </p>
```
결과를 보면 params는 `'라우트_매개변수_이름 : 값'` 형태의 정보를 가지는 `Record<string, any>` 타입의 객체임을 알 수 있다.

<img src="../../images/06-03.png" width="450">

### 🕸️ useSearchParams 훅 알아보기
리액트는 useSearchParams 훅도 제공한다. 이 훅은 searchParams 객체와 setSearchParams(보통은 사용할 필요가 없다.) 세터 함수를 튜플 형태로 반환한다.

```typescript jsx
import {useSearchParams} from "react-router";

const [searchParams, setSearchParams] = useSearchParams()
```
라우트 경로에 쿼리 매개변수가 '?from=0&to=20' 과 같을 때, from과 to 쿼리 매개변수는 다음처럼 얻을 수 있다.
```typescript jsx
const from = searchParams('from')
const to = searchParams('to')
```

### 🕸️ Card 컴포넌트 리액트 라우터 훅 적용하기
이제 Card.tsx 를 구현한다.

## 🎈 카드 상세 페이지 만들기 
Card.tsx 파일을 조금 더 수정해서 카드의 상세 페이지가 나타나도록 수정한다. 코드는 useState 훅을 사용하여 CardType이나 null인 card
객체를 설정한다. 이렇게 구현한 이유는 useParams 로 얻은 cardid값이 없거나, 있더라도 cardEntities[cardid] 에서 얻은 값이 null 일 수
있기 때문이다. 라우트 경로는 주소 창에서 임의로 변경 될 수 있으므로 이런 방어적인 코드가 필요하다.





















