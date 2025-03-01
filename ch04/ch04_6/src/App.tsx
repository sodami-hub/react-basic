import ResponsiveContextTest from './pages/ResponsiveContextTest'
import {ResponsiveProvider} from './context'

export default function App() {
  return (
    <ResponsiveProvider>
      <main>
        <ResponsiveContextTest />
      </main>
    </ResponsiveProvider>
  )
}
