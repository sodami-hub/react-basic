import {createServer} from 'http'
import {createExpressApp} from './express'

const hostname = 'localhost'
const port = 4000

/*


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

createServer(createExpressApp()).listen(port, () =>
  console.log(`Server started on port ${port}`)
)
