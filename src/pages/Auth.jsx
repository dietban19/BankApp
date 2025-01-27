import React from 'react';
import { useAuth } from '../context/AuthContext';

function Auth() {
  const { googleSignIn } = useAuth();
  const handleGoogleSignIn = async () => {
    // Placeholder for Google Sign-In logic
    // alert('Google Sign-In clicked');
    await googleSignIn();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Sign In
        </h1>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow hover:bg-green-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Auth;
