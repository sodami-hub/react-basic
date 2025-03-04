// util.ts image.ts 에서 정의한 함수들을 사용해 chance.ts 파일을 구현

import Chance from 'chance'
const chance = new Chance()

export const randomUUID = () => chance.guid()
export const randomName = () => chance.name()
export const randomEmail = () => chance.email()
export const randomId = () => chance.fbid() // facebook id
export const randomJobTitle = () => chance.profession()
export const randomCompanyName = () => chance.company()
export const randomSentence = (words = 5) => chance.sentence({words})
export const randomTitleText = (words = 3) => chance.sentence({words})
export const randomParagraphs = (sentences = 3) => chance.paragraph({sentences})
