import {getServerUrl} from './getServerUrl'

const postAndPut = (methodName: string) => (path: string, data: object) => {
  return fetch(getServerUrl(path), {
    method: methodName,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    mode: 'cors',
    credentials: 'same-origin',
    cache: 'no-cache'
  })
}

export const post = postAndPut('POST')
export const put = postAndPut('PUT')
