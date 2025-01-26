import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EmailVerificacion from "./pages/Verify-email";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

function App() {
  const { revisandoAuth, revisarAuth } = useAuthStore();

  return (
    <div
      className="min-h-screen flex items-center justify-center relative
      overflow-hidden"
    >
      <Routes>
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="verify-email" element={<EmailVerificacion />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
