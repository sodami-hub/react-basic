# 07-4 JSON 웹 토큰으로 회원 인증 기능 구현하기 
# ✨서버
  
## 🎈 사용자 인증과 JSON 웹 토큰
사용자 인증은 주로 사용자를 구분하는 목적으로 이용되므로 서비스를 제공하는 서버에 사용자가 입력한 정보를 저장한다. 하지만 구글이나 페이스북,
네이버, 카카오와 같은 다른 사이트에서 사용자가 과거에 입력한 정보를 바탕으로 회원 가입을 허용하기도 한다. 이런 방식으로 동작하는 서버들은
모두 OAuth라고 하는 표준에 기반한다.  
OAuth(open standard for access delegation) 는 RFC 5849 국제 표준으로 2010년에 버전 1.0이 발표되었으며 이후 2012년에 버전 2.0이 발표됐다.
1.0버전을 OAuth1, 2.0 버전을 OAuth2 라고 한다. 그런데 이 OAuth는 모두 JSON 웹 토큰이란 기술에 기반을 두고 있다.  
토큰(token)은 보통 문자열이나 숫자로 만든다. 만약 모바일 앱이 토큰을 전송한다면 서버는 수신한 토큰을 키로 하여 해당 토큰의 값 부분을 얻을 수 있다.
JSON 웹 토큰(줄여서 JWT)은 선택적 서명(optional signature)과 선택적 암호화(optional encryption) 기술을 사용하여 데이터를 만들게 하는
인터넷 표준이며 명칭은 RFC 7159 이다. JWT는 HTTP 헤더의 Authorization 항목에 다음처럼 `'Bearer' + ' ' +jwt` 형태의 값으로 서버에 전송하는
방식으로 동작한다.
```typescript
headers: {
  Authorization: `Bearer ${jwt}`
}
```
이러한 HTTP 헤더를 수신받은 서버는 headers의 Authorization 항목에서 JWT 값을 찾아 어떤 작업을 한 뒤, 그 결과를 다시 HTTP 헤더를 보낸 쪽에 전달한다.
JWT 값은 주로 회원 가입할 때, 서버에서 생성하여 웹 브라우저 쪽 프런트엔드 프레임워크에 전달한다. 프런트엔드 프레임워크 쪽 코드는 이렇게 수신한 JWT 값을
보관하고 있다가, 서버 API를 호출할 때 HTTP headers의 Authorization 항목에 실어서 전송한다.

## 🎈 JWT 기능 구현하기 - 서버
Node.js 환경에서 JSON 웹 토큰과 관련된 기능은 jsonwebtoken 이란 패키지를 사용한다. 서버에서 다음 명령으로 jsonwebtoken 을 설치한다.
```shell
yarn add jsonwebtoken
yarn add -D @types/jsonwebtoken
```
jsonwebtoken은 sign과 verify 함수를 제공한다.
```typescript
import {sign, verify} from 'jsonwebtoken'
```
sign 함수는 다음 코드 형태로 JSON 웹 토큰을 만든다. 여기서 secret은 payload 를 암호화할 때 쓰는 키이다. sign 함수는 payload 를 secret 과
option 부분을 결합해 JSON 웹 토큰을 생성한다.
```typescript
cosnt secret = '짐작하기_어려운_문자열'
const jwt = sign(payload, secret, option)
```
JWT 의 특징은 유효 기간을 설정할 수 있다는 점이다. 예를 들어 다음 코드는 하루('1d'는 1day의 의미)만 유효한 JWT를 생성한다.
```typescript
sign({name: 'jack', password: '1234'}, secret, {expiresIn:'1d'})
```
이렇게 만든 jwt 값은 다음처럼 verify 함수로 검증할 수 있다.
```typescript
const decode = verify(jwt, secret, option)
```
jsonwebtoken 패키지가 제공하는 기능을 프로그래밍으로 좀 더 쉽게 사용할 수 있게 만들어 보겠따. src/utils/jwtP.ts(함수 뒤에 'P'는 Promise 타임 객체를 반환한다는 의미이다.)
파일을 생성하고, 코드를 작성한다. 이 코드에서는 sign 이나 verify 함수가 예외를 일으킬 때 서버 프로그램이 비정상으로 종료되는 것을 막고자 try/catch 문을
사용하고 있다. 코드를 작성하고 index.ts에 반영한다.  
이제 jwtP.ts 파일에 구현한 두 함수를 테스트 하기 위해서 src/test/jwtTest.ts 파일을 만든다. 그리고 코드를 작성한다. 코드는 정상으로 JWT 를 생성하고 생성된 토큰을 검증하는
jwtNormalTest 함수와 토큰이 '1234' 등 비정상적일 때를 대비한 jwtExceptionTest, 그리고 토큰의 유효 기간을 1초(1s)로 한 다음 2초 후에 토큰을 검증하여 유효 기간이 지난
토큰일 때를 테스트하는 jwtExpireTest 함수를 실행해 보는 내용이다.  
터미널에서 jwtTest.ts 파일을 실행한다. 실행결과를 보면 생성한 토큰과 디코딩 결과, 비정상 토큰일 때, 기한이 지났을 때
오류를 차례로 출력한다.

## 🎈 비밀번호 해시값(비밀번호 암호화 하기) 구하기
이번엔 사용자 인증 기능용 라우터를 작성해야 하는데 그에 앞서 비밀번호의 해시값을 구하는 방법을 알아본다. 사용자가 회원 가입할 때 설정한
비밀번호를 그냥 저장하면 보안 문제를 일으킨다. 따라서 비밀번호의 해시값을 계산하여 저장해야 한다.  
Node.js 환경에서 비밀번호와 같은 문자열은 bcrypt 라는 패키지가 제공하는 기능을 사용하면 쉽게 해시값을 구할 수 있다. 먼저 bcrypt 패키지를
설치한다.
```shell
yarn add bcrypt
yarn add -D @types/bcrypt
```
bcrypt 패키지를 통해 얻은 bcrypt 객체를 통해 hash 와 compare 함수를 다음처럼 bcrypt.hash, bcrypt.compare
형태로 사용할 수 있다.  
Promise 버전인 hash 와 compare 함수를 이용하여 비밀번호를 해시하는 함수를 구현하겠다. 먼저 src/utils/hashPassword.ts 파일을 생성한다.
그리고 코드를 작성하고, index.ts 에 해당 파일을 반영한다.  
그리고 hashPasswordP.ts 파일에 구현한 두 함수를 테스트하기 위해서 src/test/hashTest.ts 파일을 생성하고, 코드를 작성한다.
코드는 평범한 문자열 비밀번호를 password 변수에 저장한 다음, hashPasswordP 함수로 이 비밀번호의 해시값을 구한다.
그리고 comparePasswordP 함수로 평범한 비밀번호와 해시값을 비교한다.

## 🎈 라우터 구현하기
앞에서 만든 함수를 사용해서 라우터를 구현해 보겠다. 다음 명령으로 src/routers 디렉터리에 authRouter.ts 파일을 생성한다.
그리고 코드를 작성한다.  
코드는 클라이언트가 전송한 이메일 주소를 가진 문서가 있는지 판별하여 이미 가입한 회원인지를 가려낸다. 그리고 신규 회원이면 전송된
비밀번호의 해시값을 구해 컬렉션에 저장하고 컬렉션에 생성된 문서의 _id값으로 JSON 웹 토큰을 만들어 userId 속성에 설정한다.
이를 body 속성에 설정하여 클라이언트로 보낸다. 이제 클라이언트 쪽에서 JSON 토큰을 보내면 이 토큰으로 userId 값을 가진 문서가
user 컬렉션에 있는지 확인하여 회원 가입한 사용자가 보낸 요청인지를 알 수 있다.  
같은 디렉터리의 index.ts 에 해당 파일을 추가하고, setupRouters.ts 파일에 authRouter 에 대한 경로를 설정한다.
즉, 회원 가입 경로는 '/auth/signup' 이 된다.







## 🎈
### 🕸️








































## 🎈
### 🕸️



