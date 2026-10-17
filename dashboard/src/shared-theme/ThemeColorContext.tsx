import { createContext, useContext } from "react";

// 1. Création du contexte
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Hook personnalisé pour consommer facilement le contexte partout
export const useColorMode = () => useContext(ColorModeContext);

