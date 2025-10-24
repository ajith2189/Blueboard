import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google"

import App from './App.tsx'
import './index.css';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
)
