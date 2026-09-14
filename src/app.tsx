import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Contact } from "./pages/Contact";

import { Infos } from "./pages/Infos";
import { Home } from "./pages/Home";
import { Reservation } from "./pages/Reservation";
import { NotFound } from "./pages/NotFound";
import {
  ErrorBoundary,
  LocationProvider,
  Route,
  Router,
} from "preact-iso";

export function App() {
  return (
    <LocationProvider>
      <ErrorBoundary>
        <Header />
        <Router>
          <Route path="/" component={Home} />
          <Route path="/infos" component={Infos} />
          <Route path="/contact" component={Contact} />
          <Route path="/reservation" component={Reservation} />
          <Route default component={NotFound} />
        </Router>
        <Footer/>
      </ErrorBoundary>
    </LocationProvider>
  );
}
