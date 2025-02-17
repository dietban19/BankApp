import React from 'react';
import Accounts from './components/Accounts';
import Dashboard from './pages/Dashboard/Dashboard';
import { useAuth } from './context/AuthContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import AccountDetails from './pages/AccountDetails';
import Budget from './pages/Budget/Budget';
import BankAccount from './pages/AccountDetails/BankAccount';
import Settings from './pages/Settings/Settings';

function App() {
  const { currentUser, loading } = useAuth();

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
    <div className="">
      <Routes>
        <Route
          path="*"
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
            <Route path="/account/:accountId" element={<BankAccount />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}
      </Routes>
      {/* <Dashboard /> */}
    </div>
  );
}

export default App;
