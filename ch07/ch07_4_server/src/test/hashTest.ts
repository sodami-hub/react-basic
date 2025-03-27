import * as U from '../utils'

const hashTest = async() => {
  const pw = '1q2w3e'
  try {
    const hashed = await U.hashPasswordP(pw)
    console.log('hashed', hashed)
    const compared = await U.comparePasswordP('1234', hashed)
    console.log('compared', compared)
    const compared2 = await U.comparePasswordP(pw, hashed)
    console.log('compared2', compared2)
  } catch(e) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}

hashTest()