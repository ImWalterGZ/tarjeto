import { useState, useEffect } from "react";
import Container from "../../../Components/Cards/Container";
import OfertasActivasCards from "./OfertasActivasCards";
import apiClient from "../../../../../config/axios";

export default function OfertasActivas({ negocio }) {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!negocio || !negocio.publicID) {
        console.log("OfertasActivas: No negocio data available", negocio);
        return;
      }

      console.log(
        "OfertasActivas: Fetching promotions for negocio:",
        negocio.publicID
      );

      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get(
          `/programa-lealtad/negocio/${negocio.publicID}`
        );

        console.log("OfertasActivas: API response status:", response.status);
        console.log("OfertasActivas: Raw API data:", response.data);

        if (response.data.success && response.data.data) {
          // Extract promotions from all niveles
          const extractedPromotions = [];

          console.log(
            "OfertasActivas: Processing niveles:",
            response.data.data.niveles.length
          );

          response.data.data.niveles.forEach((nivel) => {
            console.log(
              `OfertasActivas: Processing nivel ${nivel.nombre} (${
                nivel.nivel
              }) with ${nivel.promocionesAsignadas?.length || 0} promos`
            );

            if (
              nivel.promocionesAsignadas &&
              nivel.promocionesAsignadas.length > 0
            ) {
              nivel.promocionesAsignadas.forEach((promo) => {
                if (promo.activa && promo.promocionID) {
                  console.log(
                    "OfertasActivas: Adding promotion:",
                    promo.promocionID.titulo
                  );
                  extractedPromotions.push({
                    ...promo.promocionID,
                    nivelNombre: nivel.nombre,
                    nivel: nivel.nivel,
                  });
                } else {
                  console.log(
                    "OfertasActivas: Skipping inactive promotion or missing data",
                    promo
                  );
                }
              });
            }
          });

          console.log(
            "OfertasActivas: Final extracted promotions:",
            extractedPromotions
          );
          setPromotions(extractedPromotions);
        } else {
          console.log(
            "OfertasActivas: No data or success in response",
            response.data
          );
        }
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError(
          err.response?.data?.message || "Error al obtener las promociones"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, [negocio]);

  console.log("OfertasActivas: Rendering with promotions:", promotions.length);

  return (
    <Container
      titulo={"Ofertas Activas"}
      button={"Ver todas"}
      to={"/dashboard/negocio/promociones"}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">Cargando ofertas...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-red-500">{error}</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">No hay ofertas activas</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {promotions.slice(0, 6).map((promo) => (
            <OfertasActivasCards
              key={promo._id}
              titulo={promo.titulo}
              descripcion={promo.descripcion}
              nivel={promo.nivel}
              nivelNombre={promo.nivelNombre}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
