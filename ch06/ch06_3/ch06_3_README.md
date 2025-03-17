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
회원 가입 컴포넌트를 만들어 보겠다.



## 🎈 

### 🕸️
















## 🎈

### 🕸️
## 🎈

### 🕸️
## 🎈

### 🕸️
## 🎈

### 🕸️
