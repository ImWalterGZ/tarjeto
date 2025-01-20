import LogrosCards from "./LogrosCards";

export default function Logros() {
  return (
    <div className="hidden w-full h-2/4 md:block">
      <h1 className="my-2 text-2xl font-bold text-red-primary">
        Mis ultimos logros
      </h1>
      <div className="w-full bg-gray-background rounded-xl h-5/6">
        <LogrosCards />
      </div>
    </div>
  );
}
