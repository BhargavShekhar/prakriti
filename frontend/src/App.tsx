import { Route, Routes } from "react-router";
import { Dashboard } from "./features/dashboard/components/dashboard";
import { AuthGuard } from "./features/auth/componets/auth-guard";
import { SigninForm } from "./features/auth/componets/sign-in";
import { SignupForm } from "./features/auth/componets/sign-up";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />
      <Route path="/sign-in" element={<SigninForm />} />
      <Route path="/sign-up" element={<SignupForm />} />
    </Routes>
  )
}

export default App
