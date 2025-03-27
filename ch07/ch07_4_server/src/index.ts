import {createServer} from 'http'
import {createExpressApp} from './express'
import {getPublicDirPath} from './config'
import {makeDir} from './utils'

import type {MongoDB} from './mongodb'
import {connectAndUseDB} from './mongodb'

/*
const hostname = 'localhost'
const port = 4000

createServer((req, res) => {
  console.log('req.url', req.url)
  console.log('req.method', req.method)
  console.log('req.headers', req.headers)
  res.write('hello world!')
  res.end()
}).listen(port, () => console.log(`connect http://${hostname}:${port}`))

*/

/*


// prettier-ignore
const app = express()
  .get('/', (req, res) => {
    res.json({message: 'hello express world!'})
})

createServer(app).listen(port, () => console.log(`connect http://${hostname}:${port}`))

*/

makeDir(getPublicDirPath())

const connectCallback = (db: MongoDB) => {
  const hostname = 'localhost'
  const port = 4000
  createServer(createExpressApp(db)).listen(port, () =>
    console.log(`connect http://${hostname}:${port}`)
  )
}

connectAndUseDB(connectCallback, 'ch07')
