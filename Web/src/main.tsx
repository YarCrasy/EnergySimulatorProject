
import { createRoot } from 'react-dom/client'

import App from './App'
import { AuthProvider } from './hooks/AuthContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
