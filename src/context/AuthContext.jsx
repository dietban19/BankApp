import React, { useContext, useState, useEffect, createContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
  doc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
const AuthContext = createContext();

// Custom hook to access AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState();
  const [email, setEmail] = useState('');
  const [authErr, setAuthError] = useState('');
  const [step, setStep] = useState(0);
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider); // Google sign-in
      const user = result.user;

      if (user) {
        const { displayName, email, uid, photoURL } = user;
        const createdAt = new Date(); // Current date

        // Reference to Firestore document for the user
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        // If user does not exist in Firestore, add the new user document
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            fullName: displayName,
            email,
            createdAt,
            photoUrl: photoURL,
            userId: uid, // Store the Firebase Auth UID as userId
          });
          const accountsCollectionRef = collection(userDocRef, 'accounts');

          // Create default account
          const docRef = await addDoc(accountsCollectionRef, {
            id: 1,
            name: 'Main Account',
            balance: 0,
            type: 'Chequing',
            currency: 'CAD',
            createdAt, // Store the creation date
          });

          // Update the document with its own ID
          await updateDoc(docRef, { documentId: docRef.id });
        }

        setCurrentUser(user); // Update the currentUser state with the authenticated user
      }
    } catch (error) {
      console.error('Error during Google Sign-In', error); // Handle sign-in errors
    }
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
    return unsubscribe;
  }, []);

  // Function to check if email exists
  // Function to check if email exists using fetchSignInMethodsForEmail
  const isEmailAlreadyInUse = async (email) => {
    setLoader(true);
    try {
      const usersCollection = collection(db, 'users');
      //   Create a query to find the user with the given email
      const q = query(usersCollection, where('email', '==', email));
      //   Execute the query
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log('User with this email exists.');
        return true; // Email found
      } else {
        console.log('No user found with this email.');
        return false; // Email not found
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
    // setLoading(false);
  };
  // Modified signup function that checks if the email already exists
  const signup = async () => {
    console.log(email, password);

    // const emailExists = await isEmailAlreadyInUse(email);

    // if (emailExists) {
    //
    // }
    try {
      if (!email || !password) {
        setAuthError('No Email or Password!');
        return;
        //   throw new Error('No Email');
      } else {
        // return createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setAuthError(error.code);
    }

    // If the email is not in use, proceed with creating a new user
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const [accounts, setAccounts] = useState();
  const [total, setTotal] = useState();
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const userId = currentUser.uid;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const accountsRef = collection(db, 'users', userId, 'accounts');
        const querySnapshot = await getDocs(accountsRef);

        if (querySnapshot.empty) {
          setAccounts([]);
        } else {
          const accountsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          let totalAmount = 0;
          accountsData.forEach((account) => {
            totalAmount += account.balance;
          });
          setTotal(totalAmount);

          // setTotal(totalAmount);
          setAccounts(accountsData);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [currentUser]);
  const [balance, setBalance] = useState(0);
  const [balanceSavings, setBalanceSavings] = useState(0);
  const [balanceChequing, setBalanceChequing] = useState(0);

  useEffect(() => {
    if (accounts) {
      let totalAmount = 0;
      accounts.forEach((account) => {
        totalAmount += account.balance;
      });
      setBalance(totalAmount);
      const getTotalSavingsBalance = (accounts) => {
        return accounts
          .filter((account) => account.savings) // Filter accounts with savings = true
          .reduce((total, account) => total + account.balance, 0); // Sum their balances
      };

      // Example usage:
      const totalSavings = getTotalSavingsBalance(accounts);
      setBalanceSavings(totalSavings);

      const getTotalChequingBalance = (accounts) => {
        return accounts
          .filter((account) => account.chequing) // Filter accounts with savings = true
          .reduce((total, account) => total + account.balance, 0); // Sum their balances
      };

      // Example usage:
      const totalChequing = getTotalChequingBalance(accounts);
      setBalanceChequing(totalChequing);
    }
  }, [accounts]);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    isEmailAlreadyInUse,
    loading,
    loader,
    setLoader,
    email,
    setEmail,
    password,
    setPassword,
    authErr,
    setAuthError,
    step,
    setStep,
    googleSignIn,
    accounts,
    setAccounts,
    total,
    setTotal,
    balanceSavings,
    setBalanceSavings,
    balance,
    setBalance,
    balanceChequing,
  };

  // Provide the auth context only when loading is done
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
