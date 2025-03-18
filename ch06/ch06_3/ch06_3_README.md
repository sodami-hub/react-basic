# 06-3 공개 라우트와 비공개 라우트 구현하기
공개 라우트는 누구나 볼 수 있는 페이지, 비공개 라우트는 로그인한 사용자만 볼 수 있는 페이지처럼 제한할 수 있다.

## 🎈 공개 라우트와 비공개 라우트
웹 사이트에 회원 가입을 해야지만 주요 서비스를 이용할 수 있도록 할 때가 많다. 보통 홈페이지(/), 로그인 페이지(/login),
회원가입 페이지(/signup) 처럼 누구나 접속할 수 있는 경로를 공개 라우트라고 한다. 반면에 로그인한 사용자만 접속할 수 있는 경로는
비공개 라우트라고 한다.

### 🕸️ 사용자 인증 컨텍스트 만들기
웹 페이지에서 사용자가 로그인이나 회원 가입을 했는지 알려면 모든 비공개 경로의 컴포넌트는 자유롭게 사용자의 정보를 알 수 있어야 한다.
리액트 프레임워크에서 여러 컴포넌트가 어떤 정보를 공유하게 하는 것은 04-6의 컨텍스트를 사용하는 방법과 05장의 리덕스를 사용하는 방법이 있다.
그러나 앱이 항상 리덕스를 사용한다고 가정하기는 어려우므로 이 절에서는 컨텍스트를 사용하여 사용자가 로그인했는지 알아보겠다.  
먼저 src/context/AuthContext.tsx 파일을 생성하고 코드를 작성한다. 그리고 index.ts 에 코드를 추가한다.  
src/App.tsx 에 AuthProvider 를 반영한다.

### 🕸️ 로그인 여부에 따라 내비게이션 메뉴 구분하기
src/routes/RoutesSetup.tsx 파일을 수정한다. 코드에서 LandingPage 나 Board 같은 컴포넌트는 Layout 컴포넌트 내부의
Outlet 에 나타나게 하지만, SignUp 등은 Outlet 바깥에서 나타나게 한다. 이는 Signup 이나 login, logout 등의
컴포넌트가 나타날 때는 내비게이션 메뉴가 나타나지 않는 것이 바람직하기 때문이다.  
다음은 src/routes/Layout/NavigationBar.tsx 파일이다. 코드에서 Link 컴포넌트를 RRLink 라는 이름으로 사용하는데,
[SignUp],[Login] 등의 메뉴를 눌렀을 때 해당 메뉴가 활성화된 모습으로 보이는 것은 바람직하지 않기 때문이다.  
그런데 실행 결과를 보면 로그인해야 볼 수 있는 Board 메뉴도 보이고 로그인이나 회원 가입을 한 적이 없는데도 Logout
메뉴가 보인다. 인증 컨텍스트를 수정해서 이런 부분을 좀 더 현실적으로 수정해 보겠다.  
앞서 구현한 useAuth 커스텀 훅은 다음 코드 형태로 loggedUser 객체를 얻을 수 있다.

```typescript jsx
import {useAuth} from "../../contexts";
const {loggedUser} = useAuth()
```
그리고 로그인을 안 했을 때 loggedUser 객체는 undefined 값을 가지므로 loggedUser 값이 undefined인지에 따라
내비게이션 메뉴 구성을 다르게 구현할 수 있다. 아래와 같은 패턴으로 NavigationBar.tsx 를 수정한다.
```typescript jsx
{loggedUser && (<Link to={'/board'}>Board</Link>)}  // 로그인 정보가 없으면 Board 메뉴는 안보임
{!loggedUser && (<Link to={'/login'}>Login</Link>)} // 로그인 정보가 없으면 login 메뉴가 보임
```

## 🎈 회원 가입 기능 만들기
<img src="../../images/06-04.png" width="200">

회원 가입 컴포넌트를 만들어 보겠다. 그런데 이런 폼 형태의 화면에서 `<input>` 요소들은 다음처럼 번거로운 형태의 코드를 계속 반복해야 한다.
```typescript jsx
const [email, setEmail] = useState<string>(D.randomEmail())
const [password, setPassword] = useState<string>('1')
const [confirmPassword, setConfirmPassword] = useState<string>('1')

const emailChange = useCallback((e: ChangeEvent<HTMLInputElement>)=> {
  setEmail(notUsed=>e.target.value)
}, [])
const passwordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  setPassword(notUsed => e.target.value)
}, [])
const confirmPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  setConfirmPassword(notUsed => e.target.value)
}, [])
```

이보다 좀 더 간결하고 바람직한 구현 방법은 다음처럼 폼에서 `<input>` 요소의 value 속성에 설정할 변수 이름을 속성으로 가진 Record
타입을 만드는 것이다.

```typescript jsx
type SignUpFormType = Record<'email' | 'password' | 'confirmPassword' , string>
```
그리고 SignUpFormType 객체를 useState 훅으로 생성한 뒤, 값 부분에 타입스크립트의 비구조화 할당문을 적용하여 email, password
등의 값을 얻는다.
```typescript jsx
const [{email, password, confirmPassword}, setForm] = useState<SignUpFormType>(initialFormState)
```
또한 다음처럼 changed 라는 이름의 2차 고차함수를 구현한다.
```typescript jsx
const changed = useCallback((key:string)=>(e: ChangeEvent<HTMLInputElement>) =>{
  setForm(obj=>({...obj, [key]:e.target.value}))
},[])
```
그러면 다음처럼 `<input>`의 value 와 onChange 속성값을 매우 간결하게 구현할 수 있다.
```typescript jsx
<input value={email} onChange={changed('email')}
```
이런 내용을 종합하여 src/routes/Auth 디렉터리의 SignUp.tsx 에 코드를 작성한다.

### 🕸️ 웹 브라우저를 종료해도 지워지지 않는 저장소 이용하기
이제 로그인 컴포넌트를 만든다. 그전에 localStorage 에 관해 먼저 알아보겠다. 만약 회원 가입할 때의 이메일 주소가 로그인할 때의
이메일 주소에 반영되지 않는다면 불편할 것이다. 회원 가입할 때 입력한 이메일 주소를 로그인할 때 이메일 주소에 표시하도록 해보겠다.
그런데 사용자가 회원 가입을 한 뒤 바로 브라우저를 종료하면 어떨까? 이런 상황에서는 사용자가 입력한 데이터가 바로 사라지므로
로그인 화면에서 사용자가 과거에 입력한 데이터를 알 수 있는 방법이 없다. 이런 상황을 고려해 사용자가 회원 가입 할 때 입력한 정보를
지워지지 않는 공간에 저장해 둬야 한다.  
자바스크립트 엔진은 window.localStorage 객체를 기본으로 제공한다. 이 객체는 간단히 localStorage 로 사용하며, 이 객체는 웹 브라우저가
접속한 웹 사이트별로 데이터를 저장할 수 있는 공간을 제공한다. 이 저장 공간은 웹 브라우저가 종료했을 때도 그대로 남아있으므로 사용자가
회원 가입할 때 입력한 데이터를 여기에 저장해 두면, 로그인 화면에서 읽어올 수 있다.  
localStorage 는 getItem 과 setItem 메서드를 제공하여 저장 공간에 데이터를 (키,값) 형태로 저장하고, 값을 읽을 수 있다.
다만 이 메서드들은 예외를 일으키므로 때로는 프로그램이 비정상적으로 종료될 수 있다. 이런 문제를 예방하도록 src/utils 디렉터리에
localStorageP.ts 와 readWriteObjectP.ts 파일을 만든다.
먼저 localStorageP.ts 에 코드를 작성한다. 여기에 작성한 두 함수는 데이터를 어떤 저장소를 사용한다는 느낌을 주고자 'read', 'write'와
같은 접두사를 가진 이름으로 지었다. 이 두 함수는 모두 Promise 객체를 반환하는데, 비록 localStorage 객체의 getItem 과 setItem 은
비동기 함수가 아니지만, 이처럼 구현하면 호출하는 쪽 코드를 좀 더 간결한 형태로 만들 수 있다. localStorage 의 getItem은 key에 해당하는
값이 저장되어 있지 않으면 null 을 반환하므로 string | null 타입의 Promise 객체를 반환한다.  
그런데 item 이란 단어의 의미가 좀 모호하다. localStorage 에서 값 부분은 항상 문자열이므로 그 의미를 좀 더 분명하게 하고자
readItemFromStorageP는 readStringP로, writeItemToStorageP는 writeStringP라는 이름으로 사용할 수 있도록 했다.  
그런데 localStorage 객체의 getItem과 setItem 은 모두 문자열 타입의 값을 다루므로 자바스크립트 객체를 저장해야 할 때
JSON.stringify 와 JSON.parse 함수를 호출해야 하는 번거로움이 생긴다.  
이제 이런 번거로움을 줄이고자 readWriteObjectP.ts 에 코드를 작성한다. 같은 디렉터리의 index.ts 에 방금 작성한 두 파일을 반영한다.  
src/context/AuthContext.tsx 파일에 writeObjectP 함수를 사용하여 localStorage에 사용자가 회원 가입할 때 입력한 정보를 저장한다.
'user' 라는 키로 사용자 정보를 localStorage 에 저장하는 코드를 추가한다.  
참고로 Promise 객체는 항상 finally 메서드를 호출하므로 굳이 then 이나 catch 메서드를 호출하는 코드가 필요하지 않다.

## 🎈 로그인 기능 만들기
SignUP.tsx 코드를 복사해서 Login.tsx 에 붙여넣는다. 그리고 코드를 작성한다. 앞서 구현한 readObjectP 함수를
사용하여 localStorage 에 담긴 'user' 키에 해당하는 값이 있으면 이를 입력 상자의 초깃값으로 사용한다. 따라서 실행 결과를 보면
회원 가입할 때 입력한 이메일 주소가 로그인할 때 기본값으로 나타난다.

## 🎈 로그아웃 기능 만들기
04-3에서 만든 daisyui 의 모달 컴포넌트를 사용하여 사용자의 로그아웃 의사를 다시 한번 묻는 대화상자의 형태로 로그아웃 컴포넌트를
만들어보겠다. src/routes/Logout.tsx 파일에 코드를 작성한다.

## 🎈 로그인한 사용자만 접근하도록 막기
클라이언트 측 라우팅은 웹 브라우저의 주소 창을 이용하므로 사용자가 주소 창에서 'http://localhost:3000/logout' 을 직접 입력하면
로그인하지 않았는데도 로그아웃 페이지에 진입할 수 있다. 이 때문에 '/logout' 등의 경로가 로그인하지 않으면 절대로 진입할 수 없는
비공개 라우트가 되려면 useAuth 훅 호출로 얻은 loggedUser 값이 undefined 인지를 검사하는 로직을 모든 비공개 라우트와 연결된
컴포넌트에 구현해 주어야 한다.  
그런데 이 작업은 똑같은 로직을 모든 컴포넌트에 구현해 줘야 하므로 상당히 번거롭다. RequireAuth 컴포넌트는 모든 비공개 라우트에
구현해 줘야 하는 기능을 한군데 구현해 놓아 중복되는 코드를 줄이는 역할을 한다.  
다음은 앞으로 구현할 RoutesSetup.tsx 코드에서 RequireAuth 컴포넌트 사용 예를 가져온것이다. RequireAuth 의 구현 목적이 비공개
라운트에 설정된 컴포넌트마다 구현할 로직을 한군데에서 처리하는 것이므로 `<Board />` 가 비공개 라우트가 되도록 `<Board />` 를
ReauireAuth로 감싸는 방식으로 구현한다.
```typescript jsx
<Route path={'/board'}
    element={
      <RequireAuth>
        <Board />
      </RequireAuth>
    }
/>
```
src/routes/ReauireAuth.tsx 파일에 코드를 작성한다. 코드는 loggedUser 값이 undefined 일 때는 이전 페이지로 돌아가고, 아니면
`<Board/>`와 같은 children 속성에 담긴 요소가 화면에 나타나게 한다. `<>{children}</>` 부분은 2장에서 알아본 것처럼
{children}을 직접 반환할 수 없으므로 React.Fragment 컴포넌트의 단축형인 `<></>` 로 감싼 것이다.  
RequireAuth 컴포넌트를 src/routes 디렉터리의 RoutesSetup.tsx 파일에 다음과 같은 형태로 적용한다. 이 코드는 /board 등 비공개
라우트 경로는 반드시 로그인한 사용자만 접근하게 하려는 의도이다.