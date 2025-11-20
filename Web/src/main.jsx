
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './hooks/AuthContext.jsx'
import ReactDOM from 'react-dom/client'


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
