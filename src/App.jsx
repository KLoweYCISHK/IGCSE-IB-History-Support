import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { AdminProvider } from '@/lib/AdminContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import HistoricalConcepts from '@/pages/HistoricalConcepts';
import Paper1 from '@/pages/Paper1';
import Paper2 from '@/pages/Paper2';
import Paper3 from '@/pages/Paper3';
import IA from '@/pages/IA';
import EE from '@/pages/EE';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import { TrackProvider } from '@/lib/TrackContext';
import IgcseTopic from '@/pages/igcse/IgcseTopic';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/historical-concepts" element={<HistoricalConcepts />} />
        <Route path="/paper-1" element={<Paper1 />} />
        <Route path="/paper-2" element={<Paper2 />} />
        <Route path="/paper-3" element={<Paper3 />} />
        <Route path="/ia" element={<IA />} />
        <Route path="/ee" element={<EE />} />
        <Route path="/igcse/:topic" element={<IgcseTopic />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AdminProvider>
            <TrackProvider>
              <AuthenticatedApp />
            </TrackProvider>
          </AdminProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App