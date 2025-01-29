import CardTitle from "./CardTitle";
import CardContainer from "./CardContainer";
export default function Container({ titulo, button, children }) {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <CardTitle titulo={titulo} button={button} />
      <CardContainer> {children} </CardContainer>
    </div>
  );
}
