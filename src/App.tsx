import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import { ScrollToTop } from "./components/ScrollToTop";

const RouteMapPage     = lazy(() => import("./pages/RouteMapPage"));
const NotFound         = lazy(() => import("./pages/NotFound"));
const OrderBooks       = lazy(() => import("./pages/OrderBooks"));
const Register         = lazy(() => import("./pages/Register"));
const EUStages         = lazy(() => import("./pages/EUStages"));
const AllStages        = lazy(() => import("./pages/AllStages"));
const FollowTheKust    = lazy(() => import("./pages/FollowTheKust"));
const TourDuMontBlanc  = lazy(() => import("./pages/TourDuMontBlanc"));
const Archive          = lazy(() => import("./pages/Gallery"));
const ParticipantHandbook = lazy(() => import("./pages/ParticipantHandbook"));
const Privacy          = lazy(() => import("./pages/Privacy"));
const Prints           = lazy(() => import("./pages/Prints"));
const Photographers    = lazy(() => import("./pages/Photographers"));
const SupportTheProject = lazy(() => import("./pages/SupportTheProject"));
const Shoreholders     = lazy(() => import("./pages/Shoreholders"));
const Timeline         = lazy(() => import("./pages/Timeline"));
const Iceland          = lazy(() => import("./pages/Iceland"));
const OrderSuccess     = lazy(() => import("./pages/OrderSuccess"));
const Contact          = lazy(() => import("./pages/Contact"));
const Events           = lazy(() => import("./pages/Events"));
const Book3            = lazy(() => import("./pages/Book3"));
const TrailRetreatGirona = lazy(() => import("./pages/TrailRetreatGirona"));
const CrossingMadeira  = lazy(() => import("./pages/CrossingMadeira"));

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ScrollToTop />
        <Routes>
          <Route path="/"                    element={<Index />} />
          <Route path="/order-books"         element={<OrderBooks />} />
          <Route path="/register"            element={<Register />} />
          <Route path="/eu-stages"           element={<EUStages />} />
          <Route path="/all-stages"          element={<AllStages />} />
          <Route path="/follow-the-kust"     element={<FollowTheKust />} />
          <Route path="/tour-du-mont-blanc"  element={<TourDuMontBlanc />} />
          <Route path="/archive"             element={<Archive />} />
          <Route path="/shoreholders"        element={<Shoreholders />} />
          <Route path="/timeline"            element={<Timeline />} />
          <Route path="/participant-handbook" element={<ParticipantHandbook />} />
          <Route path="/privacy"             element={<Privacy />} />
          <Route path="/prints"              element={<Prints />} />
          <Route path="/photographers"       element={<Photographers />} />
          <Route path="/support"             element={<SupportTheProject />} />
          <Route path="/iceland"             element={<Iceland />} />
          <Route path="/order-success"       element={<OrderSuccess />} />
          <Route path="/contact"             element={<Contact />} />
          <Route path="/events"              element={<Events />} />
          <Route path="/book-3"              element={<Book3 />} />
          <Route path="/trail-retreat-girona" element={<TrailRetreatGirona />} />
          <Route path="/crossing-madeira"    element={<CrossingMadeira />} />
          {/* Redirects for removed/renamed pages */}
          <Route path="/homerun"             element={<Navigate to="/" replace />} />
          <Route path="/gallery"             element={<Navigate to="/archive" replace />} />
          <Route path="/checkout"            element={<Navigate to="/" replace />} />
          <Route path="/route-map"           element={<RouteMapPage />} />
          <Route path="*"                    element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
