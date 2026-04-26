import { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import { Star, Zap, ChevronRight, SearchX } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useSearchParams } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchApi('/products');
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section className="container hero">
        <div className="hero-content reveal" style={{ animationDelay: '0.1s' }}>
          <div className="badge">• NEW COLLECTION 2026</div>
          <h1 className="hero-title">
            Future of
            <br />
            <span>Shopping</span>
          </h1>
          <p className="hero-desc">
            Experience the next generation of curated tech and lifestyle products designed for the
            modern era. Precision engineered, elegantly delivered.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary">
              Explore Now <Zap size={16} fill="white" />
            </button>
            <button className="btn btn-secondary">View Deals</button>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    marginLeft: i > 1 ? '-10px' : '0',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={`https://i.pravatar.cc/100?u=${i}`}
                    alt="user"
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Trusted by <strong>10k+</strong> active shoppers
            </p>
          </div>
        </div>

        <div className="hero-image float" style={{ animationDelay: '0.3s' }}>
          <img
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800"
            alt="Hero Product"
          />
          <div className="flash-sale-badge">
            <div
              style={{
                background: '#dcfce7',
                color: '#16a34a',
                padding: '8px',
                borderRadius: '8px',
              }}
            >
              <Zap size={20} fill="#16a34a" />
            </div>
            <div>
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                }}
              >
                Flash Sale
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 800 }}>Up to 40% Off</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ paddingBottom: '8rem' }}>
        <div
          className="reveal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            animationDelay: '0.5s',
          }}
        >
          <div>
            <h2
              style={{ fontSize: '2rem', fontWeight: 800, color: '#000', marginBottom: '0.5rem' }}
            >
              Featured Products
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Curated picks for your digital lifestyle.</p>
          </div>
          <Link
            to="/"
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            View Gallery <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-dim)' }}>
            Refreshing our inventory...
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <>
                <div
                  className="grid-products"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem',
                  }}
                >
                  {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                    <div
                      key={product.id}
                      className="product-card reveal"
                      style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                    >
                      <div className="card-image-wrap">
                        <div
                          className="card-badge"
                          style={{
                            backgroundColor: idx % 2 === 0 ? '#eff6ff' : '#fff7ed',
                            color: idx % 2 === 0 ? '#1e40af' : '#c2410c',
                          }}
                        >
                          {idx % 2 === 0 ? 'New Arrival' : 'Best Seller'}
                        </div>
                        <img
                          src={
                            product.imageUrl ||
                            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'
                          }
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '1.5rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                          }}
                        >
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000' }}>
                            {product.name}
                          </h3>
                          <span
                            style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}
                          >
                            ${product.price}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            marginBottom: '1rem',
                            height: '40px',
                            overflow: 'hidden',
                          }}
                        >
                          {product.description}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                fill={s <= 4 ? '#fbbf24' : 'none'}
                                color="#fbbf24"
                              />
                            ))}
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-dim)',
                                marginLeft: '4px',
                              }}
                            >
                              (128 reviews)
                            </span>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            style={{
                              backgroundColor: 'var(--primary)',
                              color: 'white',
                              padding: '0.4rem 1.25rem',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(29, 78, 216, 0.2)',
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {visibleCount < filteredProducts.length && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
                    <button
                      onClick={() => setVisibleCount(filteredProducts.length)}
                      className="btn btn-primary"
                      style={{
                        padding: '1rem 3rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      View More <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '5rem 2rem',
                  background: '#f8fafc',
                  borderRadius: '16px',
                }}
              >
                <div
                  style={{
                    background: '#f1f5f9',
                    color: '#64748b',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <SearchX size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  No products found
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  We couldn&apos;t find any products matching &quot;{searchQuery}&quot;. Try
                  different keywords.
                </p>
                <button
                  onClick={() => {
                    // This will clear the search in the URL which will then sync back to App.jsx
                    const params = new URLSearchParams(window.location.search);
                    params.delete('search');
                    window.history.replaceState({}, '', `?${params.toString()}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="btn btn-primary"
                  style={{ marginTop: '2rem' }}
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="container" style={{ marginBottom: '8rem' }}>
        <div
          className="cta-section"
          style={{
            backgroundImage: 'linear-gradient(115deg, #2563eb, #1d4ed8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
            Upgrade Your Lifestyle
          </h2>
          <p
            style={{ fontSize: '1.1rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '600px' }}
          >
            Join over 10,000+ tech enthusiasts who trust ShopSmart for their premium needs. Quality
            guaranteed with 30-day returns.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to="/register"
              className="btn"
              style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '1rem 2rem' }}
            >
              Get Started Today
            </Link>
            <button
              className="btn"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '1rem 2rem',
              }}
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
