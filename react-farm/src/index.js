import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import { Provider } from 'react-redux'; // ✅ ข้อ 5: นำเข้า Provider (15%)
import store from './state/store.js'; // ✅ ข้อ 5: นำเข้า store (15%)
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ✅ ข้อ 5: ห่อด้วย Provider (15%) */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);