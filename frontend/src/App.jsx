import FLoatingShape from "./components/FLoatingShape";

function App() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br
     from-red-400  to-red-primary flex items-center justify-center relative overflow-hidden"
    >
      <FLoatingShape
        color="bg-gray-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
    </div>
  );
}

export default App;
