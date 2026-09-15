
import { Contact } from "./pages/Contact";

import "./css/site.css";

import { Infos } from "./pages/Infos";
import { Home } from "./pages/Home";
import { Reservation } from "./pages/Reservation";
import { NotFound } from "./pages/NotFound";
import { ErrorBoundary, LocationProvider, Route, Router } from "preact-iso";
import { Layout } from "./components/Layout";

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Layout>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/infos" component={Infos} />
            <Route path="/contact" component={Contact} />
            <Route path="/reservation" component={Reservation} />
            <Route default component={NotFound} />
          </Router>
        </Layout>
      </ErrorBoundary>
    </LocationProvider>
  );
}
