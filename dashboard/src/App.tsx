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

import NewGuidePage from "./components/forms/NewGuidePage";
import NewCreneauPage from "./components/forms/NewCreneauPage";
import NewParcoursPage from "./components/forms/NewParcoursPage";
import NewVisitePage from "./components/forms/NewVisitePage";
import { Visiteurs } from "./pages/visiteurs";
import NewVisiteurPage from "./components/forms/newVisiteurPage";
import EditParcoursPage from "./components/edits/EditParcour";
import EditGuidePage from "./components/edits/EditGuide";
import EditCreneauPage from "./components/edits/EditCreneau";
import EditVisiteurPage from "./components/edits/EditVisiteur";
import EditVisitePage from "./components/edits/EditVisite";

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
              <Route path="/visites/edit/:id" element={<EditVisitePage />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/visiteurs" element={<Visiteurs />} />
              <Route path="/visiteurs/new" element={<NewVisiteurPage />} />
              <Route
                path="/visiteurs/edit/:id"
                element={<EditVisiteurPage />}
              />
              <Route path="/crenaux" element={<Creneaux />} />
              <Route path="/crenaux/new" element={<NewCreneauPage />} />
              <Route path="/crenaux/edit/:id" element={<EditCreneauPage />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/new" element={<NewGuidePage />} />
              <Route path="/guides/edit/:id" element={<EditGuidePage />} />
              <Route path="/parcours" element={<Parcours />} />
              <Route path="/parcours/new" element={<NewParcoursPage />} />
              <Route path="/parcours/edit/:id" element={<EditParcoursPage />} />
            </Route>
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
