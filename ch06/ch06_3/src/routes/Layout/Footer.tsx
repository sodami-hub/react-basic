import * as D from '../../data'

export default function Footer() {
  return (
    <footer className={'p-4 footer footer-center bg-base-200 text-primary-content'}>
      <div>
        <p>Copyright © 2022 - All right reserved by {D.randomCompanyName()}</p>
      </div>
    </footer>
  )
}
