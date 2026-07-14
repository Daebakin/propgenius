import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global API Interceptor for Seamless Production Integrations (Laravel Subdomain CORS)
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === "string" && input.startsWith("/api/")) {
    const isProduction = 
      window.location.hostname.includes("propsphere.homes") || 
      window.location.hostname.includes("vercel.app");
      
    if (isProduction) {
      const targetUrl = `https://api.propsphere.homes${input}`;
      return originalFetch(targetUrl, init);
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

