import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

document.documentElement.classList.add('js')
createRoot(document.getElementById('root')).render(<HashRouter><App /></HashRouter>)
