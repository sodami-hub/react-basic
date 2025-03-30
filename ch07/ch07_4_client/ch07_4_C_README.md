# 07-4 JSON 웹 토큰으로 회원 인증 기능 구현하기 
# ✨클라이언트

## 🎈 회원 인증 구현하기
06-3에서 src/contests/AuthContext.tsx 파일에 signup 함수를 다음처럼 구현했다. 그런데 이 코드는 원칙적으로 post('/auth/signup',user)
형태의 코드를 호출하여 백엔드 API 서버에서 회원 등록을 정상으로 마치고 호출되어야 하는 코드이다.
```typescript
const signup = useCallback((email: string, password: string, callback?: Callback) => {
  const user = {email, password}
  setLoggedUser(notUsed => ({email, password}))
  U.writeObjectP('user', user).finally(() => callback && callback())
}, [])
```
즉, signup 함수는 백엔드 API 서버가 있을 때 다음처럼 구현한 후 서버에서 ok 값이 true 일 때 비로서 setLoggedUser와 U.writeObjectP 함수를
호출하는 방식으로 구현해야 정상이다.

```typescript
const signup = useCallback((email:string, password:string, callback?:Callback) => {
  const user = {email, password}
  
  post('/auth/signup', user)
    .then(res=>res.json())
    .then((result: {ok:boolean; body?:string; errorMessage?:string}) => {
      const {ok, body, errorMessage} = result
      if(ok) {
        setLoggendUser(notUsed=>user)
        U.writeObjectP('user',user).finally(()=>callback && callback()) 
      }
    })
})
```
또한 서버에서 보내는 JSON 토큰이나 통신 장애로 인한 오류를 처리하려면 다음처럼 2가지 상태를 구현해 줘야 한다.
```typescript
const [jwt, setJwt] = useStata<string>('')
const [errorMessage,setErrorMessage] = useState<string | null>(null)
```
서버에서 보내는 JSON 토큰인 jwt 값은 body 속성값 자체이다. 따라서 다음처럼 jwt 값을 localStorage에 저장하여 웹 브라우저를 종료한 다음에
다시 시작하더라도 이 값을 읽을 수 있도록 해줘야 한다. 그리고 회원 가입 후 즉시 웹 화면의 기능을 사용할 수 있도록 jwt값을 컨텍스트에 유지해야 한다.

```typescript
const {ok, body, errorMessage} = result
if (ok) {
  U.writeStringP('jwt', body ?? '').finally(()=>{
    setJwt(body ?? '')
    setLoggedUser(notUsed=>user)
    U.writeObjectP('user', user).finally(()=>callback && callback())
  })
}
```
또한 로그인했을 때 다음과 같은 코드로 localStorage 에 저장된 jwt 값을 읽어 컨텍스트의 jwt 상태값을 복원해 주는 것도 필요하다.
```typescript
useEffect(()=> {
  U.readStringP('jwt')
    .then(jwt=>setJwt(jwt ?? ''))
    .catch(()=> {오류처리})
}, [])
```
이러한 내용을 종합해 signup 함수를 구현한다. src/contests/AuthContest.tsx 파일에 코드를 작성한다. 이 코드는 signup 함수만 구현한 것이다.
login 과 logout 함수는 수정이 필요하다.

## 🎈 로그인 기능 구현하기 - 클라이언트
이제 클라이언트쪽에서 HTTP 요청에 JSON 토큰을 실어서 보내는 방법을 알아보겠다. 프런트엔드 쪽에서 서버로 로그인하려면 먼저 JSON 토큰을
운반하는 post 메서드를 구현해 주어야 한다. 이를 위해 다음처럼 fetch 함수의 두 번째 매개변수 부분을 분리해 보면 다음과 같다.
```typescript
let init: RequestInit = {
  method: 'POST' 또는 'PUT',
  body: JSON.stringify(data),
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin'
}
fetch(getServerUrl(path), init)
```
이때 JSON 웹 토큰이 있는지에 따라 headers 부분을 다음처럼 구현할 수 있다. 참고로 이렇게 구현한 이유는 타입스크립트 컴파일러가 init에
매우 업격한 타입 검사를 하기 때문이다.
```typescript
if(jwt) {
  init = {
    ... init,
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${jwt}`}
  }
} else init = {...init, headers: {'Content-Type':'application/json'}}
```
이제 클라이언트 프로젝트에서 src/server 디렉터리의 postAndPut.ts 파일을 열어 다음처럼 수정한다.

## 🎈 AuthContext.tsx 파일의 login 함수 다시 구현하기
앞서 서버의 authRouter.ts 파일에서 '/auth/login' 경로의 구현 내용을 보면 로그인할 때 jwt 를 요구한다. 이 jwt 는 현재 localstorage에
담겨 있으므로 AuthContext.tsx 파일의 login 함수는 다음처럼 localStorage 에서 JSON 토큰을 읽는 것으로 시작해야 한다.

```typescript
const login = useCallback((email: string, password: string, callback?: Callback) => {
  const user = {email, password}
  U.readString('jwt')
    .then(jwt => {})
    .catch((e: Error) => setErrorMessage(e.message ?? '????'))
},[])
```
그리고 localStorage 에서 JWT 를 정상으로 읽었으면 다음처럼 JWT 와 함께 사용자의 이메일 주소와 비밀번호를 전송한다.

```typescript
const login = useCallback((email: string, password: string, callback?: Callback) => {
  const user = {email, password}
  U.readString('jwt')
    .then(jwt => {
      return post('/auth/login',user,jwt)
    })
    .catch((e: Error) => setErrorMessage(e.message ?? '????'))
},[])
```
이후 서버의 응답을 얻은 다음, ok 속성값이 false 이면 오류 메시지를 화면에 출력하고 로그인 화면에서 멈춘다. 만약 true 이면 앞서
구현했던 setLoggedUser 와 callback 함수를 호출하여 다음 화면으로 진행한다.
```typescript
const login = useCallback((email:string, password:string, callback?:Callback) => {
  const user = {email, password}
  U.readString('jwt')
    .then(jwt => {
      setJwt(jwt ?? '')
      return post('auth/login',user, jwt)
    })
    .then(res=>res.json())
    .then((result: {ok:boolean; errorMessage?:string})=>{
      if (result.ok) {
        setLoggedUser(notUsed => user)
        callback && callback()
      } else {
        setErrorMessage(result.errorMessage ?? '')
      }
    })
    .catch((e:Error)=>setErrorMessage(e.message ?? ''))
},[jwt])
```
다음은 logout 함수의 구현 내용으로 AuthProvider 는 useState 훅으로 얻은 jwt 값을 사용하지, localStorage에 담긴 jwt 값을 
사용하지 않는다는 점이 핵심이다. 즉, useState 훅으로 유지되는 jwt 토큰만 초기화해야지, localStorage에 담긴 jwt 토큰을 
초기화하면 안된다.
```typescript
const logout = useCallback((callback?:Callback) => {
  setJwt(notUsed=>'')
  setLoggedUser(undefined)
  callback && callback()
}, [])
```
지금까지의 내용을 종합하여 login과 logout 함수를 구현한다. src/contests 디렉터리의 AuthContext.tsx 파일에 코드를 작성한다.

### 🕸️ RequireAuth 컴포넌트에 JSON 토큰 반영하기
06-3절에서 사용자가 회원 가입이나 로그인했는지를 useAuth 훅이 반환하는 loggedUser 객체의 유무로 판단했지만, 지금은 JSON 토큰
유무로 판단하는 것이 좀 더 정확하다.
src/routes/Auth 디렉터리의 RequireAuth.tsx 파일에 loggedUser 대신 jwt를 사용하는 코드로 수정한다.

### 🕸️ 클라이언트 쪽의 JSON 토큰 기능 구현하기
JSON 웹 토큰은 다음의 형태로 서버에 전송된다고 했다.
```typescript
headers : {
  Authorization : `Bearer ${jwt}`
}
```
이 내용을 클라이언트 프로젝트에서 src/server 디렉터리의 getAndDel.ts 파일에 적용하면 다음과 같은 모습이 된다. 코드에서 getAndDel
함수의 2번째 매개변수로 jwt 토큰을 선택적으로 수신한다. 그리고 토큰이 있을 때는 자바스크립트 엔진이 제공하는 RequestInit 타입
init 변수의 headers 속성에 앞 코드를 추가한 후 fetch 함수를 호출하는 형태로 구현한다.  
그리고 이러한 코드 패턴은 같은 디렉터리의 postAndPut.ts 파일을 구현할 때도 다음처럼 똑같이 적용할 수 있다.  
  
다음은 src/routers/RestTest 디렉터리의 PostTest.tsx 파일에 AuthContext.tsx 파일 내용과 앞서
구현한 src/server 디렉터리의 내용을 결합한 것이다. 코드는 useAuth 훅 호출로 localStorage 에 저장된 
jwt 토큰을 가져온 다음, post 함수의 3번째 매개변수에 jwt 토큰을 적용하고 있다. 이런 코드 패턴은 나머지 파일들도
모두 비슷하므로 생략한다.





## 🎈
### 🕸️








































## 🎈
### 🕸️










