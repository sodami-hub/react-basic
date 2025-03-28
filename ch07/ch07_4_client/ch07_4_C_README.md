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




## 🎈
### 🕸️








































## 🎈
### 🕸️










