import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from 'web3uikit'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MoralisProvider appId="vWSc1Qz0JgKSo5FDJnQWBxXuG93MY4MButeMFLrq" serverUrl="https://5o0le6ijllfh.usemoralis.com:2053/server">
      <NotificationProvider>
        <BrowserRouter basename={document.querySelector('base')?.getAttribute('href') ?? '/'}>
          <App />
        </BrowserRouter>
      </NotificationProvider>
    </MoralisProvider>
  </React.StrictMode>
)
