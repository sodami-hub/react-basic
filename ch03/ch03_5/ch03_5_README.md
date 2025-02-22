# 03-5 daisyui CSS 컴포넌트 이해하기
프로젝트에 설치한 daisyui 플러그인의 주요 CSS 컴포넌트를 알아본다.  
이 절의 src/pages 디렉터리는 서브 디렉터리를 만드는 방식으로 구성한다. 이때 문제는 '../components' 처럼 상대 경로를 사용하면 컴파일 오류가 발생한다는 점이다.
따라서 src/copy/CopyMe.tsx 파일 내용을 수정해서 상대 경로 문제가 발생하지 않도록 한다.  
src/pages 디렉터리에 특정 컴포넌트를 구현하다 보면, 이 컴포넌트를 다시 여러 개 서브 컴포넌트로 나누어 구현할 필요가 생긴다.
이때 '컴포넌트.tsx' 파일보다는 '컴포넌트/index.tsx' 파일을 만둘고, 이 컴포넌트 디렉터리 안에 해당 컴포넌트를 구현하는 데 필요한
서브 컴포넌트 파일들을 만드는 것이 코드 관리에 유리하다.

## 🎈CSS 컴포넌트란?
03-1 에서 잠시 알아본 부트스트랩 등 거의 모든 CSS 프레임워크는 btn btn-primary 형태로 원하는 HTML 요소의 스타일링을 쉽게 하는 CSS 클래스를 제공한다.
이들 CSS 프레임워크(혹은 CSS라이브러리)를 'CSS 컴포넌트'라고 부른다.

## 🎈색상 테마
웹 디자인에서는 웹 페이지에서 가장 많이 사용되는 색상을 주 색상이라고 한다. 그런데 웹 페이지의 성격에 따라 주 색상은 각기 다를 수 있다.
그리고 두 번째로 많이 사용되는 색상을 보조 색상이라고 한다.  
그런데 색상은 주 색상과 보조 색상만으로 구분하지 않고 필요에 따라서 좀 더 다양한 색상을 사용할 수 있다. daisyui 플러그인의 색상 테마로는
강조, 정보, 경고나 오류 색상 등을 제공한다. 보통 이런 색상들을 한꺼번에 부를 때 '색상 테마'라고 한다.

## 🎈 Button 컴포넌트 구현하기
daisyui의 button CSS 컴포넌트는 다음과 같은 형태로 사용한다.
```typescript jsx
<button className="btn btn-primary">button</button>
```
그런데 만일 Button 이란 리액트 컴포넌트가 있어서 다음처럼 사용할 수 있다면, 좀 더 쉽게 사용할 수 있다.
```typescript jsx
<Button className={"btn-primary"}>button</Button>
```
한 걸음 더 나아가 아무런 설정도 하지 않으면 기본값이 적용되도록 한다면 좀 더 간결할게 사용할 수 있다.
```typescript jsx
<Button>button</Button>
```
src/theme/daisyui 디렉터리를 만들고 여기에 daisyui CSS 컴포넌트를 쉽게 사용할 수 있는 다양한 테마 컴포넌트를 구현해보겠다.
해당 디렉터리에 index.ts, Button.tsx 파일을 만들고 Button.tsx 코드를 작성하겠다.

### 🕸️서브 컴포넌트 만들기
src/pages/ButtonTest 디렉터리에 Basic.tsx, Size.tsx, IconTest.tsx 파일을 추가한다. 각가의 파일에 코드를 작성한다.
먼저 Basic.tsx 코드를 작성하고 웹 브라우저에서 확인하면 daisyui의 button 컴포넌트와 theme/daisyui 디렉터리의 Button 컴포넌트가 똑같다는 것을 알 수 있다.
물론 같은 클래스로 만들어서 그렇다.

### 🕸️'btn' 부분 생략하기
daisyui의 button 컴포넌트는 항상 btn btn-primary 형태로 btn 클래스를 명시해 줘야 하므로 조금 불편하다.
theme/daisyui/Button.tsx의 className에 btn 클래스를 기본으로 설정해 주어 이런 불편을 해소한다.

### 🕸️ 버튼의 크기 설정하기
daisyui의 button 컴포넌트는 다음처럼 크기를 설정하는 4가지 클래스를 제공한다. src/pages/ButtonTest/Size.tsx 에 코드를 작성한다.

## 🎈 Icon 컴포넌트 구현하기
