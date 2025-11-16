import { Routes, Route, useLocation } from 'react-router-dom'//imporamos routes y route para definir las paginas de la app y use locacion para detectar la url
import { useEffect } from 'react'// ejecuta el codigo cuando cambie de ruta
import Menu from './componentes/compomenu/Menu'//importamos menu y las paginas
import Inicio from './paginas/Inicio'
import Acceder from './paginas/Acceder'
import Paquetes from './paginas/Paquetes'
import Contactos from './paginas/Contactos'
import Informacion from './paginas/Informacion'
import Reservaciones from './paginas/Reservaciones'

function App() {
  const location = useLocation()//usamos uselocation para saver en que ruta estamos para cambiar elfondo de pantalla

  useEffect(() => {
    const body = document.body

    if (location.pathname === '/') {
      body.classList.add('body-inicio')
      body.classList.remove('body-general')
    } else {
      body.classList.add('body-general')
      body.classList.remove('body-inicio')
    }

    return () => {
      body.classList.remove('body-inicio')
      body.classList.remove('body-general')
    }
  }, [location.pathname])
//mostramos menu en todas las paginas
  return (
    <>
      <Menu />
            <Routes>
              <Route path="/" element={<Inicio/>} />
              <Route path="/Acceder" element={<Acceder/>} />
              <Route path="/Contactos" element={<Contactos />} />
              <Route path="/Paquetes" element={<Paquetes />} />
              <Route path="/Informacion" element={<Informacion />} />
              <Route path="/Reservaciones" element={<Reservaciones />} />
            </Routes>
    </>
  )
}

export default App
