# 07-2 프로그래밍으로 몽고 DB 사용하기

## 🎈 프로젝트 만들기
```shell
# package.json 파일을 생성한다.
> yarn init -y  
# 타입스크립트를 개발언어로 사용하는 Node.js 프로젝트는 항상 다음 3개의 패키지를 설치한다. typescript, ts-node는 전역으로 설치했지만 관행으로 설치해준다.
# @types/node 패키지는 setTimeout과 같은 자바스크립트 엔진이 제공하는 기능을 타입스크립트에서 사용할 때 필요한 타입 라이브러리이다.
> yarn add -D typescript ts-node @types/node 
# 다음 명령으로 tsconfig.json 설정 파일을 만든다.
> tsc --init
# 타입스크립트 언어로 몽고DB를 사용하려면 다음의 패키지를 설치한다.
> yarn add mongodb
> yarn add -D @types/mongodb
```

## 🎈 몽고DB와 연결하기
프로그래밍으로 다음 URL을 사용하면 몽고DB와 연결할 수 있다. mongodb는 프로토콜이름이고, localhost는 호스트이름, 기본  포트는 27017이다.
```
mongodb://localhost:27017
```
mongodb 패키지는 몽고db와 연결을 쉽게 할 수 있도록 MongoClient 클래스를 제공한다.

```typescript jsx
import {MongoClient} from "mongodb";
```
MongoClient 클래스는 다음처럼 connect 정적 메서드를 제공하여 프로미스 형태로 MongoClient 인스턴스를 얻는다.
```
static connect(url:string): Promise(MongoClient)
```
이제 몽고DB 관련 유틸리티 함수를 만들기 위해 src 디렉터리에 mongodb란 이름의 디렉터리를 만들고 이 디렉터리에 connectAndUseDB.ts, index.ts
파일을 생성한다.  
그리고 src/mongodb/connectAndUseDB.ts 에 코드를 작성한다. 이 코드는 몽고셸에서 use 명령으로 DB를 선택한 것과 같다.  
src/test/connectTest.ts 파일을 만들고, 접속을 테스트하기 위한 코드를 작성한다.  
터미널에서 다음 명령으로 실행한다. 몽고DB가 응답하여 실행 결과를 출력하면 접속에 성공한 것이다. 몽고DB 클라이언트가 계속
동작 중이므로 결과를 확인했으면 ctrl+c를 눌러 종료한다.
```shell
> ts-node src/test/connectTest.ts 
```

## 🎈 컬렉션의 CRUD 메서드
프로그래밍으로 몽고DB의 CRUD를 어떻게 하는지 알아보겠다. 몽고셸에서는 'db.컬렉션_이름'형태로 컬렉션에 접근할 수 있었는데,
프로그래밍으로는 다음과 같은 형태로 접근해야 된다.
```
db.collection(컬렉션_이름)
```

### 🕸️ 문서 생성 메서드 사용하기
이제 user라는 이름의 컬렉션에 insertOne 과 insertMany 메서드를 사용하여 데이터를 입력해보겟다. 다음은 두 메서드의 타입 선언문으로
둘 모두 프로미스 객체를 반환함을 알 수 있다.
```
insertOne(doc: OptionalUnlessRequiredId<TSchema>, options?: InsertOneOptions): Promise<InsertOneResult<TSchema>>;
insertMany(docs: ReadonlyArray<OptionalUnlessRequiredId<TSchema>>, options?: BulkWriteOptions): Promise<InsertManyResult<TSchema>>;
```
먼저 src/test/insertTest.ts 파일을 생성하고 문서 생성 메서드를 사용하는 코드를 작성한다. 그리고 다음 명령으로
파일을 실행한다. jack과 janeAndTom은 몽고셸에서 실행 결과와 일치한다. 이 실행 결과는 InsertOneResult 와
InsertManyResult 타입이 어떤 속성들을 제공하는지 알려준다.
```shell
\ch07\ch07_2_server> ts-node .\src\test\insertTest.ts
jack {
  acknowledged: true,
  insertedId: new ObjectId('67dbb0ae4a9e1ad95edac480')
}
janeAndTom {
  acknowledged: true,
  insertedCount: 2,
  insertedIds: {
    '0': new ObjectId('67dbb0ae4a9e1ad95edac481'),
    '1': new ObjectId('67dbb0ae4a9e1ad95edac482')
  }
```
ctrl+c 를 눌러 프로그램을 종료한다.

### 🕸️ 문서 검색 메서드 사용하기
findOne 과 find 메서드는 다음과 같이 타입 선언문으로 프로미스 객체를 반환하는 findOne 과 달리 
find는 FindCursor 타입 객체를 반환한다.
```
findOne(filter: Filter<TSchema>): Promise<WithId<TSchema> | null>;
find(filter: Filter<TSchema>, options?: FindOptions & Abortable): FindCursor<WithId<TSchema>>;
```

FindCursor 타입 객체는 다음 코드에서 보듯 toArray 란 메서드를 제공하여 find 의 반환값을 배열로 바꿔준다.
```typescript
const cursor = await find({})
const arrayResult = cursor.toArray()
```
src/test/findTest.ts 파일을 생성하고 코드를 작성한다. 코드는 findOnd 과 find 메서드로 'user' 컬렉션에
저장된 문서를 검색하는데, find는 커서 타입 객체가 반환되므로 이 객체의 toArray 메서드를 호출하여 배열로 만든다.  
코드를 실행하면 앞선 insertTest.ts 에서 user 컬렉션에 삽입한 문서들을 확인할 수 있다.

### 🕸️ 문서 수정 메서드 사용하기
문서 수정 관련 메서드들**(updateOne, updateMany, findOneAndUpdate)**은 모두 프로미스 객체를 반환한다.
그런데 findOneAndUpdate 메서드를 호출할 때 몽고셸에서는 returnNewDocument 속성값을 true(변경된 값 반환)로 했지만,
프로그래밍으로 이와 같은 효과를 보려면 속성값을 'after'로 해야 된다.(before 와 after 중 하나를 사용한다.) 
src/test/updateTest.ts 파일을 생성하고 코드를 작성한다.

### 🕸️ 문서 삭제 메서드 사용하기
deleteOne과 deleteMany 메서드는 모두 프로미스 객체를 반환한다.
src/test/deleteTest.ts 파일을 생성하고 코드를 작성한다.




## 🎈
### 🕸️








































