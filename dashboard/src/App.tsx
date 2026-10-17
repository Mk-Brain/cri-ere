import { BrowserRouter, Route, Routes } from "react-router";

import Login from "./pages/login";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./shared-theme/AppTheme";
import Home from "./pages/home";
import { Visites } from "./pages/visistes";

import { Messages } from "./pages/messages";
import { Guides } from "./pages/guides";
import { Parcours } from "./pages/parcours";
import { Creneaux } from "./pages/creneaux";

import NewGuidePage from "./pages/forms/NewGuidePage";
import NewCreneauPage from "./pages/forms/NewCreneauPage";
import NewParcoursPage from "./pages/forms/NewParcoursPage";
import NewVisitePage from "./pages/forms/NewVisitePage";
import { Visiteurs } from "./pages/visiteurs";
import NewVisiteurPage from "./pages/forms/newVisiteurPage";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />{" "}
        {/* Normalise le CSS et applique le background.default */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="/login" element={<Login />} />
              <Route path="/visites" element={<Visites />} />
              <Route path="/visites/new" element={<NewVisitePage />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/visiteurs" element={<Visiteurs />} />
              <Route path="/visiteurs/new" element={<NewVisiteurPage />} />
              <Route path="/crenaux" element={<Creneaux />} />
              <Route path="/crenaux/new" element={<NewCreneauPage />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/new" element={<NewGuidePage />} />
              <Route path="/parcours" element={<Parcours />} />
              <Route path="/parcours/new" element={<NewParcoursPage />} />
            </Route>
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
