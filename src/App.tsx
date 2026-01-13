import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Settings from "@/pages/Settings";
import Stats from "@/pages/Stats";
import AuthCallback from "@/pages/AuthCallback";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="task-tracker-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
