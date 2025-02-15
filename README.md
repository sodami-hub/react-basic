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
```
// ex) 프리티어 설치(개발용 의존성 추가)
> yarn add -D prettier

// ex) luxon, chance 패키지를 빌드용 의존성과, 개발 의존성에 추가
> yarn add luxon chance
> yarn add -D @types/luxon @types/chance
// 