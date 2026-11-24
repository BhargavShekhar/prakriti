import { Navigate, Route, Routes } from "react-router";
import { Dashboard } from "./features/dashboard/components/dashboard";
import { AuthGuard } from "./features/auth/componets/auth-guard";
import { SigninForm } from "./features/auth/componets/sign-in";
import { SignupForm } from "./features/auth/componets/sign-up";
import { QuizPage } from "./features/quiz/pages/quiz-page";
import { LeaderboardPage } from "./features/leaderboard/pages/leaderboard-page";

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
      <Route
        path="/quiz/:attemptId"
        element={
          <AuthGuard>
            <QuizPage />
          </AuthGuard>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <AuthGuard>
            <LeaderboardPage />
          </AuthGuard>
        }
      />
      <Route path="/sign-in" element={<SigninForm />} />
      <Route path="/sign-up" element={<SignupForm />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App