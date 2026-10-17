import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'
import { setupAuthInterceptor } from './api/Services/authInterceptor.ts'


// the axios instance itself (baseURL, withCredentials) is configured in api/client.ts

// on a 401 (expired access token), transparently refresh via the refresh-token
// cookie and retry the request once, instead of forcing the user to log in again.
setupAuthInterceptor()

// https://mswjs.io/docs/integrations/browser/#conditionally-enable-mocking
async function enableMocking() {
  const mocking = import.meta.env.VITE_API_MOCKING

  if (mocking === 'enabled') {
    const { worker } = await import('./mocks/Browser');
    console.log("yep, the MSW worker should be running");
    return worker.start()
  }

  // e2e mode: only the 3 external-medicine-price endpoints are mocked, so
  // e2e runs never call the real api.medicinpriser.dk. Everything else is
  // unhandled by MSW and bypassed straight through to the real local API.
  if (mocking === 'external-only') {
    const { worker } = await import('./mocks/BrowserExternalOnly');
    console.log("[msw] external-only mocking is running — only ExternalMedicinePrices endpoints are mocked");
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
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


