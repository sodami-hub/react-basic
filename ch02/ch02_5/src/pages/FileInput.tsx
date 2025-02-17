import type {ChangeEvent} from 'react'

export default function FileInput() {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const files: FileList | null = e.target.files // or file=files[i]
        console.log(`file[${i}]:`, files)
      }
    }
  }
  return (
    <div>
      <p>FileInput</p>
      <input type={'file'} onChange={onChange} multiple={false} accept={'image/*'} />
    </div>
  )
}
