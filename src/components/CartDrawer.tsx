// src/components/CartDrawer.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(4px);
  z-index: 4000;
`;

const Drawer = styled(motion.aside)`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 380px;
  background: var(--surface);
  border-left: 1px solid var(--gray-200);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  overflow-y: auto;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;

  img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: var(--radius-sm);
  }
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  color: var(--gray-600);
  font-size: .9rem;
  cursor: pointer;
  margin-top: .8rem;
  &:hover {
    color: var(--gray-900);
  }
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  cursor: pointer;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: filter .25s;
  &:hover {
    filter: brightness(1.08);
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, remove, clear } = useCart();
  const navigate = useNavigate();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Close on ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Drawer
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: 'tween', duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
              }}
            >
              <FiX size={22} />
            </button>

            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '1.4rem',
                color: 'var(--gray-900)',
              }}
            >
              Your Cart
            </h2>

            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {items.map((i) => (
                  <Row key={i.id}>
                    <img src={i.imageUrl} alt={i.title} />
                    <div style={{ flex: 1 }}>
                      <strong>{i.title}</strong>
                      <br />
                      <span style={{ color: 'var(--gray-600)' }}>
                        {i.quantity} × ${i.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => remove(i.id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'var(--gray-600)',
                      }}
                    >
                      ✕
                    </button>
                  </Row>
                ))}

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid var(--gray-200)',
                    margin: '1.4rem 0',
                  }}
                />

                <p
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                  }}
                >
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </p>

                <CheckoutBtn
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  disabled={items.length === 0}
                >
                  Checkout
                </CheckoutBtn>

                <ClearBtn onClick={clear}>Clear cart</ClearBtn>
              </>
            )}
          </Drawer>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
