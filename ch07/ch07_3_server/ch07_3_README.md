# ch07-3 익스프레스 프레임워크로 API 서버 만들기
이 절에서는 대표적인 Node.js 기반 웹 프레임워크인 익스프레스 프레임워크를 사용하여 API 서버를 만드는 방법을 알아본다.

## 🎈 TCP/IP 프로토콜 알아보기
TCP/IP 프로토콜은 IP 프로토콜 기반에서 데이터 전송 방식을 제어하는 TCP 프로토콜을 함께 호칭하는 용어이다. TCP/IP 프로토콜을
사용하는 시스템은 항상 데이터를 요청하는 클라이언트 프로그램과 데이터를 제공하는 서버 프로그램으로 구성된다. 서버 프로그램은
항상 클라이언트의 데이터 요청이 있는지 알기 위해 특정 포트를 감시하고 있어야 하는데, 이 과정을 리슨(Listen)이라고 한다.
포트의 목적이 이처럼 클라이언트의 요청을 리슨하는 데 있으므로 어떤 TCP/IP 서버가 특정 포트를 리슨하고 있을 때 다른 TCP/IP 서버는
이 포트에 접근하지 못한다.  
TCP/IP 연결이 되면 클라이언트와 서버 모두 소켓이라는 토큰을 얻는다. 그리고 연결된 클라이언트와 서버는 이 소켓을 통해 양방향으로
데이터를 주고 받는다. 이 방식은 여러 클라이언트가 한 대의 서버에 접속하는 상황에서 각각의 클라이언트를 구분할 수 있게 해준다.
즉, 각 클라이언트는 서로 중복되지 않는 소켓 번호를 가지므로 서버 입장에서 소켓값을 가지고 각각의 클라이언트를 쉽게 구분할 수 있다.  
HTTP 프로토콜은 TCP/IP 프로토콜 위에서 동작하는 앱 수준 프로토콜이다. HTTP 서버, 즉 웹 서버는 TCP/IP 프로토콜을 사용하므로
항상 웹 브라우저와 같은 클라이언트의 요청에 응답할 수 있도록 특정 포트를 리슨하고 있어야 한다.

## 🎈 Node.js 웹 서버 만들기
Node.js는 웹 브라우저의 자바스크립트 엔진 부분만 떼어 내어, C/C++ 언어로 HTTP 프로토콜을 구현하여 독립적인 프로그램 형태로 동작하는
웹 서버 기능을 가진 자바스크립트 엔진을 구현한 것이다.  
Node.js 는 http 란 이름의 패키지를 기본으로 제공하며 이 패키지는 createServer 라는 함수를 제공하여 웹 서버 객체를 만들 수 있다.

```typescript
import {createServer} from 'http'

function createServer(requestListener?: RequestListener): Server;

type RequestListener = (req: IncomingMessage, res: ServerResponse) => void
```
createServer 의 선언문을 보면 선택적으로 RequestListener 타입의 콜백 함수를 매개변수로 입력 받을 수 있고, RequestListener 타입은
IncomingMessage 와 ServerResponse 타입 매개변수 2개를 입력받는 함수 타입임을 알 수 있다.  
src/index.ts 파일을 작성한다. HTTP 서버 또한 TCP/IP 서버이므로 listen 메서드를 사용해서 4000번 포트를 리슨하고 있다.
여기서 포트 번호를 4000으로 한 이유는 현재 포트 번호 3000은 리액트 개발 서버로 사용 중이기 때문에 이 번호와 다른 포트 번호를 사용한다.  
```shell
>ts-node src
```
참고로 ts-node 에 디렉터리 이름만 적용하면 해당 디렉터리 안에 index.ts 파일을 찾아 실행해 준다. 서버 주소로 접속을하고,
서버를 실행한 터미널을 보면 console.log 가 출력한 내용을 볼 수 있다.
```shell
req.url /
req.method GET
req.headers {
  host: 'localhost:4000',
  connection: 'keep-alive',
  'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
  'sec-ch-ua-mobile': '?0',
  
  ... (생략) ...
```

## 🎈 REST 방식 API 서버
웹 서버는 원래 웹 브라우저와 같은 HTTP 클라이언트에게 HTML 형식의 데이터를 전송해주는 목적으로 설계되었지만, 점차 HTML 이 아닌 JSON
형식의 데이터를 전송해 주는 방식으로 진화되었다. 이 두 방식을 구분하기 위해 HTML 형식 데이터를 전송하는 서버를 웹 서버, JSON 형식
데이터를 전송하는 서버를 API 서버라고 한다.  
**REST(representational state transfer)** 라는 용어는 HTTP 프로토콜의 주요 저자 중 한 사람인 로이 필딩의 2000년 박사학위 논문에서 처음 소개됐다. 앞서 src/index.ts 파일
실행 결과에서 req.method 부분을 볼 수 있는데, REST 는 req.method의 설정값을 다르게 하여 API 서버 쪽에서 DB 의 CRUD 작업을 쉽게
구분할 수 있게 하는 용도로 사용된다.(Create(CRUD작업) - POST(HTTP 메서드 이름), Read - GET, Update - PUT, Delete - DELETE)  
REST API 의 기본 원리는 'http://localhost:4000/user', 'http://localhost:4000/list' 처럼 경로에 자신이 원하는 '/user', '/list'
같은 자원을 명시하고, 이 자원에 새로운 데이터를 생성하고 싶으면 POST 메서드를, 단순히 검색하고 싶으면 GET 메서드를 사용하는 것이다.  
이러한 방식은 특정 자원을 항상 일정하게 사용하므로 일관된 방식으로 API를 설계할 수 있다. 이제 REST 방식 API 서버를 구현해 보겠다.
그전에 익스프레스 프레임워크를 설치한다.

## 🎈 익스프레스 설치하기
익스프레스 프레임워크는 Node.js 환경에서 사실상 표준 웹 프레임워크이다. 익스프레스를 사용하면 웹 서버는 물로 REST 방식 API 서버를 쉽게
만들 수 있다.  
익스프레스를 사용하여 REST 방식 API 서버를 만들려면 다음처럼 express 와 cors 라는 패키지를 설치해야 한다. 그리고 좀 더 편리하게 개발하고자
한다면 nodemon 패키지도 설치한다. 참고로 nodemon 은 개발할 때만 필요하므로 -D 옵션으로 셜치한다.
```shell
> yarn add express cors
> yarn add -D @types/express @types/cors nodemon
```

그리고 nodemon 패키지가 동작할 수 있도록 package.json 을 다음처럼 수정한다. 그리고 터미널에서 yarn start
명령을 실행한다. 참고로 macOS 에서는 'ts-node src' 처럼 작은따옴표로 감싼다.

```
{
  "name" : "...",
  ... (생략) ...
  
  "scripts" : {
    "start" : "nodemon -e ts --exec ts-node src --watch src",
    "start-mac" : "nodemon -e ts --exec 'ts-node src' --watch src"
  }
  ...(생략)...
}
```

다음은 nodemon을 실행한 모습이다. nodemon 은 src 디렉터리의 파일 확장자가 .ts 인 파일이 수정되면 프로그램을 자동으로 다시 실행하여
변경 내용을 즉시 반영한다.
```shell
"C:\Program Files\nodejs\npm.cmd" run start

> ch07_3_server@1.0.0 start
> nodemon -e ts --exec ts-node src --watch src

[nodemon] 3.1.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src\**\*
[nodemon] watching extensions: ts
[nodemon] starting `ts-node src`
connect http://localhost:4000
```

## 🎈 익스프레스 REST API 서버 만들기
익스프레스로 웹 서버를 만들 때는 항상 다음 코드 패턴으로 app 객체를 만들어야 한다.

```typescript
import express from 'express'

const app = express()
```
app 객체는 앞서 언급한 4개의 HTTP 메서드에 대응하는 4개의 메서드를 제공하며, 이 메서드들은 항상 app 객체를 다시 반환한다.
app 의 메서드들은 항상 다음과 같은 코드 패턴으로 사용된다. 다만 여기서 콜백 함수의 req 와 res 매개변수 타입은 앞서 본 http
패키지가 제공하는 createServer 때의 IncomingMessage, ServerResponse 와는 전혀 다른 익스프레스만의 타입임을 기억해야 한다.

```typescript
app
  .메서드명(경로, (req, res) => {})
```

또한 메서드들은 항상 app 객체를 다시 반환하므로 REST API 를 구현할 때는 보통 다음과 같은 메서드 체인 방식으로 구현한다.

```typescript
app
  .get(경로, (req, res) => {})
  .post(경로, (req, res) => {})
  .put(경로, (req, res) => {})
  .delete(경로, (req, res) => {})
```
app 객체의 또다른 특징으로는 다음 코드에서 보듯 createServer의 매개변수인 requestListener로서 동작할 수 있다는 점이다.
```typescript
const app = express()
createServer(app).listen(port, () => console.log(`connect http://${hostname}:${port}`))
```
이제 src/index.tx 파일을 다음처럼 구현한다. 앞서 언급한 대로 express()가 생성한 app 객체는 HTTP 메서드와 유사한 이름의 메서드를 제공하므로
경로 '/'에 대해 GET 메서드로 웹 브라우저가 요청하면 이에 응답하는 코드를 구현하고 있다.

다음은 서버의 경로로 접속했을 때 웹 브라우저의 모습이다. 코드에서 res.json 메서드를 호출하여 JSON 형식 데이터를
전송하였으므로 JSON.stringify 호출을 통해 JSON 데이터를 화면에 보여 준다. 이처럼 JSON 형식으로 응답하는 이 코드가
가장 단순한 REST API 서버이다.

<img src="../../images/07-09.png" width="280">

### 🕸️익스프레스 관련 코드 분리하기
이제 src/index.ts 파일에서 익스프레스 관련 코드를 분리해 보겠다. 먼저 src 디렉터리에 express 라는 디렉터리와 index.ts 파일을 생성한다.
그리고 index.ts 파일을 구현한다. 코드는 createExpressApp 함수가 any 타입 배열을 args 라는 매개변수를 수신하는 형태로
구현했다. 이는 createExpressApp(db), createExpressApp(db1,db2) 처럼 src/index.ts 파일에서 createExpressApp
함수를 호출할 때 매개변수를 입력할 수 있게 하는 용도이다.  
이렇게 하면 src/index.ts 의 코드를 간결하게 할 수 있다.

## 🎈 익스프레스 미들웨어와 use 메서드
익스프레스 객체 app은 다음처럼 사용하는 use 메서드를 제공하며, use 메서드의 매개변수로 사용되는 콜백 함수를 미들웨어라고
한다. 익스프레스 미들웨어는 다양한 종류가 있으며, 익스프레스는 여러가지 다양한 기능을 미들웨어를 통해 쉽게 사용할 수 있도록 한다.
```typescript
app.use(미들웨어)
```
익스프레스 미들웨어는 다음처럼 매개변수 3개로 구성된 함수 형태로 구현한다. 여기서 3번째 매개변수인 next는 함수인데
이 함수를 호출하면 모든 것이 정상으로 동작한다. 그러나 next를 호출하지 않으면 이 미들웨어 아래쪽에 메서드 체인으로
연결된 메서드들이 호출되지 않는다.
```typescript
const middleware = (req, res, next) => {}
```
다음 코드는 간단하게 req의 url과 method 속성값을 기록하는 미들웨어를 구현한 것이다. 이 로깅 미들웨어는 단순히
로깅하는 기능만 하므로 next 함수를 호출하여 app 객체에 설정한 내용이 정상으로 동작하도록 한다.
```typescript
app.use((req,res,next) => {
  console.log(`url='${req.url}, method=${req.method}`)
  next()
})
```
이제 src/express 디렉터리의 index.ts 파일에 로깅 미들웨어를 추가한다. app.use 메서드 또한 다른 메서드처럼
app 객체를 반환하므로 이와 같은 메서드 체인 형태로 작성할 수 있다.  
코드를 실행하고 브라우저로 서버에 접속해보면 터미널에 다음과 같은 메시지를 확인할 수 있다.
```shell
...(생략)...
[nodemon] starting `ts-node src`
Server started on port 4000
url=/, method=GET
...(생략)...
```

### 🕸️ express.static 미들웨어







## 🎈
### 🕸️
































