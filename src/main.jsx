import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

//importar assests, recursos como hojas de estilo, imagenes, fuentes, todo
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css';
import './assets/css/normalize.css'
import './assets/css/styles.css'
import './assets/css/responsive.css'



//Arrancar la appd e react
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
