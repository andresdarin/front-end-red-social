import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import TimeAgo from 'javascript-time-ago';
import es from 'javascript-time-ago/locale/es.json'

//importar assests, recursos como hojas de estilo, imagenes, fuentes, todo
import './assets/fonts/fontawesome-free-6.1.2-web/css/all.css';
import './assets/css/normalize.css'
import './assets/css/styles.css'
import './assets/css/responsive.css'


//cargar config react time ago
TimeAgo.addDefaultLocale(es)
TimeAgo.addLocale(es)


//Arrancar la appd e react
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
