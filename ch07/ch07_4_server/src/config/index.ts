import path from 'path'

export const getPublicDirPath = () => {
  return path.join(process.cwd(), 'public')
}
