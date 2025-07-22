import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from '@asgardeo/auth-react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider
      config={{
        clientID: "Ze4ZqIzXAQAVQyvf1jl6JnVIYF4a",
        baseUrl: "https://api.asgardeo.io/t/shenalunc",
        scope: ['openid', 'profile'],
        signInRedirectURL: "http://localhost:5173",
        signOutRedirectURL: "http://localhost:5173",
      }}
    >
      <App />
    </AuthProvider>
  </StrictMode>
);