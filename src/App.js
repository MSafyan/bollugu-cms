// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/misc/ScrollToTop';
import { AppProvider } from './pages/general/context/AppContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <AppProvider>
        <Router />
      </AppProvider>
    </ThemeConfig>
  );
}
