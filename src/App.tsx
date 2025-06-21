import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

/* UI chrome */
import Navbar            from './components/Navbar';
import Footer            from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';


/* Guards & admin shell */
import PrivateRoute      from './components/PrivateRoute';
import AdminRoute        from './components/AdminRoute';
import AdminLayout       from './components/AdminLayout';

/* Storefront */
import ProductListPage   from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage         from './pages/LoginPage';
import SignupPage        from './pages/SignupPage';
import ForgotPage        from './pages/ForgotPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import HomePage from './pages/HomePage';

/* Account suite */
import AccountLayout     from './pages/account/AccountLayout';
import ProfileTab        from './pages/account/ProfileTab';
import OrdersTab         from './pages/account/OrdersTab';
import SecurityTab       from './pages/account/SecurityTab';

/* Admin pages */
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminProducts     from './pages/admin/AdminProducts';
import AdminOrders       from './pages/admin/AdminOrders';
import ContactPage from './pages/ContactPage';

/* ── helper: hide navbar in /admin ────────────────────── */
function Chrome({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const hideNav = pathname.startsWith('/admin');   // sidebar handles nav there
  return (
    <>
      {!hideNav && <Navbar />}
      {children}
      <Footer />
    </>
  );
}
/* ─────────────────────────────────────────────────────── */

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Chrome>
          <ErrorBoundary>
          <Routes>

            {/* ---------- public storefront ---------- */}
            <Route path="/"                element={<HomePage />} />
            <Route path="/products"        element={<ProductListPage />} />
            <Route path="/products/:id"    element={<ProductDetailPage />} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/signup"          element={<SignupPage />} />
            <Route path="/forgot"          element={<ForgotPage />} />
            <Route path="/reset-password"  element={<ResetPasswordPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/order-confirmation/:id" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
            <Route path="/contact" element={<ContactPage />} />

            {/* ---------- customer account (public) ---------- */}


            {/* ---------- customer account (protected) ---------- */}
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <AccountLayout />
                </PrivateRoute>
              }
            >
              <Route index         element={<ProfileTab />} />
              <Route path="orders" element={<OrdersTab />} />
              <Route path="security" element={<SecurityTab />} />
            </Route>

            {/* ---------- admin area (protected) ---------- */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index          element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts  />} />
              <Route path="orders"   element={<AdminOrders    />} />
            </Route>

          </Routes>
          </ErrorBoundary>
        </Chrome>
      </BrowserRouter>
    </AuthProvider>
  );
}
