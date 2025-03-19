```# ✨ 07 몽고DB와 API서버
이 장에서는 Node.js 환경에서 익스프레스 프레임워크와 몽고DB를 활용하여 다양한 기능을 하는 API 서버를 만든다.

# 07-1 몽고 DB 이해하기
이 절에서는 몽고 DB 를 설치하고 몽고셸의 사용법을 알아본다. 몽고셸에서 데이터를 다루면서 몽고 DB의 특징을 알아볼 것이므로
리액트 프로젝트를 만들지는 않는다.

## 🎈 콩고 DB 란?
몽고 DB 는 NoSQL 시스템이다. SQL 을 사용하지 않고 자바스크립트와 같은 전혀 다른 방식의 질의어를 사용한다. 사용자 측면에서 몽고DB의
가장 큰 특징은 자바스크립트를 질의어로 사용한다는 것이다. 이 때문에 자바스크립트를 알기만 하면 몽고DB를 사용하려고 특별히 다른 언어를
배울 필요가 없다.  
관계형 DB에 익숙한 개발자들은 왜 굳이 몽고DB와 같은 NoSQL DB를 사용하는지 의아해할 수 있다. 여기서 몽고DB를 사용하는 이유는 05장에서
리덕스 저장소에 만들었던 listidOrders, listidCardidOrders 와 같은 배열 형태의 데이터는 관계형 DB에 저장하기 어렵고 구현 방법도
복잡하기 때문이다.  
반면에 몽고DB는 JSON 포맷으로 바꿀 수 있는 모든 자바스크립트 객체를 자유롭게 저장할 수 있어서 배열 데이터를 저장하고 다루기가 매우 편리하다.
또한 SQL을 질의어로 사용하는 관계형 DB와 달리, 자바스크립트 언어를 질의어로 사용하므로 특정 데이터를 조회할 때 구현 방법이 매우 자유로운
장점이 있다.

### 🕸️ 몽고DB 설치하기
mongodb.com 에서 플랫폼별 설치 파일을 내려받은 후 실행한다. 그런데 윈도우에서는 몽고DB 서버가 서비스 방식으로 동작한다.
따라서 기본 옵션으로 설치하다가 설정 유형에서 `Complete`을 클릭하고 [Install MongoD as a Service]와 그 아래
[Run service as Network Service user] 가 선택된 상태로 Next를 클릭한다.

### 🕸️ 몽고DB 셸 설치하기
몽고DB 뿐 아니라 대다수의 DB 시스템은 데몬이나 서비스 형태로 동작하는 DB 서버와 DB 서버에 접속하여 다양한 DB 작업을 서버에 전달하는
DB 클라이언트 두 부분으로 동작한다. 셸은 명령 줄 방식으로 입력한 명령을 서버에 전달하여 다양한 DB 작업을 할 수 있게 해주는 대표적인
DB 클라이언트 프로그램이다.  
몽고DB 셸(몽고셸)은 홈페이지에서 플랫폼별 파일을 내려받아 기본 옵션으로 설치한다. 몽고DB는 다음 명령으로 셸 프로그램을 실행한다.
파워셸이나 터미널에서 다음 명령을 입력한다.
```shell
> mongosh
```
셸에서 exit를 입력하면 몽고셸에서 빠져나올 수 있다.

### 🕸️ DB 목록 조회하기
몽고셸에서 show dbs 명령은 현재 설치된 데이터베이스의 목록을 알고 싶을 때 사용한다. 이 명령을 실행하면 몽고DB가 설치될 때
기본으로 생성되는 3개의 DB를 보여준다.
```shell
> show dbs
```

### 🕸️ DB 선택하기
DB를 사용하려면 먼저 'use DB_이름' 형태의 use 명령으로 DB를 선택해야 한다. 다음은 local 이라는 DB를 선택하는 명령이다.
```shell
>use local
```

### 🕸️ 사용중인 DB 이름 보기
가끔 현재 사용 중인 DB 이름을 알아야 할 때가 있다. 이때는 db 명령을 사용한다.
```shell
> db
local
```

### 🕸️ DB 생성하기
흥미롭게도 새로운 DB를 생성하는 명령이 없다. 몽고DB는 '있으면 사용하고 없으면 생성하는' 형태로 동작한다. 따라서 mydb라는 DB를
만들고 싶으면 use 명령을 사용하면 된다.
```shell
>use mydb
```
그런데 이 시점에서 새로운 DB를 생성하지 않는다. 새로운 DB는 실제 데이터가 새로운 DB에 생성될 때 만들어진다. 이제 다음 명령으로
실제 데이터를 하나 만들어 보겠다.
```shell
mydb> db.user.insertOne({name:'Jack'})
{
  acknowledged: true,
  insertedId: ObjectId('67d91ec5274b6e1bf7b71236')
}
mydb>
```

### 🕸️ 특정 DB 지우기
현재 사용 중인 DB를 삭제하려면 일단 use 명령으로 삭제하고 싶은 DB를 선택해야 한다. 그러고 나서 다음 명령으로 db를 삭제할 수 있다.
```shell
local> use mydb
switched to db mydb
mydb> db.dropDatabase()
{ ok: 1, dropped: 'mydb' }
mydb> show dbs
admin    40.00 KiB
config  108.00 KiB
local    40.00 KiB
```

## 🎈 컬렉션과 문서
RDBMS 에서는 데이터들을 여러 개로 나누어 각각을 테이블이라는 곳에 저장한다. 그리고 테이블에 저장되는 한 건의 데이터를 레코드라고 부른다.
즉, RDBMS에서 테이블이란 테이블에 정의된 스키마에 맞춰 작성된 레코드 저장소이다.  
몽고DB 에서는 테이블을 컬렉션(collection)이라고 부르는데, 스키마가 있는 저장소가 테이블이므로 이 둘을 서로 구분하기 위해 
스키마가 없는 저장소를 컬렉션이라고 한다. 그리고 RDBMS의 레코드에 해당하는 한 건의 데이터를 문서(document)라고 한다. 즉, 몽고 DB에서
컬렉션이란 스키마 없이 자유롭게 저장된 여러 개의 문서를 보관하는 저장소이다.

### 🕸️ 새로운 컬렉션 만들기
DB에 새로운 컬렉션을 생성하려면 다음 명령을 사용한다. "user"라는 이름의 컬렉션을 기본 옵션으로 생성한 예이다. 만약 컬렉션 설정 옵션을
지정하고 싶으면 {} 안에 작성한다.
```shell
local> use mydb
switched to db mydb
mydb> db.createCollection("user",{})
{ ok: 1 }
mydb>
```

### 🕸️ DB의 컬렉션 목록 보기
현재 사용 중인 DB의 모든 컬렉션을 보려면 다음 명령을 실행한다.
```shell
mydb> db.getCollectionNames()
[ 'user' ]
mydb>
```

### 🕸️ 컬렉션 삭제하기
생성한 컬렉션을 삭제한다. user 라는 이름의 컬렉션을 삭제하는 예이다.
```shell
mydb> db.user.drop()
true
mydb> db.getCollectionNames()
[]
mydb>
```

### 🕸️ _id 필드와 ObjectId 타입
모든 몽고DB 문서는 _id라는 특별한 이름의 필드를 가지는데, 이 필드는 문서가 DB에 저장될 때 자동으로 만들어진다. _id 필드는 UUID와 개념적으로 같지만,
- 기호없이 ObjectId("문자열") 의 형태로 사용해야 한다.

```shell
mydb> db.user.find({})
[
  { _id: ObjectId('67da199a274b6e1bf7b71238'), name: 'jack' },
  { _id: ObjectId('67da19a6274b6e1bf7b71239'), email: 'jill@a.com' }
]
mydb>
```
몽고DB는 Object("문자열") 부분을 다음처럼 생성하고 해석한다.

<img src="../../images/07-01.png" width="450">

## 🎈 컬렉션의 CRUD 메서드
대다수 DB 시스템은 데이터를 생성(C), 검색(R), 수정(U), 삭제(D) 할 수 있게 하는 CRUD 메서드를 제공한다. 몽고DB 또한 CRUD를 제공한다.

<img src="../../images/07-02.png" width="400">

### 🕸️ 문서 생성 메서드 사용하기
몽고DB는 스키마가 없는 DB이다. 또한 컬렉션을 db.createCollection 메서드로 생성하지 않아도, `db.컬렉션_이름.insertOne` 형태의
명령을 사용하면, 해당 이름의 컬렉션이 자동으로 생성된다.  
몽고셸에서 mydb란 이름의 DB를 선택하고, 'user' 란 이름의 컬렉션의 모든 문서를 지운다.
```shell
> use mydb
> db.user.drop()
```
다음 명령으로 user 컬렉션에 문서를 하나 생성한다. 
```shell
mydb> db.user.insertOne({name:'jack', age:32})
{
  acknowledged: true,
  insertedId: ObjectId('67da1bb8274b6e1bf7b7123a')
}
mydb>
```

이번에는 insertMany 메서드를 사용한다. insertMany는 여러 문서 데이터를 배열 형태로 받으므로 문서 데이터 2개를 배열로 넣는다.
실행 결과는 insertMany 호출 결과 배열에 담긴 문서 순서대로 생성된 _id 값을 insertedIds 란 필드에 필드에 담은 것을 보여준다.
```shell
mydb> db.user.insertMany([{name:'jane', age:27},{name:'lee', age:13}])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('67da1c32274b6e1bf7b7123b'),
    '1': ObjectId('67da1c32274b6e1bf7b7123c')
  }
}
mydb>
```

### 🕸️ 문서 검색 메서드 사용하기
findOne과 find 메서드는 다음처럼 검색 조건(query)을 매개변수로 전달해야 하며, 검색 조건은 객체 형태로 표현해야 한다. 만일 컬렉션의 모든
문서를 검색하고 싶다면 검색 조건을 {} 로 설정한다. findOne은 검색 조건을 만족하는 문서 중 가장 먼저 찾은 문서 하나만 반환한다.
```shell
mydb> db.user.findOne({})
{ _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 32 }
mydb> db.user.find({})
[
  { _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 32 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 27 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lee', age: 13 }
]
mydb> db.user.find({name:'jane'})
[
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 27 }
]
mydb>
```
age 필드값이 20보다 큰 문서를 찾는 예이다. 이때 $gt는 몽고DB의 연산자이다. 이에 대해서 자세히 살펴보겠다.
```shell
mydb> db.user.find({age:{$gt:20}})
[
  { _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 32 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 27 }
]
mydb>
```

### 🕸️ 몽고DB에서 연산자란?
몽고DB에서는 $gt 처럼 달러 기호를 접두사로 사용하는 키워드를 연산자라고 한다. 많은 종류의 연산자를 제공한다. 그 중에서
검색 조건을 만들 때 사용하는 연산자에 대해서 알아보겠다. 검색 연산자는 다음과 같은 형식으로 사용한다.
```
{ 필드_이름1: { 검색_연산자1:값1}, 필드_이름2: { 검색_연산자2:값2 }, ... }
```

#### *비교 연산자 알아보기*
다음과 같은 비교연산자를 제공한다.

<img src="../../images/07-03.png" width="300">

그런데 가끔 어떤 필드가 여러 값 중에서 일치하는 값을 가지는 문서를 찾거나, 또는 반대로 여러 값 중에서 하나도 일치하지 않는 값을
가지는 문서를 찾아야 할 때가 있다. 이때 사용하는 연산자는 다음과 같다.

<img src="../../images/07-04.png" width="500">


#### *논리 연산자 알아보기*

<img src="../../images/07-05.png" width="500">

다음 명령은 검색 조건 2개를 $and 연산자로 표현한 예이다.
```shell
mydb> db.user.find({$and : [{ name: {$in:['jack','lee']}}, {age:{$lt:20}} ] } )
[ { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lee', age: 13 } ]
mydb>
```

#### *$regex 정규식 연산자*
자바스크립트는 RegEx 라는 이름의 클래스로 정규 표현식이란 기능을 제공한다. 정규식은 "이름이 J로 시작하는 모든 것" 처럼 와일드카드
검색을 할 때 유용한 기능이다. 
```javascript
const re = new RegEx(정규식)
const _re = /정규식/
```
그런데 보통 정규식을 제공하는 많은 프로그래밍 언어는 '/' 문자를 정규식 앞뒤에 붙여 좀 더 간결한 방법으로 만들 수 있게 한다.  
다음은 $regex 연산자로 name 필드값이 'j' 로 시작하는 모든 문서를 찾는 예이다.
```shell
mydb> db.user.find( {name: {$regex:/^j.*$/} } )
[
  { _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 32 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 27 }
]
mydb>
```

#### *필드 업데이트 연산자 알아보기*
컬렉션의 update 관련 메서드는 문서의 특정 필드값을 다른 값으로 바꾸는 데 사용되며, 몽고DB는 다음 표처럼 필드 업데이트 연산자를 제공한다.
이 필드 업데이트 연산자로 특정 조건에 만족하는 문서의 필드값을 어떻게 수정하는지 알아보겠다.

<img src="../../images/07-06.png" width="550">

#### *문서 수정 메서드 사용하기*
updateOne, updateMany, findOneAndUpdate 등은 컬렉션에 저장된 문서의 필드값을 수정하는 메서드로서, 사용법은 다음과 같으며
옵션 부분은 생략할 수 있다.

<img src="../../images/07-07.png" width="550">

다음 명령은 user 컬렉션에 저장된 문서 가운데 name 필드값이 'l'로 시작하는 문서를 찾아 'john'으로 바꾸고 
age 값은 10만큼 증가시키는 예이다. 

```shell
mydb> db.user.find ( { name : { $regex:/^l.*$/ } } )
[ { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lee', age: 13 } ]
mydb> db.user.updateOne( { name : { $regex:/^l.*$/ } } , { $set : {name : 'lex'} , $inc: {age:10 } } )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
mydb> db.user.find ( { name : { $regex:/^l.*$/ } } )
[ { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 23 } ]
mydb>
```

결과를 보면 검색 조건에 맞는 문서가 한 건이라는 의미로 matchedCount 속성값이 1이며, 수정된 문서가 1건이란 의미로
modifiedCount 속성값도 1 임을 확인할 수 있다. updateOne 은 겁색 조건에 맞는 문서 중 1개만 선택하여 수정한다.  
  
다음은 이름이 'j'로 시작하는 모든 문서의 age를 10씩 증가시키는 명려이다. 결과를 보면 검색 조건에 맞는 모든 문서를 
수정하므로 matchCount는 2이고, jack, jane 의 age 값이 10씩 증가했다.

```shell
mydb> db.user.find({})
[
  { _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 32 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 27 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 23 }
]
mydb> db.user.updateMany( { name : { $regex : /^j.*$/ } } , { $inc: {age:10} } )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 2,
  modifiedCount: 2,
  upsertedCount: 0
}
mydb> db.user.find({})
[
  { _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 42 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 37 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 23 }
]
mydb>
```

이번엔 findOneAndUpdate 메서드를 실행해보겠다. 결과를 보면 앞서 updateOne 과 문서를 수정하는 것은 같지만,
반환값에 차이가 있음을 알 수 있다. findOndAndUpdate 메서드의 반환값은 수정한 값이 아니라 수정 전의 값을 반환한다.

```shell
mydb> db.user.findOneAndUpdate ( { name:'jane'}, { $set : {age:100} } )
{ _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 37 }
mydb> db.user.find({})
[
  { _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 42 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 100 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 23 }
]
mydb>
```

만약 수정된 값을 반환받으려면 옵션에 다음처럼 returnNewDocument 속성값을 true로 설정해야 한다.
```shell
mydb> db.user.findOneAndUpdate ( { name : 'lex' }, {$set : { age: 1} } ,{ returnNewDocument : true} )
{ _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 1 }

mydb> db.user.find({})
[
  { _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 42 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 100 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 1 }
]
```

#### *문서 삭제 메서드 사용하기*
컬렉션에 담긴 문서를 삭제할 때는 다음처럼 deleteOne 과 deleteMany 메서드를 사용하며 옵션은 생략할 수 있다.

<img src="../../images/07-08.png" width="600">

다음 명령은 name 필드값이 'j'로 시작하는 문서 중 맨 처음 찾은 문서를 삭제한다. 결과를 보면 'j'ㅁ로 시작하는
2개의 문서 중 처음 찾은 'jack' 만 삭제됐다.
```shell
mydb> db.user.find({})
[
  { _id: ObjectId('67da1bb8274b6e1bf7b7123a'), name: 'jack', age: 42 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 100 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 1 }
]
mydb> db.user.deleteOne( { name : { $regex : /^j.*$/ } } )
{ acknowledged: true, deletedCount: 1 }
mydb> db.user.find({})
[
  { _id: ObjectId('67da1c32274b6e1bf7b7123b'), name: 'jane', age: 100 },
  { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 1 }
]
mydb>
```

deleteMany 메서드를 사용해서 name 필드값이 문자 'j' 로 시작하는 문서들을 모두 삭제한다. 

```shell
mydb> db.user.deleteMany( { name : { $regex : /^j.*$/ } } )
{ acknowledged: true, deletedCount: 1 }
mydb> db.user.find({})
[ { _id: ObjectId('67da1c32274b6e1bf7b7123c'), name: 'lex', age: 1 } ]
```










































































