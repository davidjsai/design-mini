import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DesignCanvas } from './components/design-canvas/design-canvas'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesignCanvas/>
  </StrictMode>,
)
