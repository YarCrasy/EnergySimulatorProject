import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './hooks/AuthHooks.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider initialStrategy='firebase'>
      <App />
    </AuthProvider>
  </StrictMode>,
)
