export default function Color() {
  return (
    <div className={'p-4 bg-sky-700'}>
      <h1></h1>
      <p className={'w-full p-4 text-3xl text-white'}>color</p>
      <div className={'mb-4'}>
        <p className={'text-white'}>Email address</p>
        <input type={'email'} className={'text-gray-300 border-sky-200 border-4'} />
        <p className={'text-rose-500'}>this field is required</p>
      </div>
    </div>
  )
}
