import LogrosCards from "./LogrosCards";

export default function Logros() {
  return (
    <div className="w-full h-2/4 hidden md:block">
      <h1 className="font-bold text-red-primary text-2xl my-2">
        Mis ultimos logros
      </h1>
      <div className="bg-gray-background w-full rounded-xl h-5/6">
        <LogrosCards />
      </div>
    </div>
  );
}
