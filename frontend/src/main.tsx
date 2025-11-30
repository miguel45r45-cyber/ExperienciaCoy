import React from 'react'//importamos libreria react
import ReactDOM from 'react-dom/client'//permite usar la app en el navegador
import { BrowserRouter } from 'react-router-dom'//activa la navegacion de la pagina
import App from './App'//importamos app que tendra todo lo que manejara la app
import { UserProvider } from './UserContext'
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')!).render(//acede al div root y muestra todos los componentes
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{/*activamos uina mejora para que el rendimiento de la app sea mas rapida*/}
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>//para que quede encapsulado los cpmponentes y activa el sistema de rutas
)
