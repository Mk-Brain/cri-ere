import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../services/firebaseAuth";

export function useSignIn(
  email: string,
  password: string,
  remember: boolean,
  connectionMode: "password" | "google" | null,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const persistenceType = remember
    ? browserLocalPersistence
    : browserSessionPersistence;
  const auth = getAuth(app);

  useEffect(() => {
    const singInWithPassword = () => {
    if (email && password)
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setUser(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorCode(errorCode);
          setErrorMessage(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
  }
    const singInWithGoogle = () => {
    auth.useDeviceLanguage();
    const provider = new GoogleAuthProvider();
    if (localStorage.getItem("email")) {
      provider.setCustomParameters({
        login_hint: localStorage.getItem("email") as string,
      });
    }
    return signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //const credential = GoogleAuthProvider.credentialFromResult(result);
        //const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        setUser(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorCode(errorCode);
        setErrorMessage(errorMessage);
        // The email of the user's account used.
        //const email = error.customData.email;
        // The AuthCredential type that was used.
        //const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
    if (connectionMode) {
      setTimeout(() => {
        setIsLoading(true);
      }, 0);
      setPersistence(auth, persistenceType).then(() => {
        return connectionMode === "password"
          ? singInWithPassword()
          : singInWithGoogle();
      });
    }
  }, [auth, connectionMode, email, password, persistenceType]);

  return { isLoading, errorCode, errorMessage, user };
}
