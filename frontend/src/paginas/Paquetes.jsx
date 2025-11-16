import AdminCrearPaquete from "../componentes/componentesPaquetes/adminCreaPaquetes"
import PaquetesList from "../componentes/componentesPaquetes/paqueteList"

function Paquetes (){
return (
    <div>
        <h1>Página de Paquetes</h1>
        
        <div>
            {/* solo muestra al admin */}
            {user?.rol === "admin" && <AdminCrearPaquete />}
            {/* si no es visible */}
            <PaquetesList />
        </div>
        
    </div>
    )
}
export default Paquetes
