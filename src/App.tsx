import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import { ScrollToTop } from "./components/ScrollToTop";

// Lazy-load secondary pages
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderBooks = lazy(() => import("./pages/OrderBooks"));
const Register = lazy(() => import("./pages/Register"));
const EUStages = lazy(() => import("./pages/EUStages"));
const AllStages = lazy(() => import("./pages/AllStages"));
const HomeRun = lazy(() => import("./pages/HomeRun"));
const FollowTheKust = lazy(() => import("./pages/FollowTheKust"));
const TourDuMontBlanc = lazy(() => import("./pages/TourDuMontBlanc"));
const Archive = lazy(() => import("./pages/Gallery"));
const ParticipantHandbook = lazy(() => import("./pages/ParticipantHandbook"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Prints = lazy(() => import("./pages/Prints"));
const Photographers = lazy(() => import("./pages/Photographers"));
const Checkout = lazy(() => import("./pages/Checkout"));
const SupportTheProject = lazy(() => import("./pages/SupportTheProject"));
const Shoreholders = lazy(() => import("./pages/Shoreholders"));
const Timeline = lazy(() => import("./pages/Timeline"));
const RouteMapPage = lazy(() => import("./pages/RouteMapPage"));

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/order-books" element={<OrderBooks />} />
            <Route path="/register" element={<Register />} />
            <Route path="/eu-stages" element={<EUStages />} />
            <Route path="/all-stages" element={<AllStages />} />
            <Route path="/homerun" element={<HomeRun />} />
            <Route path="/follow-the-kust" element={<FollowTheKust />} />
            <Route path="/tour-du-mont-blanc" element={<TourDuMontBlanc />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/gallery" element={<Navigate to="/archive" replace />} />
            <Route path="/shoreholders" element={<Shoreholders />} />
            <Route path="/route-map" element={<RouteMapPage />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/participant-handbook" element={<ParticipantHandbook />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/prints" element={<Prints />} />
            <Route path="/photographers" element={<Photographers />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/support" element={<SupportTheProject />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </HelmetProvider>
);

export default App;
