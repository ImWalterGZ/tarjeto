export default function CardTitle({ titulo, button }) {
  return (
    <div className="flex flex-row px-4 justify-between">
      <h3 className="text-2xl font-bold text-red-primary">{titulo}</h3>
      <h4 className="self-center hover:bg-red-primary hover:text-white  transition-all border border-solid rounded-full align-center middle px-3 py-1 text-red-primary font-semibold text-sm border-red-primary">
        {button}
      </h4>
    </div>
  );
}
