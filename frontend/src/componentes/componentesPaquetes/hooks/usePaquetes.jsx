import { useEffect, useState } from "react";
import { fetchPaquetes } from "../services/paquetesService";

export function usePaquetes() {
  const [paquetes, setPaquetes] = useState([]);

  useEffect(() => {
    fetchPaquetes().then(setPaquetes);
  }, []);

  return [paquetes, setPaquetes];
}
