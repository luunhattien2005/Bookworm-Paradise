import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth-interface/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DialogProvider } from "./header-footer-interface/DialogContext.jsx";
import './index.css'
import App from './App.jsx'
// import Auth from './auth-interface/Auth.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DialogProvider>
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={new QueryClient()}>
            <App />
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </DialogProvider>
  </StrictMode>,
)
