import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import DestinationDetails from "@/pages/DestinationDetails";
import ItineraryPlannerPage from "@/pages/ItineraryPlannerPage";
import TourAgents from "@/pages/TourAgents";
import AgentDetail from "@/pages/AgentDetail";
import HotelsPage from "@/pages/HotelsPage";
import AttractionsPage from "@/pages/AttractionsPage";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/destinations/:id" component={DestinationDetails} />
          <Route path="/plan" component={ItineraryPlannerPage} />
          <Route path="/hotels" component={HotelsPage} />
          <Route path="/attractions" component={AttractionsPage} />
          <Route path="/agents" component={TourAgents} />
          <Route path="/agents/:id" component={AgentDetail} />
          <Route path="/trips/:id" component={DestinationDetails} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CurrencyProvider>
      <Router />
    </CurrencyProvider>
  );
}

export default App;
