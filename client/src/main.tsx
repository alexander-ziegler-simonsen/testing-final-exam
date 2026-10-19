import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'
import { setupAuthInterceptor } from './api/Services/authInterceptor.ts'


setupAuthInterceptor()

// https://mswjs.io/docs/integrations/browser/#conditionally-enable-mocking
async function enableMocking() {
  const mocking = import.meta.env.VITE_API_MOCKING

  if (mocking === 'enabled') {
    const { worker } = await import('./mocks/config/Browser');
    console.log("yep, the MSW worker should be running");
    return worker.start()
  }

  if (mocking === 'external-only') {
    const { worker } = await import('./mocks/config/BrowserExternalOnly');
    console.log("[msw] external-only mocking is running — only ExternalMedicinePrices endpoints are mocked");
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

/
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider> 
        <App />
      </Provider>
    </StrictMode>,
  )
})


