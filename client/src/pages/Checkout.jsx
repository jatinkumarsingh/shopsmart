import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Truck,
  Package,
  ArrowLeft,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  MapPin,
} from 'lucide-react';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOrdered, setIsOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    return savedAddress
      ? JSON.parse(savedAddress)
      : {
          street: '',
          city: '',
          zipCode: '',
          state: '',
        };
  });
  const [addressSaved, setAddressSaved] = useState(() => {
    return localStorage.getItem('addressSaved') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(address));
  }, [address]);

  useEffect(() => {
    localStorage.setItem('addressSaved', addressSaved.toString());
  }, [addressSaved]);

  if (!user)
    return (
      <div
        className="container"
        style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Please login to finalize your purchase.
        </p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Sign In to Account
        </button>
      </div>
    );

  if (cartItems.length === 0 && !isOrdered) {
    return (
      <div
        className="container"
        style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}
      >
        <Package
          size={64}
          color="var(--text-dim)"
          style={{ marginBottom: '1.5rem', opacity: 0.5 }}
        />
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Your cart is empty
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Add some premium items to your vault to proceed.
        </p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Explore Catalog
        </button>
      </div>
    );
  }

  const handleSaveAddress = () => {
    if (address.street && address.city && address.state && address.zipCode) {
      setAddressSaved(true);
      setTimeout(() => setAddressSaved(false), 3000);
    } else {
      alert('Please fill in all address fields');
    }
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setIsOrdered(true);
      clearCart();
      setLoading(false);
    }, 2000);
  };

  if (isOrdered) {
    return (
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          paddingTop: '80px',
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '4rem',
            textAlign: 'center',
            maxWidth: '540px',
            border: 'none',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fadeIn 0.6s ease-out',
          }}
        >
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#dcfce7',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
            }}
          >
            <CheckCircle size={56} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800, color: '#000' }}>
            Order Complete!
          </h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
            }}
          >
            Success! Your order has been placed. {user.name}, your premium tech will be delivered
            via <strong>Cash on Delivery</strong> soon.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={18} /> BACK TO STORE
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontWeight: 800, color: '#000' }}>
            Review & Checkout
          </h2>

          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              marginBottom: '2rem',
              border: 'none',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: 800,
              }}
            >
              <Truck size={22} color="var(--primary)" /> SHIPPING DESTINATION
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: addressSaved ? '1fr 1fr 1fr' : '1fr 1fr',
                gap: '2rem',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: 'var(--text-dim)',
                    marginBottom: '0.25rem',
                  }}
                >
                  CUSTOMER
                </p>
                <p style={{ fontWeight: 600 }}>{user.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: 'var(--text-dim)',
                    marginBottom: '0.25rem',
                  }}
                >
                  ESTIMATED ARRIVAL
                </p>
                <p style={{ fontWeight: 600 }}>Standard (3-5 Days)</p>
                <p style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 700 }}>
                  FREE DELIVERY
                </p>
              </div>
              {addressSaved && (
                <div>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: 'var(--text-dim)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    SHIP TO
                  </p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{address.street}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-light)',
              }}
            >
              <h4
                style={{
                  fontSize: '0.9rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                }}
              >
                <MapPin size={18} color="var(--primary)" /> SHIPPING ADDRESS
              </h4>

              {!addressSaved ? (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Street Address"
                      className="search-input"
                      style={{ paddingLeft: '1rem' }}
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className="search-input"
                      style={{ paddingLeft: '1rem' }}
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                      type="text"
                      placeholder="State/Province"
                      className="search-input"
                      style={{ paddingLeft: '1rem' }}
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Zip Code"
                      className="search-input"
                      style={{ paddingLeft: '1rem' }}
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <button
                      onClick={handleSaveAddress}
                      className="btn btn-secondary"
                      style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
                    >
                      Save Address
                    </button>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px dashed var(--border-light)',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-main)' }}>{address.street}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                  </div>
                  <button
                    onClick={() => setAddressSaved(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Edit Address
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className="glass-card"
            style={{ padding: '2.5rem', border: 'none', boxShadow: 'var(--shadow-sm)' }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontWeight: 800,
              }}
            >
              <CreditCard size={22} color="var(--primary)" /> PAYMENT METHOD
            </h3>
            <div
              style={{
                border: '2px solid var(--primary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                  }}
                />
              </div>
              <div>
                <p style={{ fontWeight: 800, color: '#1e40af' }}>Cash on Delivery (COD)</p>
                <p style={{ fontSize: '0.85rem', color: '#60a5fa' }}>
                  Pay in person upon receipt of items
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              position: 'sticky',
              top: '120px',
              border: 'none',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', fontWeight: 800 }}>
              Order Summary
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                marginBottom: '2rem',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '2rem',
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        background: 'var(--bg-secondary)',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        {item.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#f1f5f9',
                            borderRadius: '4px',
                            padding: '2px',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              minWidth: '20px',
                              textAlign: 'center',
                              fontWeight: 700,
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '4px',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            display: 'flex',
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      ${item.price} ea
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-muted)',
                }}
              >
                <span>Shipping</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>FREE</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#000',
                  marginTop: '0.5rem',
                }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1.1rem',
              }}
              disabled={loading}
            >
              {loading ? 'Finalizing...' : 'Complete Purchase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
