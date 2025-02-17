import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
import ReactModal from 'react-modal';

const root = ReactDOM.createRoot(document.getElementById('root'));
ReactModal.setAppElement('#root');
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
