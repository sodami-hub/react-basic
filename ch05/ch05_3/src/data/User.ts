import * as D from './index'

export type IUser = {
  uuid:string
  name:string
  jobTitle:string
  email:string
  avatar:string
}

// makeUser 함수 생성, 사용자 정보를 받아서 IUser 타입의 객체를 생성, 입력받은 매개변수들을 속성을 가지는 IUser 객체 반환
export const makeUser = (
  uuid:string, name:string, jobTitle:string, email:string, avatar:string
):IUser=>({uuid, name,jobTitle,email,avatar})

// makeRandomUser 함수 생성, 이 함수는 무작위 사용자 데이터를 생성해서 IUser 객체를 반환한다.
export const makeRandomUser = ():IUser => makeUser (
  D.randomUUID(),
  D.randomName(),
  D.randomJobTitle(),
  D.randomEmail(),
  D.randomAvatar()
)
