import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'

// https://mswjs.io/docs/integrations/browser/#conditionally-enable-mocking
async function enableMocking() {
  if (import.meta.env.VITE_API_MOCKING !== 'enabled')
    return

  const { worker } = await import('./mocks/Browser');
  console.log("yep, the MSW worker should be running");

  return worker.start()
}

// start msw mocking, if we are in "dev" mode, start msw, if not dev, do nothing.
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider> 
        <App />
      </Provider>
    </StrictMode>,
  )
})


