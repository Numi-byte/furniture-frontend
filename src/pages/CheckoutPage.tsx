/*  src/pages/CheckoutPage.tsx  */

import {
  useState, lazy, Suspense, useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

/* ---------- styled ---------- */
const Page = styled.div`
  max-width: 960px;
  margin: 4rem auto;
  padding: 0 1.5rem;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse;
  th,td{ padding:.9rem; border-bottom:1px solid #e5e5e5; }
  th{ background:#fafafa; text-align:left; }
`;

const Btn = styled.button<{ disabled?: boolean }>`
  margin-top: 2.4rem;
  padding: 1rem 2.4rem;
  border: none; border-radius: 20px;
  font-weight: 600; font-size:1rem; color:#fff;
  background:${p=>p.disabled?'#aaa':'#0071e3'};
  cursor:${p=>p.disabled?'default':'pointer'};
  display:inline-flex;align-items:center;gap:.6rem;
`;

const spin = keyframes`to{transform:rotate(360deg)}`;
const InlineSpinner = styled.div`
  width:18px;height:18px;border:3px solid #fff;border-top-color:transparent;
  border-radius:50%;animation:${spin} .9s linear infinite;
`;

/* ---------- lazy overlay ---------- */
const LazyOverlay = lazy(() =>
  Promise.resolve({
    default: () => {
      const overlaySpin = keyframes`to{transform:rotate(360deg)}`;
      const Overlay = styled.div`
        position:fixed;inset:0;background:rgba(255,255,255,.7);
        backdrop-filter:blur(6px);display:grid;place-items:center;z-index:5000;
      `;
      const Loader = styled.div`
        width:56px;height:56px;border:5px solid #0071e3;
        border-top-color:transparent;border-radius:50%;
        animation:${overlaySpin} 1.1s linear infinite;
      `;
      return (
        <Overlay>
          <Loader/>
        </Overlay>
      );
    },
  }),
);

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { token } = useAuth();
  const nav = useNavigate();

  const [placing, setPlacing] = useState(false);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* guard: empty cart direct nav */
  useEffect(() => {
    if (items.length === 0 && !placing) nav('/products');
  }, [items.length, nav, placing]);

  const placeOrder = async () => {
    if (placing) return;          // double‑click guard
    setPlacing(true);

    try {
      const r = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });

      if (!r.ok) throw new Error('Order failed');
      const data = await r.json();   // { id, invoiceUrl? }

      clear();
      toast.success('Order placed!');
      nav(`/order-confirmation/${data.id}`, { state: { invoiceUrl: data.invoiceUrl } });
    } catch (err) {
      console.error(err);
      toast.error('Could not place order');
      setPlacing(false);
    }
  };

  return (
    <Page as={motion.div}
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:.4}}
    >
      <h1 style={{ fontSize: '2.2rem', marginBottom: '1.8rem' }}>
        Review your order
      </h1>

      <Table>
        <thead>
          <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.quantity}</td>
              <td>${i.price.toFixed(2)}</td>
              <td>${(i.price * i.quantity).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>Total</td>
            <td style={{ fontWeight: 700 }}>${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </Table>

      <Btn onClick={placeOrder} disabled={placing}>
        {placing && <InlineSpinner/>}
        {placing ? 'Placing order…' : 'Place order (no payment)'}
      </Btn>

      {/* lazy overlay spinner */}
      <Suspense fallback={<></>}>
        {placing && <LazyOverlay />}
      </Suspense>
    </Page>
  );
}
