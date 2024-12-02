import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import LandingPage from "./pages/LandingPage";
import LeetCodeGraph from "./components/LeetCodeGraph";
import ProblemsSection from "./components/ProblemsSection";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "./context/userContext";
import Navigation from "./components/Navigation";

function App() {
  const clerkPubKey = "pk_test_cmFwaWQtcmhpbm8tMi5jbGVyay5hY2NvdW50cy5kZXYk";

  return (
    <UserProvider>
      <ClerkProvider publishableKey={clerkPubKey}>
        <Router>
          <Navigation />
          <Routes>
            <Route
              path="/graph"
              element={
                <>
                  <SignedIn>
                    <Layout>
                      <LeetCodeGraph />
                    </Layout>
                  </SignedIn>
                  <SignedOut>
                    <LandingPage />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/problems"
              element={
                <SignedIn>
                  <Layout>
                    <ProblemsSection />
                  </Layout>
                </SignedIn>
              }
            />
            <Route
              path="/"
              element={
                <SignedIn>
                  <Dashboard />
                </SignedIn>
              }
            />
            <Route
              path="/sign-in/*"
              element={<SignIn routing="path" path="/sign-in" />}
            />
            <Route
              path="/sign-up/*"
              element={<SignUp routing="path" path="/sign-up" />}
            />
          </Routes>
        </Router>
      </ClerkProvider>
    </UserProvider>
  );
}

export default App;