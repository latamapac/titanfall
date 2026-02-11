import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AppV2 from './AppV2';
import { ErrorBoundary } from './components/ErrorBoundary';

// Check if V2 is requested
const isV2 = window.location.pathname === '/v2';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {isV2 ? <AppV2 /> : <App />}
    </ErrorBoundary>
  </StrictMode>,
);
