# 05-4 트렐로 따라 만들기

## 🎈칸반 보드란?

### 🕸️ react-dnd 패키지 설치하기
```shell
yarn add react-dnd react-dnd-html5-backend
yarn add -D @types/react-dnd
```
react-dnd 는 리액트 컨텍스트에 기반하여 설계 되었으므로 react-dnd가 제공하는 컴포넌트를 사용하려면,
App.tsx 파일은 DndProvider 컴포넌트가 최상위 컴포넌트로 동작해야 한다.

### 🕸️ react-beautiful-dnd 패키지 설치하기
```shell
yarn add react-beautiful-dnd
yarn add -D @types/react-beautiful-dnd
```

### 🕸️ 앱 상태를 구성하는 멤버 상태 만들기
src/store 디렉터리의 copy 디렉터리를 복사해서 앱 상태를 구성하는 4개의 디렉터리와 관련 파일을 생성하고 루트 디렉터리(src/store)의
파일들에 코드를 작성한다.

### 🕸️ src/pages 에 테스트용 컴포넌트를 만드낟.
src/copy 의 CopyMe 디렉터리를 복사해서 pages 디렉터리에 3개의 디렉터리를 만들고, App.tsx 파일에 코드를 작성한다.
프로젝트를 실행해서 기본적인 세팅에 이상이 없는지 확인한다.

### 🕸️