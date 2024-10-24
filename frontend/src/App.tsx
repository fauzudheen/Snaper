import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import NavbarLayout from "./components/NavbarLayout";
import UserReverseProtectedRoutes from "./utils/routes/UserReverseProtectedRoutes";
import UserProtectedRoutes from "./utils/routes/UserProtectedRoutes";

function App() {

  return (
    <Routes>
      <Route element={<UserReverseProtectedRoutes />}>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<UserProtectedRoutes />}>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
