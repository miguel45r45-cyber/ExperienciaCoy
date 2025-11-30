import { useContext } from "react";
import { UserContext } from "../UserContext";
import AdminCrearPaquete from "../componentes/componentesPaquetes/AdminCreaPaquetes";
import PaquetesList from "../componentes/componentesPaquetes/PaquetesList";
import PublicarMetodoPago from "../componentes/componentesPaquetes/metodosPago/EmitirMedotosPago";
import "../paginas/stylosPaginas/stylePaquetes.css"

function Paquetes (){
    const { user } = useContext(UserContext);

return (
    <div>
        <h1 className="titulopagina">Página de Paquetes</h1>
        
        <div>
            {/* solo muestra al admin */}
            {user?.rol === "admin" && (
                <>
                    <PublicarMetodoPago/>
                    <AdminCrearPaquete />
                </>
            )}
            {/* si no es visible */}
            <PaquetesList />
        </div>
        
    </div>
    )
}
export default Paquetes
