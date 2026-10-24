import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "./firebaseAuth";
import { AuthContext } from "../hooks/useAuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    // S'abonner aux changements d'état d'authentification
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Nettoyage : se désabonner quand le composant est démonté
    return () => unsubscribe();
  }, [auth]);
  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
