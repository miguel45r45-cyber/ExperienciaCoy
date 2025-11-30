import { useEffect, useState } from "react";
import { fetchPaquetes } from "../funcionesAdmin/PaquetesFunciones.jsx";

export function usePaquetes() {
  const [paquetes, setPaquetes] = useState([]);

  useEffect(() => {
    fetchPaquetes().then(setPaquetes);
  }, []);

  return [paquetes, setPaquetes];
}
