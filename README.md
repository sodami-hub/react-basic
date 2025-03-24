# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

- 리액트 19 정식 릴리즈 부터 create-react-app 명령이 제대로 동작하지 않는다. yarn을 설치하고, yarn을 사용해서 리액트액을 생성해야 된다. [npm install -g yarn]
```
// react 프로젝트의 root 디렉터리(/react)에서
C:\Users\leejinhun\WebstormProjects\react> yarn create react-app [react-first-app : 프로젝트 디렉터리] --template typescript

```
- 위와 같이 yarn 명령어로 리액트 프로젝트를 생성했다.
    - 이후의 모든 dependency 또한 yarn add 명령으로 설치한다.<br>
        yarn add <package...>: dependencies 에 추가한다.<br>
        yarn add <package...> [--dev/-D]: devDependencies 에 추가한다.<br>
        yarn remove <package..> : package.json에 설치된 package를 제거한다.<br>
        yarn global <add/bin/list/remove/upgrade> [--prefix]: 패키지를 시스템 전역에서 설치, 업데이트, 삭제한다. --prefix옵션이 패지키가 설치되는 경로를 지정하는것 같다.<br>
        yarn init : package.json을 생성한다. yarn init --yes/-y 뒤에 옵션은 package.json을 설정하는 질문을 모두 default로 넘어간다.<br>
        yarn install: pcakgae.json의 의존성 모듈을 설치한다. 이때 yarn.lock도 같이 생긴다..<br>
        yarn run : build, eject, start, test 모드로 패키지를 실행한다.<br>
        yarn start : 개발모드로 패키지를 실행한다.<br>
        yarn upgrade [package | package@tag | package@version | --scope @scope]... [--ignore-engines] [--pattern]: package.json에 명시된 범위내에서 패키지의 버젼을 최신으로업그레이드 해주는 기능이다.<br>
        yarn upgrade --latest: --latest옵션은 upgrade처럼 작동하지만 package.json의 범위가 아닌 최신버전으로 설치가 된다. yarn upgrade left-pad@^1.0.0이와 같이 직접 버젼을 설정해줄수도 있다.<br>
      <br>

```shell
yarn create react-app [생성할 프로젝트 디렉터리] --template typescript
yarn add -D @types/luxon @types/chance prettier postcss autoprefixer tailwindcss@3.4.17 @tailwindcss/line-clamp daisyui
yarn add -D @types/redux-logger @types/redux-thunk @types/react-dnd @types/react-beautiful-dnd
yarn add luxon chance @fontsource/material-icons redux react-redux @reduxjs/toolkit redux-logger redux-thunk
yarn add react-dnd react-dnd-html5-backend react-beautiful-dnd react-router-dom
```

## ch07의 몽고DB를 사용한 API서버 개발의 과정에서의 프로젝트 만드는 과정
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

## ch07 // 익스프레스 설치하기
```shell
> yarn add express cors
> yarn add -D @types/express @types/cors nodemon
```

