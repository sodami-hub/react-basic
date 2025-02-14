### src/data/util.ts
- 가짜 데이터를 만드는 함수<br>
    makeArray: 주어진 길이의 배열을 생성하고, 모든 요소를 null로 채웁니다.<br>
    range: 주어진 최소값과 최대값 사이의 숫자 배열을 생성합니다.<br>
    random: 주어진 최소값과 최대값 사이의 임의의 정수를 반환합니다<br>

### src/data/image.ts
- 이 함수는 주어진 너비와 높이로 Picsum Photos 서비스에서 이미지를 가져오는 URL 생성

### src/data/chance.ts
- chance 파키지를 불러와서 가상의 데이터를 불러오는 함수를 만든다.

### src/data/date.ts
- luxon 패키지는 '19시간 전' 형태로 날짜를 만들 때 필요한 DateTime 객체를 제공한다.
- 임의의 Date 객체를 가져오면 현재 시간과 비교해서 '()시간 전'의 형태로 출력할 수 있다.
- 임의의 Date 객체의 값을 보기 좋은 문자열의 형태로 바꿀 수 있다.

### src/data/index.ts
- index.ts 파일은 디렉터리에 구현한 기능을 호출하는 쪽에서 간편하게 쓸 수 있게 하는 것을 목적으로 한다.
- /src/App.tsx 를 보면 'import * as D from './data'' 명령으로 한번에 data 디렉터리의 모든 함수를 불러온다.

### tip)
- export : export 키워드는 모듈에서 정의된 함수, 객체, 변수 등을 다른 모듈에서 사용할 수 있도록 내보내는 역할을 합니다. 이를 통해 코드의 재사용성을 높이고 모듈 간의 의존성을 관리
- import * as U from './util' :  util 모듈에서 내보낸 모든 멤버를 U라는 네임스페이스로 가져오는 코드
- TypeScript로 작성된 함수 선언 문법
```
export const makeArray = (length: number) => new Array(length).fill(null);
```
export: 이 키워드는 이 함수를 모듈 외부에서 사용할 수 있도록 내보냅니다.<br>
const makeArray: makeArray라는 상수에 함수를 할당합니다.<br>
(length: number) =>: length라는 숫자 타입의 매개변수를 받아들이는 화살표 함수입니다.<br>
new Array(length).fill(null): 주어진 길이의 배열을 생성하고, 모든 요소를 null로 채웁니다<br>

- import 문의 형태에 따른 의미<br>
    [import Chance from 'chance']  
  이는 기본(default) import입니다. chance 모듈의 기본 내보내기(default export)를 가져옵니다.
  chance 모듈은 단일 기본 객체나 함수를 내보내며, 이를 Chance로 가져옵니다.<br>
    [import {DateTime} from 'luxon']  
  이는 명명된(named) import입니다. luxon 모듈에서 특정 명명된 내보내기(named export)인 DateTime을 가져옵니다.
  luxon 모듈은 여러 명명된 객체나 함수를 내보내며, DateTime은 그 중 하나입니다.
- JSX(JavaScript XML), javascript에 XML을 추가한 확장된 문법<br>
    리액트 사용시 JSX를 사용해서 HTML과 js를 모두 포함하는 컴포넌트를 생성한다.<br>
    JSX내에서 {}중괄호는 js 표현식을 포함하는 데 사용된다. 이를 통해 값을 동적으로 삽입하거나, 함수를 호출하거나, 계산을 직접 수행할 수 있다. 중괄호가 없으면 일반 텍스트로 처리된다.
