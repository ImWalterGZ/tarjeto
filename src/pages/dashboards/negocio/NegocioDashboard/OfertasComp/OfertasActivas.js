import Container from "../../../../../Components/Cards/Container";
import OfertasActivasCards from "./OfertasActivasCards";
export default function OfertasActivas() {
  return (
    <Container titulo={"Ofertas Activas"} button={"Ver todas"}>
      <div className="grid grid-rows-3 grid-cols-2">
        <OfertasActivasCards
          titulo={"26% de descuento en todos los articulos de casa y dama"}
          nivel={4}
        />
      </div>
    </Container>
  );
}
