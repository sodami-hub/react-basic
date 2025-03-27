import * as U from '../utils'

const jwtNormalTest = async () => {
  try {
    const jwt = await U.jwtSignP({name: 'Jack', age: 32})
    console.log(jwt)
    const decode = await U.jwtVerifyP(jwt)
    console.log('decoded', decode)
  } catch (e) {
    if (e instanceof Error) {
      console.log('error', e.message)
    }
  }
}
const jwtExceptionTest = async()=> {
  try{
    const decode = await U.jwtVerifyP('1234')
    console.log('decoded',decode)
  }catch(e) {
    if (e instanceof Error) {
      console.log('error',e.message)
    }
  }
}
const jwtExpireTest = async() => {
  const jwt = await U.jwtSignP({name: 'Jack', age: 32}, {expiresIn: '1s'})
  const id = setTimeout(async ()=> {
    try {
      const decode = await U.jwtVerifyP(jwt)
      console.log('decoded',decode)
    } catch (e) {
      if (e instanceof Error) {
        console.log('error',e.message)
      }
    }
  },2000)
}

jwtNormalTest().then(jwtExceptionTest).then(jwtExpireTest)