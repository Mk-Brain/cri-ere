import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { useRef, useState } from "react";
import { app } from "../services/firebaseAuth";

type ConnectionMode = "password" | "google" | "resetPassword";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [connectionMode, setConnectionMode] = useState<ConnectionMode | null>(
    null,
  );
  const requestInProgress = useRef(false);
  const auth = getAuth(app);
  auth.useDeviceLanguage();

  async function signIn(
    mode: ConnectionMode,
    email: string,
    password: string,
    remember: boolean,
  ) {
    if (requestInProgress.current) return;

    requestInProgress.current = true;
    setConnectionMode(mode);
    setIsLoading(true);
    setErrorCode(null);
    setErrorMessage(null);

    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence,
      );

      if (mode === "password") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        setUser(userCredential.user);
      } else if (mode === "google") {
        const provider = new GoogleAuthProvider();
        const savedEmail = localStorage.getItem("email");
        if (savedEmail) {
          provider.setCustomParameters({ login_hint: savedEmail });
        }
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
      } else {
        await sendPasswordResetEmail(auth, email);
        alert(
          `Un e-mail de réinitialisation de mot de passe vous a été envoyé à l'adresse ${email}.`,
        );
      }
    } catch (error: unknown) {
      const code =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string"
          ? error.code
          : null;
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue.";
      setErrorCode(code ?? "unknown");
      setErrorMessage(message);
      console.error("Erreur lors de la connexion :", code, message);
      if (mode === "resetPassword") {
        alert("Une erreur est survenue : " + message);
      }
    } finally {
      requestInProgress.current = false;
      setIsLoading(false);
      setConnectionMode(null);
    }
  }

  return { isLoading, errorCode, errorMessage, user, connectionMode, signIn };
}
