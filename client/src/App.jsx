import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ShoppingBag, Search, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { XCircle, CheckCircle, Info as InfoIcon, AlertCircle, X } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';

const Navigation = () => {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize search state from URL
  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(location.search).get('search') || ''
  );

  // Synchronize search state with URL changes (e.g., when the user clears the search)
  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get('search') || '';
    setSearchQuery(searchParam);
  }, [location.search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update the URL as the user types
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    // If we're not on the home page, redirect to home with the search query
    if (location.pathname !== '/') {
      navigate(`/?${params.toString()}`);
    } else {
      navigate(`?${params.toString()}`, { replace: true });
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="brand">
          <div
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
            }}
          >
            <ShoppingBag size={20} />
          </div>
          ShopSmart
        </Link>

        <div className="nav-links-center"></div>

        <div className="nav-actions">
          <div className="search-container">
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-dim)',
              }}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <Link
              to="/checkout"
              style={{
                position: 'relative',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ShoppingCart size={22} />
              {getItemCount() > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.65rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {getItemCount()}
                </span>
              )}
            </Link>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <UserIcon size={22} />
              </button>

              {showDropdown && (
                <div className="profile-dropdown">
                  {user ? (
                    <>
                      <div className="dropdown-user-info">
                        <p className="dropdown-user-name">{user.name}</p>
                        <p className="dropdown-user-email">{user.email}</p>
                      </div>
                      <div className="dropdown-links">
                        <Link
                          to="/admin"
                          className="dropdown-item"
                          onClick={() => setShowDropdown(false)}
                        >
                          <UserIcon size={18} /> Admin Dashboard
                        </Link>
                        <Link
                          to="/checkout"
                          className="dropdown-item"
                          onClick={() => setShowDropdown(false)}
                        >
                          <ShoppingCart size={18} /> My Cart
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowDropdown(false);
                          }}
                          className="dropdown-item"
                          style={{
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            cursor: 'pointer',
                          }}
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="guest-actions">
                      <p style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>
                        Welcome to ShopSmart
                      </p>
                      <Link
                        to="/login"
                        className="dropdown-cta dropdown-cta-primary"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="dropdown-cta dropdown-cta-secondary"
                        onClick={() => setShowDropdown(false)}
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`toast toast-${notification.type}`}>
          <div className="toast-content">
            {notification.type === 'error' && <XCircle size={18} />}
            {notification.type === 'success' && (
              <div style={{ color: '#10b981' }}>
                <CheckCircle size={18} />
              </div>
            )}
            {notification.type === 'info' && (
              <div style={{ color: 'var(--primary)' }}>
                <InfoIcon size={18} />
              </div>
            )}
            {notification.type === 'warning' && (
              <div style={{ color: '#f59e0b' }}>
                <AlertCircle size={18} />
              </div>
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => removeNotification(notification.id)} className="toast-close">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <Navigation />
            <Toast />
            <main
              style={{ backgroundColor: 'white', minHeight: '80vh' }}
              className="page-transition"
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>

            <footer className="container">
              <div className="footer-grid">
                <div>
                  <Link to="/" className="brand" style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '6px',
                        borderRadius: '8px',
                        display: 'flex',
                      }}
                    >
                      <ShoppingBag size={20} />
                    </div>
                    ShopSmart
                  </Link>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Redefining the digital marketplace with handpicked premium tech essentials for
                    creators and professionals.
                  </p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Product</h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <Link to="/">Catalog</Link>
                    <Link to="/">New Arrivals</Link>
                    <Link to="/">Bestsellers</Link>
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Company</h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <Link to="/">About Us</Link>
                    <Link to="/">Careers</Link>
                    <Link to="/">Privacy Policy</Link>
                  </div>
                </div>
                <div>
                  <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Newsletter</h4>
                  <p
                    style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}
                  >
                    Get the latest updates on new drops.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="email"
                      placeholder="Email"
                      className="search-input"
                      style={{ flex: 1, paddingLeft: '1rem' }}
                    />
                    <button className="btn btn-primary" style={{ padding: '0.5rem' }}>
                      {'>'}
                    </button>
                  </div>
                </div>
              </div>
              <div
                style={{
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-dim)',
                  fontSize: '0.8rem',
                }}
              >
                <p>© 2024 SHOPSMART INC. ALL RIGHTS RESERVED.</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <span>TWITTER</span>
                  <span>INSTAGRAM</span>
                  <span>LINKEDIN</span>
                </div>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
