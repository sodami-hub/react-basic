import * as M from '../mongodb'

const connectCB = async (db:M.MongoDB) => {
  try {
    const user = db.collection('user')
    try {
      await user.drop()
    } catch(e) {
      // 오류 무시
    }

    const jack = await user.insertOne({name:'Jack', age:22})
    console.log('jack',jack)
    const janeAndTom = await user.insertMany([
      {name:'Jane', age:13},
      {name:'Tom', age:67},
    ])
    console.log('janeAndTom',janeAndTom)
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message)
    }
  }
}
const insertTest = () => {
  M.connectAndUseDB(connectCB,'ch07')
}

insertTest()