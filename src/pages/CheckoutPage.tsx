/*  src/pages/CheckoutPage.tsx
    Grande&Co · mobile‑first one‑page checkout
    2025‑06 rev.  */

import {
  useState,
  lazy,
  Suspense,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../api';

/* ─── helpers ─── */
const ACCENT = '#0071e3';
const radius = '18px';

/* ─── layout shells ─── */
const Page = styled.div`
  max-width: 960px;
  margin: 3.5rem auto 4rem;
  padding: 0 1rem;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2.4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;
const Card = styled.div`
  background: var(--surface, #fff);
  border: 1px solid var(--gray-200);
  border-radius: ${radius};
  padding: 1.85rem 1.6rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
`;

/* ─── progress pills ─── */
const PillsWrap = styled.ul`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 2rem;
  list-style: none;
`;
const Pill = styled.li<{ active?: boolean }>`
  flex: 1;
  text-align: center;
  padding: 0.55rem 0.4rem;
  font-size: 0.85rem;
  border-radius: 999px;
  background: ${({ active }) => (active ? ACCENT : '#e5e5e5')};
  color: ${({ active }) => (active ? '#fff' : '#555')};
`;

/* ─── table ─── */
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 0.8rem 0.4rem;
    border-bottom: 1px solid #ececec;
  }
  th {
    background: #fafafa;
    font-weight: 600;
    font-size: 0.9rem;
    text-align: left;
  }
  td:nth-child(2),
  td:nth-child(3),
  td:nth-child(4) {
    text-align: center;
  }
`;

/* ─── form bits ─── */
const Field = styled.div<{ half?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: ${({ half }) => (half ? '1' : 'auto')};
`;
const Label = styled.label`
  font-size: 0.85rem;
  color: var(--gray-600);
`;
const Input = styled.input`
  padding: 0.72rem 0.9rem;
  border: 1px solid var(--gray-300);
  border-radius: 10px;
  font-size: 0.95rem;
  background: #fafafa;

  &:focus {
    outline: none;
    border-color: ${ACCENT};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15);
  }
  @media (hover: none) {
    font-size: 1rem;
  }
`;
const Btn = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 1rem;
  margin-top: 1.6rem;
  border: none;
  border-radius: 24px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  background: ${({ disabled }) => (disabled ? '#a8a8a8' : ACCENT)};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
`;
const spin = keyframes`to { transform: rotate(360deg) }`;
const SmallSpin = styled.div`
  width: 18px;
  height: 18px;
  border: 3px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;

/* ─── overlay spinner ─── */
const LazyOverlay = lazy(() =>
  Promise.resolve({
    default: () => (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backdropFilter: 'blur(6px)',
          background: 'rgba(255,255,255,.65)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 5000,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            border: `6px solid ${ACCENT}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    ),
  })
);

/* ─── types ─── */
type Ship = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

/* ─── component ─── */
export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { token } = useAuth();
  const nav = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  /* redirect if cart emptied before order placed */
  useEffect(() => {
    if (!placing && orderId === null && items.length === 0) nav('/products');
  }, [items.length, placing, orderId, nav]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  /* shipping form state */
  const [ship, setShip] = useState<Ship>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setShip({ ...ship, [e.target.name]: e.target.value });

  /* POST */
  const placeOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (placing) return;
    setPlacing(true);

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          shippingInfo: ship,
        }),
      });

      if (!res.ok) throw new Error('Order failed');
      const order = await res.json();
      setOrderId(order.id);
      clear();
      toast.success('Order confirmed!');
    } catch (err) {
      console.error(err);
      toast.error('Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  /* ─── render ─── */
  return (
    <>
      <Page as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <PillsWrap>
          <Pill active={orderId === null}>1 · Shipping</Pill>
          <Pill active={orderId === null}>2 · Review</Pill>
          <Pill active={orderId !== null}>3 · Done</Pill>
        </PillsWrap>

        {/* ---------- SUCCESS ---------- */}
        <AnimatePresence>
          {orderId !== null && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem' }}>🎉</div>
                <h2 style={{ margin: '1rem 0 0.5rem' }}>
                  Thanks for your purchase!
                </h2>
                <p>
                  Order&nbsp;<strong>#{orderId}</strong> has been submitted.
                </p>
                <p
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.95rem',
                    color: 'var(--gray-700)',
                  }}
                >
                  Confirmation has been sent to <strong>{ship.email}</strong>.
                </p>

                <Link
                  to="/account/orders"
                  style={{
                    display: 'inline-block',
                    marginTop: '1.7rem',
                    color: ACCENT,
                    fontWeight: 600,
                  }}
                >
                  View my orders →
                </Link>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- FORM + CART ---------- */}
        {orderId === null && (
          <Grid>
            {/* — cart — */}
            <Card as={motion.div} layout>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                Order summary
              </h2>

              {/* mobile collapsible */}
              {items.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                  <Table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>€</th>
                        <th>Sub</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(i => (
                        <tr key={i.id}>
                          <td>{i.title}</td>
                          <td>{i.quantity}</td>
                          <td>{i.price.toFixed(2)}</td>
                          <td>{(i.price * i.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'right', fontWeight: 700 }}>
                          Total
                        </td>
                        <td style={{ fontWeight: 700 }}>{total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </Table>

                  {/* sticky total on small screens */}
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.85rem 1rem',
                      borderRadius: radius,
                      background: '#f8f8f8',
                      fontWeight: 600,
                      display: 'none',
                    }}
                    className="mobile-total"
                  >
                    Total: €{total.toFixed(2)}
                  </div>
                </>
              )}
            </Card>

            {/* — shipping form — */}
            <Card as="form" onSubmit={placeOrder}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                Shipping details
              </h2>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <Field half>
                  <Label>First name</Label>
                  <Input name="firstName" value={ship.firstName} onChange={onChange} required />
                </Field>
                <Field half>
                  <Label>Last name</Label>
                  <Input name="lastName" value={ship.lastName} onChange={onChange} required />
                </Field>
                <Field half>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={ship.email}
                    onChange={onChange}
                    required
                  />
                </Field>
                <Field half>
                  <Label>Phone</Label>
                  <Input name="phone" value={ship.phone} onChange={onChange} required />
                </Field>
                <Field>
                  <Label>Address 1</Label>
                  <Input name="address1" value={ship.address1} onChange={onChange} required />
                </Field>
                <Field>
                  <Label>Address 2 (optional)</Label>
                  <Input name="address2" value={ship.address2} onChange={onChange} />
                </Field>
                <Field half>
                  <Label>City</Label>
                  <Input name="city" value={ship.city} onChange={onChange} required />
                </Field>
                <Field half>
                  <Label>State / Region</Label>
                  <Input name="state" value={ship.state} onChange={onChange} />
                </Field>
                <Field half>
                  <Label>Postal code</Label>
                  <Input
                    name="postalCode"
                    value={ship.postalCode}
                    onChange={onChange}
                    required
                  />
                </Field>
                <Field half>
                  <Label>Country</Label>
                  <Input name="country" value={ship.country} onChange={onChange} required />
                </Field>
              </div>

              <Btn type="submit" disabled={placing}>
                {placing && <SmallSpin />}
                {placing ? 'Placing…' : 'Place order'}
              </Btn>
            </Card>
          </Grid>
        )}
      </Page>

      {/* global overlay spinner */}
      <Suspense fallback={<></>}>
        {placing && orderId === null && <LazyOverlay />}
      </Suspense>

      {/* basic sticky total for mobiles */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-total { display: block; position: sticky; bottom: 0; }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </>
  );
}
