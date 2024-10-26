import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NavbarLayout from "./components/NavbarLayout";
import { ProtectedRoute, PublicOnlyRoute } from "./utils/auth/Routes";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerification from "./pages/EmailVerification";
import ResetPassword from "./pages/ResetPassword";
import ForgotPasswordVerification from "./pages/ForgotPasswordVerification";

function App() {

  return (
    <Routes>
      <Route element={<PublicOnlyRoute  />}>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-verification" element={<EmailVerification/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/forgot-password-verification" element={<ForgotPasswordVerification/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Route>
      <Route element={<ProtectedRoute  />}>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
