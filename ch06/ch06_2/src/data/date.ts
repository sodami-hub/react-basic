// luxon 패키지는 '19시간 전' 형태로 날짜를 만들 때 필요한 DateTime 객체를 제공한다.

// luxon 모듈에서 DateTime 이라는 이름으로 명명된 export만 가져오기
import {DateTime} from 'luxon'

// DateTime으로 다음 코드를 사용하면 '19시간 전'과 같은 형태의 문자열을 만들 수 있다.
// DateTime.fromJSDate(Date_객체).startOf('day').toRelative()
// 이런 코드를 간결하게 호출하기 위해서 date.ts 를 작성한다.

// 임의의 과거 날짜를 생성
export const makeRandomPastDate = () => {
  const value = new Date().valueOf()
  const n = 100000
  return new Date(value - Math.floor(Math.random() * n * n))
}

// Date 객체를 받아서 현재 날짜로부터 상대적인 시간을 나타내는 문자열을 반환한다.
export const makeRelativeDate = (date: Date) =>
  DateTime.fromJSDate(date).startOf('day').toRelative()
export const randomRelativeDate = () => makeRelativeDate(makeRandomPastDate())

// Date 객체를 받아 전체 날짜 형식의 문자열을 반환한다. ex) Fri Feb 14 2025 12:16:16 GMT+0900 (한국 표준시) => "2025년 2월 14일"
export const makeDayMonthYear = (date: Date) =>
  DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL)

// makeRandomPastDate를 사용하여 임의의 과거 날짜를 생성한 후, 전체 날짜 형식을 문자열로 변환한다.
export const randomDayMonthYear = () => makeDayMonthYear(makeRandomPastDate())
