import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NavbarLayout from "./components/NavbarLayout";
import { ProtectedRoute, PublicOnlyRoute } from "./utils/auth/Routes";
import Dashboard from "./pages/Dashboard";

function App() {

  return (
    <Routes>
      <Route element={<PublicOnlyRoute  />}>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<ProtectedRoute  />}>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
