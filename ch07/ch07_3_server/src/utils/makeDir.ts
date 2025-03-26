import fs from 'fs'

export const makeDir = (dirName: string) => {
  if (!fs.existsSync(dirName)) fs.mkdirSync(dirName)
}
