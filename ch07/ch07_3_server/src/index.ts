import {createServer} from 'http'

const hostname = 'localhost'
const port = 4000

createServer((req, res) => {
  console.log('req.url', req.url)
  console.log('req.method', req.method)
  console.log('req.headers', req.headers)
  res.write('hello world!')
  res.end()
}).listen(port, () => console.log(`connect http://${hostname}:${port}`))
