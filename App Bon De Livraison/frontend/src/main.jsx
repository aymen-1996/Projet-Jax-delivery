// main.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx'; // Adjust the path based on your project structure
import { store, persistor } from './redux/store/store'; // Adjust the path based on your project structure
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
);
