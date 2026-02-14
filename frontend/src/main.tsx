import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import App from './App';
import './index.css';

// Import the Socket Provider we just created
import { SocketProvider } from './context/SocketContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
           <App />
        </SocketProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);