import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import LiveTour from "./pages/LiveTour";
import GuideProfile from "./pages/GuideProfile";
import Dashboard from "./pages/Dashboard";
import UniversityIntegration from "./pages/UniversityIntegration";
import HousingTours from "./pages/HousingTours";
import LocalBusinesses from "./pages/LocalBusinesses";
import Listings from "./pages/Listings";
import ListingDashboard from "./pages/ListingDashboard";
import CreateListing from "./pages/CreateListing";
import NotFound from "./pages/NotFound";
import CampusListingMarketplace from "./pages/CampusListingMarketplace";
import SignUp from "./pages/SignUp";
import Visitor from "./pages/demo";
import Publisher from "./pages/AntMedia"; // Importing the AntMedia Publisher component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tour/:tourId" element={<LiveTour />} />
            <Route path="/guide/:guideId" element={<GuideProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/university-integration"
              element={<UniversityIntegration />}
            />
            <Route path="/housing-tours" element={<HousingTours />} />
            <Route path="/local-businesses" element={<LocalBusinesses />} />
            <Route path="/listings" element={<Listings />} />
            <Route
              path="/listingmarketplace"
              element={<CampusListingMarketplace />}
            />
            <Route path="/listing-dashboard" element={<ListingDashboard />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/demo" element={<Visitor />} />
            <Route
              path="/antmedia"
              element={<Publisher streamId="demo123" />}
            />{" "}
            {/* AntMedia Publisher Route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
