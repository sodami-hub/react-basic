## 🎈클라이언트 만들기
아래 패키지들을 설치한다.
```shell
yarn create react-app [생성할 프로젝트 디렉터리] --template typescript
yarn add luxon chance @fontsource/material-icons redux react-redux @reduxjs/toolkit redux-logger redux-thunk
yarn add react-dnd react-dnd-html5-backend react-beautiful-dnd react-router-dom
yarn add -D @types/luxon @types/chance prettier postcss autoprefixer tailwindcss@3.4.17 @tailwindcss/line-clamp daisyui
yarn add -D @types/redux-logger @types/redux-thunk @types/react-dnd @types/react-beautiful-dnd
```
06-3 의 src 디렉터리와 기존에 만든 파일을 복사한다. 그리고 src/copy 디렉터리의 CopyMe 디렉터리를 복사해서 src/routes 에 RestTest 디렉터리를 만들고
이 디렉터리에 4개의 파일을 만든다.(GetTest, PostTest, PutTest, DeleteTest) 그리고 RestTest의 index.tsx 에 코드를 작성한다.  
src/routes 디렉터리의 RoutesSetup.tsx 파일에 RestTest 컴포넌트에 대한 '/rest' 라우터 경로를 추가한다.  
그리고 src/routes/Layout 디렉터리의 NavigationBar.tsx 파일에 '/rest' 경로에 대한 링크를 추가한다.

### 🕸️ fetch 함수로 JSON 형식 데이터 가져오기
현재 ch07_3_server 는 REST 방식 API 서버로서 동작하고 있다. 웹 브라우저에서 동작하는 자바스크립트 코드가 REST API 서버에
접속하려면 자바스크립트 엔진에서 기본으로 제공하는 fetch 함수를 사용해야 한다. fetch는 HTTP 프로토콜의 GET, POST, PUT, DELETE 와 
같은 메서드를 프로그래밍으로 사용할 수 있게 해준다.  
다음은 fetch API 의 타입 선언문으로 , fetch는 blob, json, text 와 같은 메서드가 있는 Response 타입 객체를 Promise 방식으로 얻는다.
```typescript
declare function fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
interface Response {
  // 이미지 등 Blob 타입 데이터를 텍스트나 바이너리 형태로 수신할 때 사용
  blob(): Promise<Blob>;
  json(): Promise<any>; // JSON 형식 데이터를 수신할 때 사용
  text(): Promise<string>;  // HTML 형식 데이터를 수신할 때 사용
}
```
fetch 의 첫 번째 매개변수 input 의 타입 RequestInfo 는 다음과 같은 타입으로 보통은 http://localhost:4000/test 등의 문자열을 사용한다.
두 번째 매개변수 init 의 타입 RequestInit 는 잠시 후에 알아보겠다.
```typescript
type RequestInfo = Request | string
```
fetch 는 Promise 타입 객체를 반환하므로 fetch 로 실제 데이터를 얻으려면 Promise 객체의 then 메서드를 반드시 호출해야 한다.
또한 서버가 동작하지 않는 등의 이유로 통신 장애가 날 수 있으므로 catch 메서드로 장애의 구체적인 내용을 텍스트 형태로 얻어야 한다.  
다음은 HTTP GET 메서드를 사용해서 API 서버에서 JSON 형식 데이터를 가져오는 코드이다. JSON 형식 데이터를 가져와야 하므로 Response 타입
객체의 json 메서드를 호출한다.
```typescript
fetch(API_서버_URL) 
  .then((res) => res.json())
  .catch((error:Error) => console.log(error.message))
```
src/routes/RestTest/GetTest.txt 파일에 코드를 작성한다. ch07_3_server 서버의 '/test' 경로에 HTTP GET 메서드를 사용하여 데이터를 가져온다.

### 🕸️ 서버 URL 가져오는 함수 구현하기
이번엔 컴포넌트 코드에 http://localhost:4000 등 API 서버 주소를 반복해서 하드 코딩하지 않도록 getSererUrl 이란 이름의
유틸리티 함수를 구현한다. src/server 디렉터리를 만들고 4개의 파일을 생성한다. 그리고 getServerUrl.ts 에 코드를 작성한다.
이제 API 서버의 주소가 바뀌면 한 줄만 수정하면 되므로 유지.보수가 간편해진다.

### 🕸️ HTTP GET 과 DELETE 메서드 호출용 함수 구현하기
앞서 GetTest.tsx 코드의 fetch('서버_API_URL') 부분은 앞서 작성한 함수를 사용해서 다음과 같이 작성할 수 있다.
```typescript
fetch(getServerUrl('/test'))
```
그런데 위 코드는 fetch의 두 번째 매개변수 init 부분을 다음처럼 구현해도 된다.
```typescript
fetch(getServerUrl('/test'), {method:'GET'})
```
마찬가지 이유로 HTTP DELETE 메서드는 method 설정값만 DELETE 로 변경해주면 쉽게 구현할 수 있다. getAndDel.ts 파일에 코드를 작성한다.
delete 는 자바스크립트 키워드이므로 함수 이름을 del 로 한다.

### 🕸️ HTTP POST 와 PUT 메서드 호출용 함수 구현하기
POST 와 PUT 은 method 설정만 다를 뿐 사용법은 같다. 다음은 POST, PUT 메서드를 사용하여 data 변수에 담긴 데이터를 서버에
보내는 기본 코드이다.
```typescript
fetch(getServerUrl(path), {
  method:'POST' | 'PUT',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify(data)
})
```
그런데 POST와 PUT 메서드는 cors 문제가 있으므로 다음처럼 mode와 cache, credentials 속성값을 추가해 줘야 된다.
```typescript
fetch(getServerUrl(path), {
  method:'POST' | 'PUT',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify(data)
  mode: 'cors',
  cache: 'no-cache'
  credentials:'same-origin'
})
```
이러한 내용으로 postAndPut.ts 에 코드를 작성한다. 그리고 index.ts에 디렉터리의 내용을 반영한다.

### 🕸️ 몽고DB 에서 데이터 가져오기
src/routes/RestTest 의 GetTest.tsx 파일을 다시 구현한다. 코드는 get('/test') 를 호출하여 몽고DB에서 'test' 컬렉션의
모든 문서를 가져오는 기능과 get('/test/1234)를 호출하여 id 값이 '1234' 인 문서만 가져오는 기능을 함께 구현한다.  
GET ID:1234 의 경우에 값이 null 인 경우 null로 표기 된다. 그래서 server의 testRouter.ts 파일을 아래와 같이 수정한다.
```typescript
// ... (생략) ...
 .get('/:id', async (req, res) => {
      const {id} = req.params
      console.log('1', id)
      try {
        const findOneResult = (await test.findOne({id})) || {}
        res.json({ok: true, findOneResult})
      } catch (e) {
        
      }
// ... (생략) ...
```

### 🕸️ 컬렉션에 데이터 저장하기
PostTest.tsx 파일에 코드를 작성한다. 이 코드는 앞서 구현한 post 함수를 사용하여 랜덤한 카드 데이터를 서버에 보낸다.
실행 결과는 `<POST>` 를 클릭한 후 다시 `<GET ID:1234>` 를 클릭해보면 두 버튼이 같은 내용을 출력하는 것을 볼 수 있다.


### 🕸️ id 속성값만 추려내기
PutTest.tsx 파일은 PostTest.tsx 와 유사하지만 서버에서 수신받은 data 객체에서 id 값만 따로 얻는다. 서버에서 수신한 data의 타입을 ok라는
필수 속성과 body, errorMessage라는 선택 속성이 있는 타입으로 선언하고, Body 타입은 다시 id라는 속성이 반드시 있는 Record 타입으로 선언했다.
실행 결과는 버튼을 클릭했을 때 data?.body?.id 값이 정상으로 추출된 것을 보여준다. 

### 🕸️ 데이터 지우기
DeleteTest.tsx 파일에는 del 함수를 사용하여 몽고DB test 컬렉션의 id 값이 '1234'인 문설르 지우는 기능을 구현한다.
실행결과는 `DELETE ID:1234`를 클릭한뒤 'GET ID:1234'를 클릭해보면 도큐먼트가 삭제됐음을 확인할 수 있다.

