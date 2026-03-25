import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { JellyModeProvider } from "./contexts/JellyModeContext";
import { JellyBackground } from './components/JellyBackground';
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import OctolapsePage from "./pages/OctolapsePage";

/**
 * ScrollToTop — ensures the page scrolls to the top whenever the route changes.
 * This is critical for project pages where the scroll animation must start from the top.
 */
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Specific routes must come before parameterized ones */}
      <Route path={"/project/octolapse"} component={OctolapsePage} />
      <Route path={"/project/:id"} component={ProjectPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <JellyModeProvider>
          <TooltipProvider>
            <Toaster />
            <JellyBackground />
            <ScrollToTop />
            <PageTransition>
              <Router />
            </PageTransition>
          </TooltipProvider>
        </JellyModeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
