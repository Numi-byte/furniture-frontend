/*  src/pages/CheckoutPage.tsx
    Grande&Co · One‑page checkout + inline confirmation  */

import {
  useState, lazy, Suspense, useEffect, type ChangeEvent, type FormEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

/* ─────────── layout shells ─────────── */
const Page = styled.div`
  max-width: 960px;
  margin: 4rem auto;
  padding: 0 1.5rem;
`;
const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 2rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
`;

/* ─────────── table ─────────── */
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: .85rem; border-bottom: 1px solid #e5e5e5; }
  th { background: #fafafa; text-align: left; font-weight: 600; }
`;

/* ─────────── form atoms ─────────── */
const Field  = styled.div` display: flex; flex-direction: column; gap: .25rem; `;
const Label  = styled.label` font-size: .9rem; color: var(--gray-600); `;
const Input  = styled.input`
  padding: .75rem 1rem;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  &:focus { outline: none; border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(0,123,255,.14); }
`;
const Btn = styled.button<{disabled?:boolean}>`
  margin-top: 2rem; width: 100%; padding: 1rem;
  border: none; border-radius: 26px; font-weight: 600;
  font-size: 1rem; color: #fff;
  background: ${p=>p.disabled ? '#aaa' : 'var(--accent)'};
  cursor: ${p=>p.disabled ? 'default' : 'pointer'};
  display: flex; justify-content: center; align-items: center; gap: .6rem;
`;
const spin = keyframes`to{transform:rotate(360deg)}`;
const InlineSpinner = styled.div`
  width: 18px; height: 18px; border: 3px solid #fff;
  border-top-color: transparent; border-radius: 50%;
  animation: ${spin} .9s linear infinite;
`;

/* ─────────── overlay spinner (lazy) ─────────── */
const LazyOverlay = lazy(() =>
  Promise.resolve({
    default: () => {
      const overlaySpin = keyframes`to{transform:rotate(360deg)}`;
      const Overlay = styled.div`
        position: fixed; inset: 0; background: rgba(255,255,255,.65);
        backdrop-filter: blur(6px); display: grid; place-items: center; z-index: 5000;
      `;
      const Loader = styled.div`
        width: 56px; height: 56px; border: 5px solid var(--accent);
        border-top-color: transparent; border-radius: 50%;
        animation: ${overlaySpin} 1.1s linear infinite;
      `;
      return <Overlay><Loader/></Overlay>;
    },
  }),
);

/* ─────────── types ─────────── */
type Ship = {
  firstName:  string; lastName: string; email: string; phone: string;
  address1:   string; address2?: string; city: string; state?: string;
  postalCode: string; country: string;
};

/* ─────────── component ─────────── */
export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { token } = useAuth();
  const nav = useNavigate();

  /* success state */
  const [orderId, setOrderId] = useState<number | null>(null);
  const [placing, setPlacing] = useState(false);

  /* cart‑empty guard applies only if we haven't just placed an order */
  useEffect(() => {
    if (items.length === 0 && orderId === null) nav('/products');
  }, [items.length, orderId, nav]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  /* shipping form state */
  const [ship, setShip] = useState<Ship>({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', state: '',
    postalCode: '', country: '',
  });
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setShip({ ...ship, [e.target.name]: e.target.value });

  /* submit */
  const placeOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (placing) return;
    setPlacing(true);

    try {
      const res = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          shippingInfo: ship,
        }),
      });
      if (!res.ok) throw new Error('Order failed');
const order = await res.json();     // { id: number, ... }

setOrderId(order.id);
setPlacing(false);                  // <-- stop the spinner
clear();
toast.success('Order placed!');
    } catch (err) {
      console.error(err);
      toast.error('Could not place order');
      setPlacing(false);
    }
  };

  /* ─────────── UI ─────────── */
  return (
    <Page
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4 }}
    >
      <h1 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Checkout</h1>

      {/* ---------- SUCCESS ---------- */}
      <AnimatePresence>
        {orderId !== null && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>🎉</div>
              <h2 style={{ marginTop: '1rem' }}>Thank you for your purchase!</h2>
              <p style={{ margin: '1rem 0' }}>
                Your order <strong>#{orderId}</strong> has been received.
              </p>
              <p style={{ fontSize: '.95rem', color: 'var(--gray-700)' }}>
                We’ll send a confirmation email to <strong>{ship.email}</strong> and let you know
                once it ships to:
              </p>
              <p style={{ marginTop: '.8rem', lineHeight: 1.5 }}>
                {ship.firstName} {ship.lastName}<br />
                {ship.address1}{ship.address2 && `, ${ship.address2}`}<br />
                {ship.city}{ship.state && `, ${ship.state}`} {ship.postalCode}<br />
                {ship.country}
              </p>
              <Link to="/products" style={{ display: 'inline-block', marginTop: '2rem',
                  color: 'var(--accent)', fontWeight: 600 }}>
                Continue shopping →
              </Link>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- CHECKOUT FORM ---------- */}
      {orderId === null && (
        <Split>
          {/* Cart review */}
          <Card>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your cart</h2>
            <Table>
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {items.map(i => (
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
          </Card>

          {/* Shipping form */}
          <Card as="form" onSubmit={placeOrder}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Shipping details</h2>
            {/* name grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field><Label>First name</Label>
                <Input name="firstName" value={ship.firstName} onChange={onChange} required />
              </Field>
              <Field><Label>Last name</Label>
                <Input name="lastName" value={ship.lastName} onChange={onChange} required />
              </Field>
            </div>
            <Field><Label>Email</Label>
              <Input type="email" name="email" value={ship.email} onChange={onChange} required />
            </Field>
            <Field><Label>Phone</Label>
              <Input name="phone" value={ship.phone} onChange={onChange} required />
            </Field>
            <Field><Label>Address 1</Label>
              <Input name="address1" value={ship.address1} onChange={onChange} required />
            </Field>
            <Field><Label>Address 2 (optional)</Label>
              <Input name="address2" value={ship.address2} onChange={onChange} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field><Label>City</Label>
                <Input name="city" value={ship.city} onChange={onChange} required />
              </Field>
              <Field><Label>State / Region</Label>
                <Input name="state" value={ship.state} onChange={onChange} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field><Label>Postal code</Label>
                <Input name="postalCode" value={ship.postalCode} onChange={onChange} required />
              </Field>
              <Field><Label>Country</Label>
                <Input name="country" value={ship.country} onChange={onChange} required />
              </Field>
            </div>
            <Btn type="submit" disabled={placing}>
              {placing && <InlineSpinner />}
              {placing ? 'Placing order…' : 'Place order'}
            </Btn>
          </Card>
        </Split>
      )}

<Suspense fallback={<></>}>
  {placing && orderId === null && <LazyOverlay />}
</Suspense>
    </Page>
  );
}
