import {getServerUrl} from './getServerUrl'

const getAndDel =
  (methodNAme: string) => (path: string, jwt?: string | null | undefined) => {
    let headers = {'Content-Type': 'application/json'}
    let init: RequestInit = {
      method: methodNAme
    }
    if (jwt) {
      init = {
        ...init,
        headers: {...headers, Authorization: `Bearer ${jwt}`}
      }
    } else init = {...init, headers}
    return fetch(getServerUrl(path), init)
  }

export const get = getAndDel('GET')
export const del = getAndDel('DELETE')
