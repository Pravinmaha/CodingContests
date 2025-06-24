import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProblemsProvider } from './contexts/ProblemContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProblemsProvider>
      <App />
    </ProblemsProvider>

  </StrictMode>,
)
