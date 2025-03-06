/*
imageFileReaderP.ts 파일의 imageFileReaderP 함수는 FileReader 객체의 readAsDataURL 메서드를 사용하여
파일을 읽고, 이를 Base64로 인코딩한 문자열을 resolve를 통해 반환한다.
파일을 읽는 도중 오류가 발생하면 reject를 호출하여 에러를 반환한다.

1. 초기 상태: 함수가 호출될 때 file은 Blob 객체로 전달됩니다.
2. FileReader 객체 생성: FileReader 객체가 생성됩니다.
3. 파일 읽기 시작: fileReader.readAsDataURL(file) 메서드를 호출하여 file을 읽기 시작합니다.
4. 파일 읽기 완료: 파일이 성공적으로 읽히면 onload 이벤트가 발생합니다.
5. 결과 처리: onload 이벤트 핸들러에서 e.target?.result를 통해 읽은 파일의 결과를 가져옵니다. 이 결과는 Base64로 인코딩된 문자열입니다.
6. Promise 반환: 결과가 문자열이면 resolve를 호출하여 Base64 인코딩된 문자열을 반환하고, 그렇지 않으면 reject를 호출하여 에러를 반환합니다
 */

export const imageFileReaderP = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader()

    console.log('변경 후후후 : ', file, typeof file)
    fileReader.readAsDataURL(file)
    console.log('변경 후후후gngn : ', fileReader, typeof fileReader)

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result
      console.log('변경 후 : ', result, typeof result)
      if (result && typeof result === 'string') resolve(result)
      else reject(new Error(`imageFileReaderP : can't read image file`))
    }
  })
