import * as M from '../mongodb'

const connectCB = async (db:M.MongoDB)=> {
  try {
    const user = db.collection('user')

    const initDoc =await user.find({}).toArray()
    console.log('initDoc',initDoc)

    await user.updateOne(
      {name : {$regex: /^j.*$/}},
      {$set : {name : 'jack'}, $inc: {age:10}}
    )
    const updateOneResult = await user.find({}).toArray()
    console.log('updateOneResult', updateOneResult)

    await user.updateMany({name: {$regex: /^J.*$/}}, {$inc: {age:10}})
    const updateManyResult = await user.find({}).toArray()
    console.log('updateManyResult', updateManyResult)

    const findOneResult = await user.findOneAndUpdate(
      {name: 'john'},
      {$set: {age: 1000}},
      {returnDocument: 'after'}
    )
    console.log('findOneResult', findOneResult)
  } catch (e) {
    if (e instanceof Error) console.log(e.message)
  }
}

const updateTest = ()=>{
  M.connectAndUseDB(connectCB,'ch07')
}

updateTest()
