# 03-1 리액트 컴포넌트의 CSS 스타일링
이 절에서는 CSS(cascading style sheet) 관점에서 리액트 프로젝트의 구조와 컴포넌트 CSS 스타일링 기법을 알아본다.<br>
먼저 src/copy 디렉터리의 CopyMe.tsx 파일을 복사하여 이번 절에서 작성할 5개의 파일을 pages 디렉터리에 만든다.

## 🎈컴포넌트 스타일링
리액트 컴포넌트의 스타일링은 CSS를 사용한다. 리액트 프로젝트도 큰 시각에서 보면 index.html 파일에 HTML 코드를 작성하고 
`<script>` 태그 안에 자바스크립트 코드를 작성하는 일반적인 웹 프런트엔드 개발과 크게 다르지 않다.

### 🕸️부트스트랩 사용해 보기
리액트 개발에서 CSS 부분은 부트스트랩과 같은 CSS 프레임워크를 사용할 때가 많다. 부트스트랩 사용 방법은 공식 홈페이지(getbootstrap.com)에서 첫번째 메뉴인 [Docs]를 클릭한다.
이어서 부트스트랩을 시작하는 방법을 소개하는 페이지가 나오면 문서 중간 즈음 CDN links 부분에 있는 CSS 경로를 복사한다. 그리고 public 디렉터리의 index.html 에 붙여 넣는다.

### 🕸️부트스트랩 컴포넌트 구현하기
부트스트랩 문서에서 [Forms -> Overview]를 클릭한다. 본문의 Overview 단락 아래에 있는 HTML을 복사한 후 Bootstrap.tsx 의 return 문 뒤에 넣는다.<br>
그리고 파일을 저장하면 소스 곳곳에 빨간 밑줄이 나타난다(내 경우에는 문제없이 적용이 됐다?).<br><br> 
***아마도 인텔리제이에서 원문의 class와 for 속성을 자동으로 className과 htmlFor로 바꿔주는것 같다?*** 

### 🕸️리액트 className과 htmlFor 속성
JSX 문은 React.createHTMLElement 함수 호출 코드로 전환된다. 그런데 이 전환 과정에서 자바스크립트(혹은 타입스크립트) 키워드인 class와 for가 혼란을 준다.
이 때문에 리액트에서는 class 대신 className, for 대신 htmlFor 라는 속성명을 사용해야 한다.<br>
그리고 JSX는 XML 규격에 자바스크립트를 결합한 구문이라고 했는데, XML 규격은 HTML4 스타일을 이해하지 못한다.
따라서 반드시 스스로 닫는 태 형태로 JSX 구문을 작성해야 한다. 이 내용들을 수정하고 나면 웹 브라우저에 부트스트랩이 적용되는것을 확인할 수 있다.

## 🎈웹팩과 CSS 파일 임포트
앞선 예제에서 부트스트랩의 .css 파일을 <link> 태그의 href 속성에 설정하는 형태로 사용했다. 하지만 리액트 프로젝트가 내부적으로 사용하는 웹팩은 .css 파일을 더 쉽게 사용할 수 있게 해준다.<br>
웹팩은 이미지와 CSS, 자바스크립트 또는 타입스크립트 코드가 혼합된 프로젝트를 서비스하기 좋게 만들어 준다. 
특히 웹팩은 타입스크립트 코드에서 import 문 형태로 CSS 파일을 <link> 태그 없이 이용할 수 있게 해준다.

## 🎈CSS 기본 구문
## 🎈선택자란?
## 🎈import 규칙으로 아이콘 사용하기
CSS는 @import, @media 등 @으로 시작하는 구문을 제공하는데, 이런 구문을 앳 규칙(at rules)이라고 한다.
CSS의 @import 규칙은 `<link rel='stylesheet href>`대신 .css 파일에서 다른 .css 파일을 사용하고자 할 때 적용한다.  
다음은 @import 로 구글 머티리얼 아이콘 세트를 사용하는 코드이다.
```css
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
```
이제 src/index.css 파일을 수정한다. 이 코드는 @import 규칙을 적용해 구글 아이콘 세트를 사용한다.  
그리고 src/pages/Icon.tsx 에 코드를 작성한다. index.css에서 .materal-icons 클래스 선택자를 작성했으므로 <span> 요소의 
className에 material-icons 을 설정한다. 소스 파일을 저장하고 브라우저를 확인하면 해당하는 아이콘이 보인다.

#### ✨Tip - 아이콘 이름을 어떻게 알 수 있을까?
아이콘 이름은 구글 머티리얼 아이콘 사이트(fonts.google.com/icons)에 나와 있다. 그런데 구글 웹 페이지에는 아이콘 이름이
'Check Circle Outline'으로 나와 있지만, 타입스크립트 코드에서 사용할 때는 'check_circle_outline'처럼 스네이크 표기법으로 작성해야한다.

## 🎈style 속성을 사용한 인라인 스타일링
HTML 요소는 다음 코드에서 보듯 style이라는 속성에 문자열로 된 CSS 코드를 설정할 수 있다. 즉, 컴포넌트의 스타일링은 클래스 선택자 방식으로도 할 수 있고,
style 속성을 사용하는 인라인 방식으로도 할 수 있다.
```html
<div style="width: 100px; height: 100px; background-color: blue"/>
```
그런데 리액트 컴포넌트의 style 속성은 문자열이 아닌 객체여야 한다. 이 때문에 앞으로 style 속성에 설정하는 객체를 '스타일 객체'라고 부르겠다.
아래 코드는 앞선 HTML 코드를 리액트용 스타일 객체를 사용하는 방법으로 바꾼것이다.
```typescript jsx
<div style={{width: `100px`, height: '100px', backgroundColor:'blue'}}/> 
```
이제 src/pages/Style.tsx 를 작성한다. 이 코드는 `<span>` 요소의 style 속성값에 스타일 객체를 설정한다.  
웹 페이지를 확인하면 변경된 스타일을 확인할 수 있다.

## 🎈Node.js 패키지 방식으로 아이콘 사용하기
@import 방식의 한 가지 문제점은 다른 사이트에 호스팅된 외부 CSS 파일을 가져오므로 네트워크 속도에 영향을 받을 수 있다.
따라서 대부분 웹 애플리케이션은 Node.js 패키지 형태로 구현된 CSS 프레임워크를 내장하는 형태로 배포한다. 

### 🕸️웹 안전 글꼴과 fontsource
@import 규칙은 웹에 안전한 글꼴, 즉 웹 안전 글꼴을 사용해야 한다는 제약이 있다. 웹 안전 글꼴은 데스크톱, 모바일 등 모든 장치에서 동작하는 
모든 브라우저에 적용할 수 있는 글꼴이다. 웹 안전 글꼴은 사용자 컴퓨터에 설치되지 않은 때에도 웹 페이지에 항상 올바르게 표시되는 글꼴을 의미한다.
구글이 제공하는 모든 글꼴은 웹 안전 글꼴이다.  
fontsource(fontsource.org)는 구글 글꼴과 같은 오픈소스 웹 안전 글꼴을 패키지 형태로 설치해 준다. fontsource 지원 글꼴들은 다음 명령으로 설치할 수 있다.
```
yarn install @fontsource/케밥-표기법-글꼴명
```

### 🕸️머터리얼 아이콘 설치하기
구글 머티리얼 아이콘을 fontsource 방식으로 설치해보겠다. 먼저 fontsource.org/fonts 웹 페이지에서 material 이란 이름이 있는 패키지를 검색해서 
Material Icons 를 선택해서 Install 탭으로 들어가면 사용법을 알 수 있다. 
```
> yarn add @fontsource/material-icons
```

### 🕸️머티리얼 아이콘 사용하기
머키리얼 아이콘 패키지를 설치했기 때문에 index.css 에 작성한 @import 규칙은 필요가 없어졌다. 해당 내용을 주석처리하고
src/index.tsx 파일에 다음처럼 코드를 작성한다.
```typescript
import '@fontsource/material-icons'
```

## 🎈Icon 사용자 컴포넌트 구현하기
앞서 구글 머티리얼 아이콘은 다음과 같은 형태로 사용했다.
```typescript jsx
<span className={'material-icons'}>home</span>
<span className={'material-icons'}>check_circle_outline</span>
```
그런데 이 형태 보다는 다음처럼 사용하는 것이 더 간결해 보인다.
```typescript jsx
<Icon name={"home"} />
<Icon name={"check_circle_outline"} />
```
그리고 다음처럼 style 속성을 활용해 인라인 스타일리도 할 수 있게 하고 싶다.
```typescript jsx
<Icon name={"home"} style={{color: 'blue'}} />
<Icon name={"check_circle_outline"} style={{fontSize:'50px', color:'red'}} />
```
이렇게 사용할 수 있는 사용자 컴포넌트 Icon을 만들어 보겠다. 먼저 src/components 디렉터리를 만들고
여기에 index.ts와 Icon.tsx 파일을 만들고 코드를 작성한다.
```typescript jsx
// Icon.tsx
export type IconProps = {}

export const Icon: FC<IconProps> = props => {
return <span className={'material-icons'} />
}
```

이어서 src/pages/UsingIcon.tsx 파일을 작성한다. 하지만 Icon 컴포넌트는 현재 name, style 속성이 없으므로 오류가 발생한다.
이 부분을 해결해보겠다.

### 🕸️name, style 속성 추가하기

## 🎈Icon 컴포넌트 개선하기
타입스크립트는 점 3개를 이어쓰는 ... 연산자를 제공한다. 이 연산자는 쓰이는 곳에 따라 전개 연산자로 사용될 때도 있고,
다음처럼 잔여 연산자로 사용될 수 있다. 이 코드는 props 객체에서 name 속성만 분리하고 나머지 속성은 ...remains 형태로 얻고 있다.

```typescript jsx
export const Icon: FC<IconProps> = ({name, ...remains}) => {
    return <span {...remains}>{name}</span>
} 
```
다음 Icon.tsx 파일은 매개변수에 잔여 연산자를 적용하여 굳이 style 값을 분리하지 않고,
props 부분을 분리한 뒤 02-4절에서 알아본 JSX의 {...props} 구문으로 'style={style}' 형태의 코드를 생략한다.
```typescript jsx
export const Icon: FC<IconProps> = ({name, ...props}) => {
    return (
        <span className={'material-icons'} {...props}>
      {name}
    </span>
    )
}
```
그런데 이 방식은 Icon에 className과 같은 속성을 추가하려고 할 때 좀 번거로운 부분이 있다.
이제 가장 리액트다운 방식으로 Icon 컴포넌트를 구현해보겠다.

### 🕸️클래스 선택자 사용하기
먼저 src/App.css 의 내용을 모두 지우고 CSS 클래스 선택자 2개를 구현한다.
```CSS
.text-blue {color:blue;}
.text-red {color:red;}
```
그리고 UsingIconWithClass.tsx 파일을 구현한다. 이 코드는 UsingIcon과 비교할 때 App.css에 구현해 놓은 
text-blue, text-red 라는 CSS 클래스 선택자를 설정한다는 차이가 있다.
```typescript jsx
<Icon name={"home"} className={"text-blue"}/>
<Icon name={"check_circle_outline"} className={"text-red"} style={{fontSize:"50px"}} />
```
그런데 이 코드가 동작하려면 src/component 디렉터리의 Icon 컴포넌트에 className속성을 추가해야 한다.
이때 앞서 본 style 속성 방식으로 추가하기에는 번거롭다. 그래서 리액트 프레임워크는 한꺼번에 특정 HTML 요소의 속성드을 추가할 수 있게 해주는
DetailedHTMLProps 와 HTMLAttributes 타입을 제공한다.

### 🕸️리액트가 제공하는 DetailedHTMLProps 와 HTMLAttributes 타입
span 요소의 정의 부분을 살펴보면
```typescript
span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
```
다음 코드는 위의 코드를 더 읽기 좋게 작성한 것이다. 여기서 ReactSpanProps가 바로 `<span>` 요소의 모든 속성을 표현하는 타입이다.

```typescript
import type {FC, DetailedHTMLProps, HTMLAttributes, AllHTMLAttributes} from "react";

type ReactSpanProps = DetailedHTMLProps<AllHTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
```

### 🕸️타입스크립트의 교집합 타입 구문
함수형 언어에서는 | 기호를 쓰는 합집합 타입과 & 기호를 쓰는 교집합 타입이란 구문을 제공한다. 
예를 들어 A|B는 'A 또는 B인 타입'이라는 의미이고, A&B는 'A이고 B인 타입'이라는 의미이다.
즉, A&B 타입은 A와 B의 요소를 모두 가지고 있어야 한다. 다음 IconProps 타입은 ReactSpanProps 타입이면서
동시에 특별히 이름을 짓지 않은 {name:string} 인 타입이다.
```typescript jsx
export type IconProps = ReactSpanProps & {
    name:string
}
```
IconProps가 이 2가지 타입의 교집합 타입이므로 다음처럼 {name:string} 타입의 name 속성과 
ReactSpanProps 타입의 props를 잔여 연ㅅ나자 구문으로 각기 얻을 수 있다.
```typescript jsx
export const Icon = FC<IconProps> = ({name, ...props}) => {}
```

### 🕸️타입스크립트에서 매개변수 이름 바꾸기
타입스크립트는 매개변수 이름 뒤에 콜론(:)을 붙이는 방식으로 매개변수 이름을 다른 이름으로 바꿀 수 있다.
다음 코드는 className 이란 변수 이름을 _className 으로 바꾸는 예이다.
```typescript jsx
export const Icon : FC<IconProps> = ({name, className:_className,...props}) => {}
```

### 🕸️완성된 Icon 컴포넌트
지금까지 내용을 적용하여 Icon.tsx 를 완성하겠다. <Icon className="text-blue">와 <Icon />인 경우를 모두 대비하려고 
어느 때나 필요한 material-icons 클래스를 className에 적용했다.