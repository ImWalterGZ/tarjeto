import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyEmail from "./pages/Verify-email";

function App() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative
      overflow-hidden"
    >
      <Routes>
        <Route path="/" element={"Home"} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="verify-email" element={<VerifyEmail />} />
      </Routes>
    </div>
  );
}

export default App;
