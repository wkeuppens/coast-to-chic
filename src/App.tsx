import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OrderBooks from "./pages/OrderBooks";
import Register from "./pages/Register";
import EUStages from "./pages/EUStages";
import USStages from "./pages/USStages";
import AllStages from "./pages/AllStages";
import HomeRun from "./pages/HomeRun";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order-books" element={<OrderBooks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/eu-stages" element={<EUStages />} />
          <Route path="/us-stages" element={<USStages />} />
          <Route path="/all-stages" element={<AllStages />} />
          <Route path="/homerun" element={<HomeRun />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
