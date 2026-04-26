import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';
import { Navigate } from 'react-router-dom';
import { PlusCircle, Trash2, Package, LayoutGrid, Info } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchApi('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          imageUrl,
        }),
      });
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      loadProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this item from the catalog?')) return;
    try {
      await fetchApi(`/products/${id}`, { method: 'DELETE' });
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '6rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#000', marginBottom: '0.5rem' }}>
          Inventory Management
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Info size={16} /> Manage your premium product catalog and stock levels.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
        <div>
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              border: 'none',
              boxShadow: 'var(--shadow-md)',
              position: 'sticky',
              top: '120px',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                marginBottom: '2rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <PlusCircle size={20} color="var(--primary)" /> Add New Product
            </h3>
            <form
              onSubmit={handleAdd}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                  }}
                >
                  Product Name
                </label>
                <input
                  placeholder="e.g. Ultra Smartwatch"
                  className="search-input"
                  required
                  style={{ width: '100%', paddingLeft: '1rem', background: 'var(--bg-secondary)' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                  }}
                >
                  Detailed Description
                </label>
                <textarea
                  placeholder="Describe the product features..."
                  className="search-input"
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    paddingLeft: '1rem',
                    background: 'var(--bg-secondary)',
                    font: 'inherit',
                    paddingTop: '0.75rem',
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                    }}
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="search-input"
                    required
                    style={{
                      width: '100%',
                      paddingLeft: '1rem',
                      background: 'var(--bg-secondary)',
                    }}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                    }}
                  >
                    Stock Status
                  </label>
                  <div
                    className="search-input"
                    style={{
                      width: '100%',
                      paddingLeft: '1rem',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--secondary)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    In Stock
                  </div>
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                  }}
                >
                  Image URL
                </label>
                <input
                  placeholder="https://images.unsplash.com/..."
                  className="search-input"
                  style={{ width: '100%', paddingLeft: '1rem', background: 'var(--bg-secondary)' }}
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '1rem', padding: '1rem', borderRadius: 'var(--radius-sm)' }}
              >
                {loading ? 'Adding...' : 'Add to Catalog'}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <LayoutGrid size={20} color="var(--primary)" /> Active Catalog ({products.length})
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 700 }}>
              LAST UPDATED: JUST NOW
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: 'none',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '10px',
                      backgroundColor: '#f1f5f9',
                      backgroundImage: `url(${product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {product.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: 'var(--secondary)',
                          background: '#dcfce7',
                          padding: '2px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        ID: {product.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ))}
            {products.length === 0 && (
              <div
                style={{
                  padding: '5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '2px dashed var(--border-light)',
                }}
              >
                <Package
                  size={48}
                  color="var(--text-dim)"
                  style={{ marginBottom: '1rem', opacity: 0.5 }}
                />
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  No products in catalog
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
