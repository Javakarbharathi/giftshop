import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('giftshop_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync with server if logged in
  useEffect(() => {
    if (user?.id) {
      fetch(`http://127.0.0.1:8000/api/catalog/wishlist/?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const serverProducts = data.map(item => item.product).filter(Boolean);
            if (serverProducts.length > 0) {
              setWishlist(serverProducts);
            }
          }
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('giftshop_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        if (user?.id) {
          fetch(`http://127.0.0.1:8000/api/catalog/wishlist/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: product.id, user_id: user.id })
          }).catch(() => {});
        }
        return prev.filter(item => item.id !== product.id);
      } else {
        if (user?.id) {
          fetch(`http://127.0.0.1:8000/api/catalog/wishlist/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: product.id, user: user.id })
          }).catch(() => {});
        }
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      wishlistCount: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
