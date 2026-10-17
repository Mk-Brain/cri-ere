import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
  }, // Active les variables CSS natives de MUI v6

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#0F4D3D", // Vert sapin profond (Boutons principaux, AppBar)
          light: "#14674D", // Vert feuillage moyen (Hover)
          dark: "#0A3429",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#8B5E3C", // Brun terreux (Accents)
          light: "#D2B48C", // Sable chaud
          dark: "#5C3E28",
          contrastText: "#FFFFFF",
        },
        info: {
          main: "#759A83", // Sauge douce
        },
        background: {
          default: "#F9FBF9", // Ivoire / Blanc cassé pour le fond
          paper: "#FFFFFF", // Blanc pur pour les cartes
        },
        text: {
          primary: "#0F4D3D", // Vert très sombre
          secondary: "#5C6B61", // Gris-vert doux
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#759A83", // Sauge douce (plus lumineuse en mode sombre)
          light: "#9AB4A4",
          dark: "#526D5C",
          contrastText: "#0F4D3D",
        },
        secondary: {
          main: "#D2B48C", // Sable chaud
          light: "#E5D3B3",
          dark: "#A68A63",
          contrastText: "#121212",
        },
        info: {
          main: "#14674D", // Vert feuillage moyen
        },
        background: {
          default: "#121212", // Fond sombre standard
          paper: "#1E1E1E", // Fond des cartes en mode sombre
        },
        text: {
          primary: "#F9FBF9", // Texte clair
          secondary: "#A3B3A9", // Gris-vert clair
        },
      },
    },
  },
  typography: {
    fontFamily: ["Lato", "Open Sans", "sans-serif"].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
   
  },
});

export default theme;
