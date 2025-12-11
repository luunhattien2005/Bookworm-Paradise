import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth-interface/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
// import Auth from './auth-interface/Auth.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
