// src/pages/admin/AdminDashboard.tsx

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

/* ───── styled components ───── */
const Section = styled.section`
  margin-bottom: 3rem;
`;
const H2 = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--gray-900);
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 0.7rem 1rem;
    text-align: left;
  }
  th {
    background: var(--gray-100);
    color: var(--gray-900);
  }
  tr:nth-child(even) {
    background: var(--gray-50);
  }
  tr:hover {
    background: var(--gray-200);
    cursor: pointer;
  }
`;
const Spinner = styled.div`
  border: 4px solid #eee;
  border-top: 4px solid var(--accent);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin: 4rem auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
const Pager = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;
const PageBtn = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 0.9rem;
  border: none;
  border-radius: 4px;
  background: ${({ disabled }) => (disabled ? '#ccc' : 'var(--accent)')};
  color: #fff;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    filter: brightness(0.9);
  }
`;

/* ───── color palette ───── */
const PIE_COLORS = ['#0071e3', '#40aaff', '#66b2ff', '#99ccff', '#cce6ff'];

/* ───── component ───── */
export default function AdminDashboard() {
  const { token } = useAuth();

  // data states
  const [statusCnt, setStatus]       = useState<any[]>([]);
  const [revDaily,  setDay]          = useState<any[]>([]);
  const [topProducts, setTop]        = useState<any[]>([]);
  const [revSummary, setSummary]     = useState<{ total?: number; avgOrder?: number }>({});
  const [visitors,  setVisitors]     = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

useEffect(() => {
  const headers = { Authorization: `Bearer ${token}` };

  Promise.all([
    fetch('http://localhost:3000/admin/orders/status-count', { headers }).then(r => r.json()).then(setStatus),
    fetch('http://localhost:3000/admin/orders/revenue-by-day', { headers }).then(r => r.json()).then(setDay),
    fetch('http://localhost:3000/admin/orders/top-products', { headers }).then(r => r.json()).then(setTop),
    fetch('http://localhost:3000/admin/orders/revenue-summary', { headers }).then(r => r.json()).then(setSummary),
    fetch('http://localhost:3000/admin/visitors', { headers }).then(r => r.json()).then(setVisitors),
    fetch('http://localhost:3000/subscribers', { headers }).then(r => r.json()).then(setSubscribers),
  ])
    .catch(err => console.error('Admin API error', err))
    .finally(() => setLoading(false));
}, [token]);

const deleteSubscriber = (id: number) => {
  if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
  fetch(`http://localhost:3000/subscribers/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => {
      if (r.ok) {
        setSubscribers(subs => subs.filter(s => s.id !== id));
      } else {
        console.error('Failed to delete subscriber');
      }
    })
    .catch(console.error);
};

  // loading + pagination
  const [loading,   setLoading]      = useState(true);
  const ITEMS_PER_PAGE               = 10;
  const [page,     setPage]          = useState(1);
  const totalPages                   = Math.ceil(visitors.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('http://localhost:3000/admin/orders/status-count', { headers }).then(r => r.json()).then(setStatus),
      fetch('http://localhost:3000/admin/orders/revenue-by-day',  { headers }).then(r => r.json()).then(setDay),
      fetch('http://localhost:3000/admin/orders/top-products',      { headers }).then(r => r.json()).then(setTop),
      fetch('http://localhost:3000/admin/orders/revenue-summary',   { headers }).then(r => r.json()).then(setSummary),
      fetch('http://localhost:3000/admin/visitors',                { headers }).then(r => r.json()).then(setVisitors),
    ])
      .catch(err => console.error('Admin API error', err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <Spinner />;
  }

  // slice visitor data for pagination
  const pageData = visitors.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <h1 style={{
        fontSize: '2.4rem',
        fontWeight: 700,
        marginBottom: '2rem',
        color: 'var(--gray-900)'
      }}>
        Admin Dashboard
      </h1>

      {/* Order Status Pie */}
      <Section>
        <H2>Order Status Distribution</H2>
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={statusCnt}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={90}
              >
                {statusCnt.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* Top Products Table */}
      <Section>
        <H2>Top Products</H2>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Units Sold</th>
              <th>Total $</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p: any) => (
              <tr key={p.id}>
                <td>{p.title ?? '—'}</td>
                <td>{p.units ?? 0}</td>
                <td>${Number(p.total ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      {/* Revenue Summary */}
      <Section>
        <H2>Revenue Summary</H2>
        <p style={{ fontSize: '1.1rem' }}>
          Total Revenue: <strong>${Number(revSummary.total ?? 0).toFixed(2)}</strong>
        </p>
        <p style={{ fontSize: '1.1rem' }}>
          Avg. Order Value: <strong>${Number(revSummary.avgOrder ?? 0).toFixed(2)}</strong>
        </p>
      </Section>

      {/* Revenue by Day Chart */}
      <Section>
        <H2>Revenue by Day (Last 30 Days)</H2>
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={revDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#0071e3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>
      <Section>
  <H2>Newsletter Subscribers</H2>
  {subscribers.length === 0 ? (
    <p>No subscribers yet.</p>
  ) : (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Joined</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {subscribers.map(s => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.email}</td>
            <td>{new Date(s.createdAt).toLocaleDateString()}</td>
            <td>
              <button
                onClick={() => deleteSubscriber(s.id)}
                style={{
                  padding: '0.3rem 0.6rem',
                  background: '#d9534f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}
</Section>

      {/* Recent Visitors - Paginated */}
      <Section>
        <H2>Recent Visitors</H2>
        {visitors.length === 0 ? (
          <p>No visitor data available.</p>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>IP Address</th>
                  <th>Country</th>
                  <th>User Agent</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((v: any) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.ip}</td>
                    <td>{v.country ?? '—'}</td>
                    <td style={{
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {v.userAgent ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pager>
              <PageBtn
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              >
                ← Previous
              </PageBtn>

              <span>
                Page {page} of {totalPages}
              </span>

              <PageBtn
                disabled={page >= totalPages}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next →
              </PageBtn>
            </Pager>
          </>
        )}
      </Section>
    </>
  );
}
