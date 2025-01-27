import React from 'react';
import Accounts from './components/Accounts';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import AccountDetails from './pages/AccountDetails';

function App() {
  const { currentUser, loading } = useAuth();
  console.log(currentUser);

  if (loading) {
    return (
      <>
        <div className="h-screen w-full flex justify-center items-center text-xl bg-red-100">
          Loading
        </div>
      </>
    );
  }
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/sign-in" />}
        />

        {/* Sign-In Route */}
        <Route
          path="/sign-in"
          element={!currentUser ? <Auth /> : <Navigate to="/dashboard" />}
        />
        {currentUser && (
          <>
            <Route path="/account/:accountId" element={<AccountDetails />} />
          </>
        )}
      </Routes>
      <Dashboard />
    </div>
  );
}

export default App;
