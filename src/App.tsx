import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Lazy-load secondary pages
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderBooks = lazy(() => import("./pages/OrderBooks"));
const Register = lazy(() => import("./pages/Register"));
const EUStages = lazy(() => import("./pages/EUStages"));

const AllStages = lazy(() => import("./pages/AllStages"));
const HomeRun = lazy(() => import("./pages/HomeRun"));
const FollowTheKust = lazy(() => import("./pages/FollowTheKust"));
const TourDuMontBlanc = lazy(() => import("./pages/TourDuMontBlanc"));
const Gallery = lazy(() => import("./pages/Gallery"));
const ParticipantHandbook = lazy(() => import("./pages/ParticipantHandbook"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Prints = lazy(() => import("./pages/Prints"));
const Photographers = lazy(() => import("./pages/Photographers"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/order-books" element={<OrderBooks />} />
            <Route path="/register" element={<Register />} />
            <Route path="/eu-stages" element={<EUStages />} />
            
            <Route path="/all-stages" element={<AllStages />} />
            <Route path="/homerun" element={<HomeRun />} />
            <Route path="/follow-the-kust" element={<FollowTheKust />} />
            <Route path="/tour-du-mont-blanc" element={<TourDuMontBlanc />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/participant-handbook" element={<ParticipantHandbook />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/prints" element={<Prints />} />
            <Route path="/photographers" element={<Photographers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
