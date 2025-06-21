import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock,
  FiDollarSign,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiX
} from 'react-icons/fi';
import type { JSX } from 'react';

/* ───── styled components ───── */
const Container = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1.2rem;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${({ active }) =>
    active ? 'var(--accent)' : 'transparent'};
  color: ${({ active }) =>
    active ? '#fff' : 'var(--gray-600)'};
  border: 1px solid var(--accent);
  padding: 0.45rem 1.1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.25s, color 0.25s;

  &:hover {
    background: var(--accent);
    color: #fff;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 0.8rem;
    border-bottom: 1px solid var(--gray-200);
  }
  th {
    background: var(--gray-100);
    color: var(--gray-900);
    text-align: left;
  }
  tr:hover {
    background: var(--gray-50);
    cursor: pointer;
  }
  @media (max-width: 640px) {
    display: none;
  }
`;

const CardList = styled.div`
  display: none;
  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.25s;
  &:hover {
    box-shadow: var(--shadow-md);
    cursor: pointer;
  }
`;

const Chip = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  ${({ status }) => {
    switch (status) {
      case 'pending':
        return css`
          background: #fff6d9;
          color: #8a5800;
        `;
      case 'paid':
        return css`
          background: #e5f1ff;
          color: #0066d1;
        `;
      case 'shipped':
        return css`
          background: #e6f6ec;
          color: #12733d;
        `;
      case 'delivered':
        return css`
          background: #e6f9e6;
          color: #0b2f0b;
        `;
      case 'cancelled':
        return css`
          background: #fdeaea;
          color: #b72727;
        `;
      default:
        return '';
    }
  }}
`;

const Drawer = styled(motion.aside)`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 360px;
  background: var(--surface);
  border-left: 1px solid var(--gray-200);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  overflow-y: auto;
  z-index: 4100;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--gray-600);
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: var(--gray-900);
  }
`;

const Timeline = styled.div`
  margin-top: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--gray-900);
  font-size: 0.95rem;
`;

/* ───── helper functions ───── */
const statusOrder = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
] as const;
type Status = typeof statusOrder[number];

const icons: Record<Status, JSX.Element> = {
  pending: <FiClock />,
  paid: <FiDollarSign />,
  shipped: <FiPackage />,
  delivered: <FiCheckCircle />,
  cancelled: <FiXCircle />,
};

/* ───── component ───── */
export default function OrdersTab() {
  const { token } = useAuth();
  const [all, setAll] = useState<any[]>([]);
  const [filter, setFilter] = useState<Status | 'all'>('all');
  const [current, setCurrent] = useState<any | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/customer/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setAll)
      .catch(console.error);
  }, [token]);

  const rows =
    filter === 'all'
      ? all
      : all.filter((o) => o.status === filter);

  return (
    <Container>
      <Title>Your Orders</Title>

      <Tabs>
        {(['all', ...statusOrder] as (Status | 'all')[]).map((s) => (
          <Tab
            key={s}
            active={filter === s}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Tab>
        ))}
      </Tabs>

      {rows.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          {/* Desktop table */}
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} onClick={() => setCurrent(o)}>
                  <td>#{o.id}</td>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Chip status={o.status}>
                      {icons[o.status as Status]} {o.status}
                    </Chip>
                  </td>
                  <td>${o.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Mobile cards */}
          <CardList>
            {rows.map((o) => (
              <Card key={o.id} onClick={() => setCurrent(o)}>
                <div>
                  <strong>#{o.id}</strong>
                  <br />
                  <small>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <Chip status={o.status}>
                  {icons[o.status as Status]}
                </Chip>
              </Card>
            ))}
          </CardList>
        </>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {current && (
          <Drawer
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: 'tween', duration: 0.35 }}
          >
            <CloseBtn onClick={() => setCurrent(null)}>
              <FiX />
            </CloseBtn>

            <h3
              style={{
                fontSize: '1.4rem',
                fontWeight: 600,
                color: 'var(--gray-900)',
                marginBottom: '1rem',
              }}
            >
              Order #{current.id}
            </h3>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(current.createdAt).toLocaleString()}
            </p>

            <Timeline>
              {statusOrder.map((step) => (
                <Step key={step}>
                  {icons[step]}
                  <span
                    style={{
                      color:
                        step === current.status
                          ? 'var(--accent)'
                          : 'var(--gray-600)',
                    }}
                  >
                    {step.charAt(0).toUpperCase() +
                      step.slice(1)}
                  </span>
                </Step>
              ))}
            </Timeline>

            <h4
              style={{
                marginTop: '1.4rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--gray-900)',
              }}
            >
              Items
            </h4>
            {current.items.map((it: any) => (
              <div
                key={it.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid var(--gray-200)',
                }}
              >
                <span>{it.product.title}</span>
                <span>
                  {it.quantity} × ${it.unitPrice.toFixed(2)}
                </span>
              </div>
            ))}

            <p
              style={{
                marginTop: '1.6rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Total</span>
              <span>${current.total.toFixed(2)}</span>
            </p>
          </Drawer>
        )}
      </AnimatePresence>
    </Container>
  );
}
